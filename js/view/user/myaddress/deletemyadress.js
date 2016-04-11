// Filename: view/user/myaddress/deletemyadress.js
define([
	'jquery',
	'underscore',
	'backbone',
	'utils',
    'model/user/addresses',
	'text!templates/user/myaddress/deletemyadress.html'
], function($, _, Backbone, Utils, AddressesModel, Tpl){

	/*-------------------- CONFIG --------------------*/

	var View = Backbone.View.extend({
		initialize : function() {
			var that = this;

			AddressesModel.on("change", function(){ that.render(); });

			if( typeof AddressesModel.get("addresses")[AddressesModel.get("id")] == "undefined"){
				Utils.router.navigate('user/myaddress/myadress',{ trigger:true });
			}
			
	    },
		/*-------------------- EVENTS --------------------*/

		events:{ 
			'click .delete':'deleteAddress',
		}, 

		deleteAddress:function(e){  
			var model   = AddressesModel.get("deleteAddresses"),
				address   = AddressesModel.get("addresses")[AddressesModel.get("id")];

			model.id    = address.id;
			model.token = Utils.storage.get('token').key; 

			// call function to delete card
			AddressesModel.deleteAddress();

			e.preventDefault();  
		}, 

		/*-------------------- RENDER --------------------*/

		render:function(){ 
			/* Check token */
			if (!Utils.storage.get('token')) {
				Utils.router.navigate('home',{ trigger:true });
            }
			
			var	compiledTemplate = _.template(Tpl, {model:AddressesModel});
			this.$el.html(compiledTemplate); 
		}

	});

	/*-------------------- MODULE --------------------*/

	return {
		id:'DeleteMyAdress',
		level:24,
		view:View
	};

});
