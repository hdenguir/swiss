// Filename: view/user/myorders/myorders.js
define([
	'jquery',
	'underscore',
	'backbone',
	'utils',
	'model/user/product',
	'text!templates/user/myorders/myorders.html'
], function($, _, Backbone, Utils, ProductModel, Tpl){

	/*-------------------- CONFIG --------------------*/

	var View = Backbone.View.extend({
		initialize : function() { 
			var that = this;
			ProductModel.getOrders();
			ProductModel.on("change", function(){ that.render(); });
	    },
		/*-------------------- EVENTS --------------------*/

		events:{ 

		}, 						

		/*-------------------- RENDER --------------------*/

		render:function(){ 
			/* Check token */
			if (!Utils.storage.get('token')) {
				//Utils.router.navigate('home',{ trigger:true });
            }
			

			var	compiledTemplate = _.template(Tpl, { model:ProductModel } );

			this.$el.html(compiledTemplate); 
		}

	});

	/*-------------------- MODULE --------------------*/

	return {
		id:'MyOrders',
		level:14,
		view:View
	};

});
