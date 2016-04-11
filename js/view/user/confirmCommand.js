// Filename: view/user/confirmCommand.js
define([
	'jquery',
	'underscore',
	'backbone',
	'utils',
	'model/user/product',
	'text!templates/user/confirmCommand.html'
], function($, _, Backbone, Utils, ProductModel, Tpl){

	/*-------------------- CONFIG --------------------*/

	var View = Backbone.View.extend({
		initialize : function() {
			var that = this;

			ProductModel.on("change", function(){ that.render(); });
	    },
		/*-------------------- EVENTS --------------------*/

		events:{
			'click .detail em':'openDetail'
		}, 

		openDetail: function(e){
			var self   = jQuery(e.target),
				parent = self.parents(".large");

			if(parent.hasClass("open")){
				parent.nextAll().hide(); parent.removeClass("open");
			}else{
				parent.nextAll().show(); parent.addClass("open");
			}
		}, 

		/*-------------------- RENDER --------------------*/

		render:function(){ 
			/* Check token */
			if (!Utils.storage.get('token')) {
				Utils.router.navigate('home',{ trigger:true });
            }
			
			var	compiledTemplate = _.template(Tpl, { model:ProductModel });
			this.$el.html(compiledTemplate); 

			var quantity        = parseFloat(ProductModel.attributes.eq.quantity),
				atiPrice        = parseFloat(ProductModel.attributes.eq.atiPrice),
				shippingFees    = parseFloat(ProductModel.attributes.eq.shippingFees),
				tax             = parseFloat(ProductModel.attributes.eq.tax),
				priceHT         = parseFloat(ProductModel.attributes.etPrice),
				priceTTC        = parseFloat(atiPrice),
				shippingFeesTTC = parseFloat(shippingFees) + ( parseFloat(shippingFees) * tax ),
				shippingFeesHT  = parseFloat(shippingFees);

			var ttc = ( quantity * priceTTC ) + shippingFeesTTC,
				ht  = ( quantity * priceHT ) + shippingFeesHT,
				tax = (parseFloat(atiPrice)*tax) + ( parseFloat(shippingFees) * tax ); 

			$("p.ttc i").text( parseFloat(ttc).toFixed(2) ); 
			$("p.ht i ").text( parseFloat(ht).toFixed(2) ); 
			$("p.tax i").text( parseFloat(tax).toFixed(2) ); 
		}

	});

	/*-------------------- MODULE --------------------*/

	return {
		id:'MyOrders',
		level:15,
		view:View
	};

});
