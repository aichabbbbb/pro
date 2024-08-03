# -*- coding: utf-8 -*-

from odoo import models, fields, api
import sys
import requests
import json, bs4
import logging
import time
from odoo.exceptions import UserError
_logger = logging.getLogger(__name__)


from thefuzz import fuzz


class ChatterWinserviceReply(models.Model):
    _inherit = 'mail.message'

    winservice_id = fields.Integer(string='Winservice Internal ID')
    winservice_type_sending = fields.Selection([("in", 'in'),("out", 'out') ])
    is_from_api = fields.Boolean(string='Is from API', default=False)


    @api.model
    def create(self, values):

        mail = super(ChatterWinserviceReply, self).create(values)
        if values.get("model") in ['helpdesk.ticket'] and mail.subtype_id.id == self.env.ref("mail.mt_comment").id  :
            try:
                mail.winservice_type_sending= values.get('winservice_type_sending', 'out')
                if mail.winservice_type_sending == 'out':
                    winservice_id_response = self.env["helpdesk.ticket"].browse(mail.res_id).setIncidents_support_id_reply(str(mail.body))
                    mail.winservice_id = winservice_id_response
            except:
                _logger.critical("bug: Impossible de mettre à jour les informations concernant le ticket, ligne 27")
                pass
        return mail

class HelpdeskPartnerWinservice(models.Model):
    _inherit = 'res.partner'

    winservice_id = fields.Integer(string='Winservice Internal ID')
    nationalCode = fields.Char(string='National Code')

