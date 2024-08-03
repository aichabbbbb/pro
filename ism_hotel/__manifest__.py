{
    'name': 'Hotel Management System',
    'version': '1.0.1',
    'summary': 'Manage rooms, reservations, and sales',
    'description': 'This module allows you to manage hotel rooms, reservations, and sales in the "Hotel Management" module.',
    'category': 'Sales',
    'author': 'Indokoding Sukses Makmur',
    'website': 'https://www.indokoding.com',
    'license': 'LGPL-3',
    'depends': [

        "base",
        "mail",
        "sale",
        "purchase",
        "account",
        "web",
        "website",
        "website_sale",
        "website_sale_product_configurator",
        "sale_product_configurator",


    ],
    'sequence': 0,
    'data': [
        'data/sequence.xml',
        'data/hotel_room_data.xml',

        'security/ir.model.access.csv',

        'views/room_views.xml',
        'views/product_views.xml',
        'views/amenity_views.xml',
        'views/book_history_views.xml',
        'views/dashboard_views.xml',
        'views/sale_order_views.xml',
        'views/account_move_views.xml',

        'report/ir_actions_report_templates.xml',

        'views/menu_views.xml',

    ],
    'assets': {

        'web.assets_frontend': [
            ('replace', 'website_sale_product_configurator/static/src/js/sale_product_configurator_modal.js',
             'ism_hotel/static/src/js/sale_product_configurator_modal.js'),
            ('replace', 'website_sale_product_configurator/static/src/js/website_sale_options.js',
             'ism_hotel/static/src/js/website_sale_options.js'),
        ],
    },

    'installable': True,
    'auto_install': False,
    'application': True,
    'images': [
        'static/description/banner.png',
    ]
}
