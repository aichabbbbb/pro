# -*- coding: utf-8 -*-

from odoo import models, fields,api
from odoo.exceptions import UserError
import csv, tempfile, datetime, ftplib,os,re, logging

_logger = logging.getLogger(__name__)

class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    
    omd_winservice_api_base_url = fields.Char(string="Server Rest URL",default_model="helpdesk.ticket",)
    omd_winservice_auth_server_url = fields.Char(string="Auth Server URL", default_model="helpdesk.ticket", )
    omd_winservice_client_id = fields.Char(string="Client ID",default_model="helpdesk.ticket",)
    omd_winservice_client_secret = fields.Char(string="Client Secret",default_model="helpdesk.ticket",)



    @api.model
    def get_values(self):
        config_parameter = self.env['ir.config_parameter'].sudo()
        values = super(ResConfigSettings, self).get_values()
        
        values['omd_winservice_api_base_url'] = config_parameter.get_param("winservice_api.omd_winservice_api_base_url", '')
        values['omd_winservice_auth_server_url'] = config_parameter.get_param("winservice_api.omd_winservice_auth_server_url", '')
        values['omd_winservice_client_id'] = config_parameter.get_param("winservice_api.omd_winservice_client_id", '')
        values['omd_winservice_client_secret'] = config_parameter.get_param("winservice_api.omd_winservice_client_secret", '')
        
        return values

    def set_values(self):
        config_parameter = self.env['ir.config_parameter'].sudo()
        config_parameter.set_param("winservice_api.omd_winservice_api_base_url", self.omd_winservice_api_base_url)
        config_parameter.set_param("winservice_api.omd_winservice_auth_server_url", self.omd_winservice_auth_server_url)
        config_parameter.set_param("winservice_api.omd_winservice_client_id", self.omd_winservice_client_id)
        config_parameter.set_param("winservice_api.omd_winservice_client_secret", self.omd_winservice_client_secret)
        
        super(ResConfigSettings, self).set_values()

