// Filename: view/user/content/contact.js
define([
	'jquery',
	'underscore',
	'backbone',
	'jqueryvalidator',
	'utils',
	'model/user/product',
	'text!templates/user/content/contact.html'
], function($, _, Backbone,jqueryvalidator, Utils, ProductModel, Tpl){

	/*-------------------- CONFIG --------------------*/

	var View = Backbone.View.extend({
		initialize : function() { 

			var that = this;
			ProductModel.on("change", function(){ that.render(); });
			ProductModel.getOrders();
	    },
		/*-------------------- EVENTS --------------------*/

		events:{
			'submit .joinForm':'validate',
		}, 

		validate:function(e){ 

			Utils.form.validate(e,function(){ 
				Utils.popin.open({ data:{ title:'Error Demo', content: "Not available for the demo !" } }); 
				e.preventDefault(); 
			});
		},

		/*-------------------- RENDER --------------------*/

		render:function(){ 
			/* Check token */
			if (!Utils.storage.get('token')) {
				Utils.router.navigate('home',{ trigger:true });
            }

			var	compiledTemplate = _.template(Tpl,{ model: ProductModel });
			this.$el.html(compiledTemplate); 

			/* Apply validate form */	
			Utils.form.validatorForm('contactForm');
		}

	});

	/*-------------------- MODULE --------------------*/

	return {
		id:'Contact',
		level:7,
		view:View
	};

});
