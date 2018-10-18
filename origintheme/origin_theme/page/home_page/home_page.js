frappe.pages['home-page'].on_page_load = function (wrapper) {
	frappe.require([

	], function () {
		frappe.homepage = new frappe.Homepage(wrapper);
	});
};


frappe.Homepage = Class.extend({
	init: function (parent) {
		frappe.ui.make_app_page({
			parent: parent,
			title: __(""),
			single_column: true
		});

		this.parent = parent;
		this.page = this.parent.page;
		this.make();
	},


	make: function () {
		var me = this;
		this.body = $('<div></div>').appendTo(this.page.main);
		var data = "";
		var $container = $(frappe.render_template('homepage', data)).appendTo(this.body);
		me.render_property_status_chart();
		me.render_todays_transaction();
		me.render_widget("unpaid_client");
		me.render_widget("unpaid_owner");
		me.render_widget("open_lead_count");
		me.render_table("expiring_rent_properties");
	},

	render_property_status_chart: function () {
		frappe.call({
			method: "origintheme.origin_theme.page.home_page.home_page.get_property_status",
			args: {},
			callback: function (r) {
				if (r.message != undefined) {
					let results = r.message || [];
					let graph_items = results[1];
					cust_colors = ['#78fca4', '#f7fc78', '#78a4fc', '#fc7986', '#788cfc']
					var chart = c3.generate({
						bindto: '#get_property_status',
						data: {
							columns: graph_items,
							type: 'pie',
						},
						color: {
							pattern: cust_colors
						},
						pie: {
							label: {
								format: function (value, ratio, id) {
									return value;
								}
							}
						}
					});
					$("#property_status_header").html(__("Property Status"));
				}
				$("#property_status_header").html(__("Property Status"));
			}
		});
	},

	render_todays_transaction: function () {
		frappe.call({
			method: "origintheme.origin_theme.page.home_page.home_page.get_todays_transaction",
			args: {},
			callback: function (r) {
				if (r.message != undefined) {
					let results = r.message || [];
					let graph_items = results[1];
					if (graph_items==0){graph_items=[[__("No Transaction today"),0]]}
					cust_colors = ['#78fca4', '#f7fc78', '#78a4fc', '#fc7986', '#788cfc']
					var chart = c3.generate({
						bindto: '#get_todays_transaction',
						data: {
							columns: graph_items,
							type: 'pie',
						},
						color: {
							pattern: cust_colors
						},
						pie: {
							label: {
								format: function (value, ratio, id) {
									return value;
								}
							}
						}
					});
					$("#get_todays_transaction_header").html(__("Today's Transactions"));
				}
				$("#get_todays_transaction_header").html(__("Today's Transactions"));
			}
		});
	},
	render_widget(function_name) {
		var me = this;
		const company = frappe.defaults.get_default('company');
		const currency = frappe.get_doc(":Company", company).default_currency;
		frappe.call({
				method: "origintheme.origin_theme.page.home_page.home_page.get_" + function_name,
			})
			.then(function (r) {
				if (!r.exc && r.message) {
					let data = r.message;
					if (function_name=='open_lead_count') {
						amount = data[1]
					} else {
						amount = format_currency(data[1], currency)
					}
					if (data) {
						$("#" + function_name + "_name").html(__(data[0]));
						$("#" + function_name + "_value").html(amount);
					}
				}
			});
	},
	render_table(function_name) {
		var me = this;
		frappe.call({
				method: "origintheme.origin_theme.page.home_page.home_page.get_upcoming_rent_expiry_list",
			})
			.then(function (r) {
				if (!r.exc && r.message) {
					let data = r.message[1];
					if (data) {

					
							const html = `
								<table class="table table-bordered"  style="background-color: #f9f9f9;">
									<thead><tr><th>${__("#")}</th><th>${__("Property Name")}</th><th>${__("Expiry")}</th><th>${__("Client")}</th><th>${__("Telephone")}</th><th>${__("Email")}</th></tr></thead>
									<tbody>
										${data.map((c,i) => `<tr><td>${i+1}</td><td><a class="grey list-id ellipsis"
										href="#Form/Property/${c[2]}"> ${c[0]} </a></td><td>${c[1]}</td><td>${c[3]}</td><td>${c[4]}</td><td>${c[5]}</td>
										</tr>`
										).join('')}
									</tbody>
								</table>`
								$("#" + function_name).html(html);
						
					}
					$("#get_upcoming_rent_expiry_header").html(__("List of Properties Near Expiry"));
				}
			});
	},

	
});