import logging

from odoo import models, fields, api, _

class ProductTemplate(models.Model):
    _inherit = 'product.template'
    
    is_room = fields.Boolean(string="Is room", help="Check if this product is a hotel's room type")
    max_allowed_person = fields.Integer(string="Max allowed person", default=1)
    amenity_line_ids = fields.One2many('hotel.amenity.line', 'product_id', string="Amenities")
    room_ids = fields.One2many('hotel.room', 'room_type', string="Rooms")

    start_in = fields.Date(string="date in", help="Date from which the mandate can be used (inclusive).")
    start_out = fields.Date(string="date out", help="Date from which the mandate can be used (inclusive).")

    # x_dt = fields.Integer("X", default=1,compute="_compute_room_avalable",store=True)
    available_room = fields.Boolean("X",default=False,  compute="_compute_room_avalable", store=True)


    @api.depends("room_ids.state")
    @api.onchange("room_ids.state")
    def _compute_room_avalable(self):
        list = []
        logging.critical("llllllllllllllllll")
        for res in self:
            hotel_room_occupied = res.env['hotel.room'].search([
                ('room_type', '=', res.id),
                ('state', '=', 'occupied'),

            ])
            hotel_room = res.env['hotel.room'].search([
                ('room_type', '=', res.id),


            ])
            if len(hotel_room) == len(hotel_room_occupied):
                res.available_room = True
                logging.info(hotel_room)
                list.append(hotel_room)
                logging.critical(len(hotel_room))
            else:
                res.available_room = False







