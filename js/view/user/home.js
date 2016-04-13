// Filename: view/user/profile.js
define([
	'jquery',
	'underscore',
	'backbone',
	'utils',
    'model/user/profile',
    'model/user/product',
	'text!templates/user/home.html'
], function($, _, Backbone, Utils, ProfileModel, ProductModel, Tpl){

	/*-------------------- CONFIG --------------------*/

	var View = Backbone.View.extend({
		initialize : function() {
			this.render(); 
	    },
		/*-------------------- EVENTS --------------------*/

		events:{ 
			'click .scancode':'scanCode'
		},
		scanCode:function(){ 
			if (!Utils.storage.get('token')) {
				Utils.popin.open({ data:{ title:'Error', content: "Invalid token" } });
				Utils.router.navigate('home',{ trigger:true });
            }

			var scanner = cordova.require("cordova/plugin/BarcodeScanner");  
	        window.plugins.barcodeScanner.scan( function (result) {

	            var text = (result.text) ? jQuery.parseJSON(result.text) : { productId: 8, storeId: 1},
	            	data = {
						token: Utils.storage.get('token').key,
						storeId: text.storeId,
						productId: text.productId
					};  

				ProductModel.attributes.storeId = text.storeId;
				ProductModel.attributes.productId = text.productId;
			
				Utils.service.call({
					name:'order',
					data:data,
					success:function(response){  
						var res = jQuery.parseJSON(response);   

						if(res.hasOwnProperty('success') && res.success == false){
							Utils.popin.open({ data:{ title:'Error', content: res.message.msg } });
							Utils.service.finish();
							return;
						}

						ProductModel.attributes.name = res.name;
						ProductModel.attributes.stock = res.stock;
						ProductModel.attributes.etPrice = res.etPrice;
						ProductModel.attributes.currency = res.currency;
						ProductModel.attributes.shippingAddresses = res.addresses;  
						ProductModel.attributes.cards = res.cards;  
						ProductModel.attributes.photo = res.photo;  
						
						Utils.router.navigate('user/mycommand',{ trigger:true });  
						Utils.service.finish();
					},
					error:function(response){
						alert("Error Ajax");
						Utils.service.finish();
					}
				});


	        }, function (error) { 
	            alert("Scanning failed: ", error); 
	        });

	        return false;
		},
		/*-------------------- RENDER --------------------*/

		render:function(){ 
			/* Check token */
			if (!Utils.storage.get('token')) {
				Utils.router.navigate('home',{ trigger:true });
            }
			
			var	compiledTemplate = _.template(Tpl,{ model: ProfileModel });
			this.$el.html(compiledTemplate); 
		}

	});

	/*-------------------- MODULE --------------------*/

	return {
		id:'Profile',
		level:9,
		view:View
	};

});
