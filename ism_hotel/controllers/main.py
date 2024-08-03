
from odoo.http import Controller, request, route
import logging
from odoo.addons.website_sale_product_configurator.controllers.main import WebsiteSaleProductConfiguratorController

_logger = logging.getLogger(__name__)


class WebsiteSaleProductConfiguratorControllerhirite(WebsiteSaleProductConfiguratorController):

    @route(
        '/sale_product_configurator/show_advanced_configurator',
        type='json', auth='public', methods=['POST'], website=True,
    )
    def show_advanced_configurator(
        self, product_id, variant_values, add_qty=1, force_dialog=False, **kw,
    ):
        res = super(WebsiteSaleProductConfiguratorControllerhirite, self).show_advanced_configurator(product_id, variant_values, add_qty=1, force_dialog=False, **kw,)


        _logger.critical("jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj")
        start_in = kw.get("start_in")
        _logger.critical("start_in")
        _logger.critical(start_in)
        _logger.critical("jjjjjjjjjjjjjjjjjjj")
        _logger.critical(start_in)
        start_out = kw.get("start_out")
        _logger.critical("start_out")
        _logger.critical(start_out)

        product = request.env['product.product'].browse(int(product_id))
        product.start_in = start_in
        product.start_out = start_out
        product_template = product.product_tmpl_id
        product_template.start_in = start_in
        product_template.start_out = start_out
        return res