class HelpdeskTicketWinservice(models.Model):
    _inherit = 'helpdesk.ticket'

    winservice_id = fields.Integer(string='Winservice Internal ID')
    is_from_api = fields.Boolean(string='Is from API', default=False)



    def write(self, values):
        # Add code here
        element =super(HelpdeskTicketWinservice, self).write(values)
        if values.get('stage_id') and self.stage_id.id == self.env.ref("helpdesk.stage_solved").id and self.winservice_id:
            try:
                self.setIncidents_support_id_close(self.winservice_id)
            except:
                pass
        else:
            pass
        return element

    def getIncidents(self):
       self.getIncidents_support_list()

    def do_api_call(self, endpoint_url):
        config_parameter = self.env['ir.config_parameter'].sudo()
        api_base_url = config_parameter.get_param("winservice_api.omd_winservice_api_base_url", '')
        auth_server_url = config_parameter.get_param("winservice_api.omd_winservice_auth_server_url", '')
        client_id = config_parameter.get_param("winservice_api.omd_winservice_client_id", '')
        client_secret = config_parameter.get_param("winservice_api.omd_winservice_client_secret", '')

        token = self.get_new_token()
        api_url = api_base_url + endpoint_url
        api_call_headers = {'Authorization': 'Bearer ' + token}
        api_call_response = requests.get(api_url, headers=api_call_headers, verify=False)
        return json.loads(api_call_response.text)

    def do_api_call_post(self, endpoint_url,body={}):
        token = self.get_new_token()
        config_parameter = self.env['ir.config_parameter'].sudo()
        api_base_url = config_parameter.get_param("winservice_api.omd_winservice_api_base_url", '')
        api_url = api_base_url + endpoint_url
        api_call_headers = {'Authorization': 'Bearer ' + token}
        api_call_response = requests.post(api_url, headers=api_call_headers, verify=False, json=body)
        return json.loads(api_call_response.text)

    def getIncidents_support_get_replys_by_id(self,entry_id):
        dico = self.do_api_call("/Incidents/support/%s" % entry_id )
        return dico



    def getIncidents_support_list(self, skip=0):
        total_elements = int( self.getIncidents_support_get_nmbr_items())
        skip_value = 10
        _logger.critical("-------------------------------->>>>")

        indices = list(range(0, total_elements, skip_value))

        # Ajouter 2960 à la fin de la liste d'indices
        indices.append(total_elements - 1)
        for indice in indices:
            dico = self.do_api_call("/Incidents/support/list?Status=1&Skip=" + str(indice) )
            # dico = self.do_api_call("/Incidents/support/list?Skip=" + str(indice) ) # supprimer
            _logger.critical(dico)
            if dico.get('result') and len(dico['result']) > 0:
                for entry in dico['result']['items']:
                    # to get existing incident
                    incident = self.env['helpdesk.ticket'].search([('winservice_id', '=', entry['id'])])
                    if not incident:
                        try:
                            partner_id = self.api_get_partner_id(entry)
                            user_id = self.api_get_user_id(entry)
                            incident = self.env['helpdesk.ticket'].create({
                                'winservice_id': entry['id'],
                                'name': entry['subject'] if entry.get('subject') else 'sans sujet',
                                'description': entry['content'] if entry.get('content') else 'sans description',
                                "partner_id": partner_id.id,
                                'is_from_api': True,
                                # 'user_id': user_id.id
                                "team_id": 3,
                                'priority': '2',
                                "stage_id": self.env.ref("helpdesk.stage_solved").id if entry["status"] == 2 else self.env.ref(
                                    "helpdesk.stage_new").id,
                            })
                        except:
                            _logger.error("-----------------<erreur critique>-------------------")
                            _logger.error(incident)
                            _logger.error(entry)
                            _logger.error(skip)
            self.env.cr.commit()




    def getIncidents_support_get_nmbr_items(self):
        dico = self.do_api_call("/Incidents/support/list?Status=1")
        # dico = self.do_api_call("/Incidents/support/list")   # supprimer
        if dico.get('result') and len(dico['result']) > 0:
            return dico['result']['totalItems']


    def api_get_user_id(self, entry):
        pass

    def api_get_partner_id(self, entry):
        companyId = entry['author']['companyId']
        company_partner_id = self.env['res.partner'].search([('idnat', '=', entry['author']['company']['nationalCode'])])

        if not company_partner_id:
            company_partner_id = self.env['res.partner'].create({
                'winservice_id': companyId,
                'name': entry['author']['company']['name'],
                'nationalCode' : str(entry['author']['company']['nationalCode']),
                'idnat' : str(entry['author']['company']['nationalCode']),
            })
        else:
            company_partner_id = company_partner_id[0]


        partner_id = self.env['res.partner'].search([('winservice_id', '=', entry['author']['id'])])
        if not partner_id:
            limit = 50
            partner_childs = self.env['res.partner'].search([('parent_id', '=', company_partner_id.id)])
            #dirty but needed
            if partner_childs:
                dico_fuzzy = {}
                for child in partner_childs:
                    lastname = entry['author']['lastname'] if entry['author']['lastname'] else ''
                    firstname = entry['author']['firstname'] if entry['author']['firstname'] else ''
                    try:
                        dico_fuzzy[fuzz.ratio(child.name, ' ' .join([firstname, lastname])  )] = child
                    except:
                        pass
                if dico_fuzzy:
                    list_done = [k for k, v in dico_fuzzy.items() if k > limit]
                    if list_done:
                        highest  = max(list_done)
                        if highest:
                            partner_id = dico_fuzzy[highest]

        if not partner_id:
            partner_id = company_partner_id
            # partner_id = self.env['res.partner'].create({
            #     'name': entry['author']['firstname'] + ' ' + entry['author']['lastname'],
            #     'email': entry['author']['email'],
            #     'winservice_id': entry['author']['id'],
            #     'parent_id': company_partner_id.id,
            # })
        return partner_id

    def getIncidents_support_teams_list(self):
        raise UserError("not implemented") # aka on s'en fout



    def getIncidents_support_teams_members_teamId_list(self,teamId):
       pass

    def setIncidents_support_id_close(self,id_winservice):
        dico = self.do_api_call_post("/Incidents/support/%(id)s/close" % {'id': id_winservice})
        _logger.info("winpharma api call: %s" % str(dico))


    def setIncidents_support_id_reply(self,message):
        if self.winservice_id:
            dico = self.do_api_call_post("/Incidents/support/%(id)s/reply" % {'id': self.winservice_id}, body={'content': message})
            _logger.info("winpharma api call (reply message): %s" % str(message))
            _logger.info("winpharma api call (answer to reply message): %s" % str(dico))
            if dico.get("result"):
                return dico["result"]

    def setIncidents_support_id_executor_userId(self,id_,userId):
       pass



    def get_new_token(self):
        token_req_payload = {'grant_type': 'client_credentials'}

        config_parameter = self.env['ir.config_parameter'].sudo()
        api_base_url = config_parameter.get_param("winservice_api.omd_winservice_api_base_url", '')
        auth_server_url = config_parameter.get_param("winservice_api.omd_winservice_auth_server_url", '')
        client_id = config_parameter.get_param("winservice_api.omd_winservice_client_id", '')
        client_secret = config_parameter.get_param("winservice_api.omd_winservice_client_secret", '')

        token_response = requests.post(auth_server_url,
                                       data=token_req_payload, verify=False, allow_redirects=False,
                                       auth=(client_id, client_secret))

        if token_response.status_code != 200:
            raise UserError("erreur %s " % token_response.status_code)

        tokens = json.loads(token_response.text)
        return tokens['access_token']

    @api.model
    def get_incidents_api(self):
        self.getIncidents_support_teams_list()


