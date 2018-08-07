frappe.pages['real-estate-reports'].on_page_load = function (wrapper) {
	frappe.require([

	], function () {
		frappe.homepage = new frappe.Homepage(wrapper);
	});
};


frappe.Homepage = Class.extend({
	init: function (parent) {
		frappe.ui.make_app_page({
			parent: parent,
			title: __("Real Estate Reports"),
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
		var $container = $(frappe.render_template('real_estate_reports', data)).appendTo(this.body);
	}
});