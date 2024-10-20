from odoo import models, fields, api, _
from odoo.exceptions import ValidationError

import datetime
import logging
_logger = logging.getLogger(__name__)


class SaleOrder(models.Model):
    _inherit = 'sale.order'
    
    hotel_book_history_ids = fields.One2many('hotel.book.history', 'sale_order_id', string="Hotel Book History")
    hotel_book_history_count = fields.Integer(string="Hotel Book History Count", compute="_compute_hotel_book_history_count", store=False)
    hotel_book_id = fields.Many2one('hotel.book.history', string="Sale Order")

    # def creation_resrvatiom(self):
    #     for res in self:
    #         if res.order_line.product_id.start_in and res.order_line.product_id.start_out:
    #             available_room = res.env['hotel.room'].search(
    #                 [('room_type', '=', res.order_line.product_template_id.id), ('state', '=', 'available')], limit=1)
    #
    #             resrvation = res.env['hotel.book.history'].create({
    #                 'partner_id': res.partner_id.id,
    #                 # 'room_ids': [(4, 5)],
    #
    #                 'check_in': res.order_line.product_id.start_in,
    #                 'check_out': res.order_line.product_id.start_out,
    #                 'sale_order_id': res.id,
    #
    #             })
    #
    #             res.hotel_book_history_ids = [(4, resrvation.id)]
    #             for rec in available_room:
    #                 res.hotel_book_history_ids.room_ids = [(4, rec.id)]
    #
    #             # self.amount_total =  self.amount_total * resrvation.duration
    #             res.order_line.write({
    #                 'duration': resrvation.duration,
    #
    #             })
    #             res.hotel_book_history_ids.action_checkin()
    @api.depends('hotel_book_history_ids')
    def _compute_hotel_book_history_count(self):
        for record in self:
            record.hotel_book_history_count = len(record.hotel_book_history_ids)
            
    def action_view_hotel_book_history(self):
        self.ensure_one()
        action = self.env.ref('ism_hotel.action_hotel_book_history_all').read()[0]
        action['domain'] = [('sale_order_id', '=', self.id)]
        return action

    @api.depends('order_line.price_subtotal', 'order_line.price_tax', 'order_line.price_total')
    def _compute_amounts(self):
        res = super(SaleOrder, self)._compute_amounts()
        # TODO : compute amount_untaxed, amount_tax, amount_total will be counted with duration
        print('compute amounts')
        for order in self:
            amount_untaxed = amount_tax = 0.0
            for line in order.order_line:
                amount_untaxed += line.price_subtotal
                amount_tax += line.price_tax
            order.update({
                'amount_untaxed': amount_untaxed,
                'amount_tax': amount_tax,
                'amount_total': amount_untaxed + amount_tax,
            })
            print('amount_total : ', order.amount_total)
            
        return res
    
    @api.depends_context('lang')
    @api.depends('order_line.tax_id', 'order_line.price_unit', 'amount_total', 'amount_untaxed', 'currency_id')
    def _compute_tax_totals(self):
        res = super(SaleOrder, self)._compute_tax_totals()
        for order in self:
            order_lines = order.order_line.filtered(lambda x: not x.display_type)
            
            tax_model = self.env['account.tax']

            tax_base_line_dicts = []

            for order_line in order_lines:
                tax_base_line_dict = order_line._convert_to_tax_base_line_dict()
                tax_base_line_dict['quantity'] *= order_line.duration
                tax_base_line_dicts.append(tax_base_line_dict)

            currency_to_use = order.currency_id or order.company_id.currency_id
            tax_totals = tax_model._prepare_tax_totals(tax_base_line_dicts, currency_to_use)
            order.tax_totals = tax_totals

            # for line in order_lines:
            #     fields_dict = {}
            #     for key in line.fields_get():
            #         fields_dict[key] = line[key]
            #     print('fields_dict : ', fields_dict)
        
        return res






    def create_reservation(self, result):
        order_lines = []
        room_types = []
        room_type_dict_qty = {}
        room_type_dict_str_join = {}

             # create order lines and notes below for each type of room
        for line in order_lines:
            room_types.append((0, 0, {
                'room_type': line.product_template_id.id,
                'name': line.name,

            }))
        if result.start_in :
            resr = self.env['hotel.book.history'].create({
                'partner_id': result.partner_id.id,
                # 'room_ids': room_types,
                'check_in': result.start_in,
                'check_out': result.start_out,
            })
        return resr