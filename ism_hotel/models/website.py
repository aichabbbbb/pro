from odoo import _, _lt, SUPERUSER_ID, api, fields, models, tools
from odoo.http import request
from odoo.osv import expression

from odoo.addons.http_routing.models.ir_http import url_for
import logging

_logger = logging.getLogger(__name__)


class SaleOrderline(models.Model):
    _inherit = "sale.order.line"

    start_in = fields.Date(string="date in", help="Date from which the mandate can be used (inclusive).")
    start_out = fields.Date(string="date out", help="Date from which the mandate can be used (inclusive).")

    def creation_resrvatiom(self):
        for res in self:
            if res.order_line.product_id.start_in and res.order_line.product_id.start_out:
                available_room = res.env['hotel.room'].search(
                    [('room_type', '=', res.order_line.product_template_id.id), ('state', '=', 'available')], limit=1)

                resrvation = res.env['hotel.book.history'].create({
                    'partner_id': res.partner_id.id,
                    # 'room_ids': [(4, 5)],

                    'check_in': res.order_line.product_id.start_in,
                    'check_out': res.order_line.product_id.start_out,
                    'sale_order_id': res.id,

                })

                res.hotel_book_history_ids = [(4, resrvation.id)]
                for rec in available_room:
                    res.hotel_book_history_ids.room_ids = [(4, rec.id)]

                # self.amount_total =  self.amount_total * resrvation.duration
                res.order_line.write({
                    'duration': resrvation.duration,

                })
                res.hotel_book_history_ids.action_checkin()


class SaleOrder(models.Model):
    _inherit = "sale.order"

    def creation_resrvatiom(self):
        for res in self:
            if res.order_line.product_id.start_in and res.order_line.product_id.start_out:
                available_room = res.env['hotel.room'].search(
                    [('room_type', '=', res.order_line.product_template_id.id), ('state', '=', 'available')], limit=1)

                resrvation = res.env['hotel.book.history'].create({
                    'partner_id': res.partner_id.id,
                    # 'room_ids': [(4, 5)],

                    'check_in': res.order_line.product_id.start_in,
                    'check_out': res.order_line.product_id.start_out,
                    'sale_order_id': res.id,

                })

                res.hotel_book_history_ids = [(4, resrvation.id)]
                for rec in available_room:
                    res.hotel_book_history_ids.room_ids = [(4, rec.id)]

                # self.amount_total =  self.amount_total * resrvation.duration
                res.order_line.write({
                    'duration': resrvation.duration,

                })
                res.hotel_book_history_ids.action_checkin()

    start_in = fields.Date(string="date in", help="Date from which the mandate can be used (inclusive).")
    start_out = fields.Date(string="date out", help="Date from which the mandate can be used (inclusive).")


class Websitehirite(models.Model):
    _inherit = 'website'

    @api.model_create_multi
    def sale_get_order(self, vals_list):
        configs = super().create(vals_list)
        for config in configs:
            if config.twitter_api_key or config.twitter_api_secret or config.twitter_screen_name:
                config._check_twitter_authorization()
        return configs
