// Filename: view/user/myaddress/editmyadress.js
define([
	'jquery',
	'underscore',
	'backbone',
	'utils',
    'model/user/addresses',
	'text!templates/user/myaddress/editmyadress.html'
], function($, _, Backbone, Utils, AddressesModel, Tpl){

	/*-------------------- CONFIG --------------------*/

	var View = Backbone.View.extend({
		initialize : function() {
			var that = this; 

			AddressesModel.on("change", function(){ that.render(); });
			//AddressesModel.getAddresses();
	    },
		/*-------------------- EVENTS --------------------*/

		events:{
			'submit .joinForm':'validate',
			'change input:not([type="submit"]):not(.show_password):not(.ignor),select':'memorize',
		}, 

		memorize:function(e){

			Utils.form.modelMemorize.call(AddressesModel,e.target);

		},

		validate:function(e){ 

			var model = AddressesModel.get('EditMyAdresses'),
				addresses = AddressesModel.get("addresses")[AddressesModel.get("id")];

			Utils.form.validate(e,function(){ 

				jQuery('input:not([type="submit"]):not(.show_password):not(.ignor),select').trigger("change");

				model.token = Utils.storage.get('token').key;
				model.id = addresses.id;

				if(model.default){
					model.default = "1";
				}else{
					model.default = "0";
				} 

				AddressesModel.updateAddress();

				//Utils.popin.open({ data:{ title:'Error Demo', content: "Not available for the demo !" } }); 
				e.preventDefault(); 
			});
		}, 

		/*-------------------- RENDER --------------------*/

		render:function(){ 
			/* Check token */
			if (!Utils.storage.get('token')) {
				Utils.router.navigate('home',{ trigger:true });
            }
			
			var	compiledTemplate = _.template(Tpl,{ model: AddressesModel });
			this.$el.html(compiledTemplate); 
			
			/* Apply validate form */	
			Utils.form.validatorForm('EditMyAdresses');
		}

	});

	/*-------------------- MODULE --------------------*/

	return {
		id:'EditMyAdress',
		level:23,
		view:View
	};

});
