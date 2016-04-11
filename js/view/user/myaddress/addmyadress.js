// Filename: view/user/myaddress/addmyadress.js
define([
	'jquery',
	'underscore',
	'backbone',
	'jqueryvalidator',
	'utils',
    'model/user/profile',
    'model/user/addresses',
	'text!templates/user/myaddress/addmyadress.html'
], function($, _, Backbone,jqueryvalidator, Utils, ProfileModel, AddressesModel, Tpl){

	/*-------------------- CONFIG --------------------*/

	var View = Backbone.View.extend({
		initialize : function() {
			this.render(); 
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
			var model = AddressesModel.get("AddMyAdresses");

			Utils.form.validate(e,function(){ 

				model.token = Utils.storage.get('token').key;

				if(model.default){
					model.default = "1";
				}else{
					model.default = "0";
				} 
				
				AddressesModel.addAddress();
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
			
			var	compiledTemplate = _.template(Tpl, { model: ProfileModel });
			this.$el.html(compiledTemplate); 
			
			/* Apply validate form */	
			Utils.form.validatorForm('AddMyAdresses');
		}

	});

	/*-------------------- MODULE --------------------*/

	return {
		id:'AddMyAdress',
		level:21,
		view:View
	};

});
