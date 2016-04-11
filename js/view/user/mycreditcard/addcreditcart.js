// Filename: view/user/mycreditcard/addcreditcart.js
define([
	'jquery',
	'underscore',
	'backbone',
	'jqueryvalidator',
	'utils',
	'model/user/cards',
	'text!templates/user/mycreditcard/addcreditcart.html'
], function($, _, Backbone,jqueryvalidator, Utils, ModelCards, Tpl){

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

			Utils.form.modelMemorize.call(ModelCards,e.target);

		}, 

		validate:function(e){ 
			var model = ModelCards.get("AddSecurityData");

			Utils.form.validate(e,function(){ 

				model.token = Utils.storage.get('token').key;

				if(model.default){
					model.default = "1";
				}else{
					model.default = "0";
				} 
				
				model.expire_date = model.month +"/"+ model.year;
				
				delete model.month;
				delete model.year;
				
				ModelCards.addCard();

				e.preventDefault(); 
			});
		},

		/*-------------------- RENDER --------------------*/

		render:function(){ 
			/* Check token */
			if (!Utils.storage.get('token')) {
				Utils.router.navigate('home',{ trigger:true });
            }
			
			var	compiledTemplate = _.template(Tpl);
			this.$el.html(compiledTemplate); 

			/* Apply validate form */	
			Utils.form.validatorForm('AddSecurityData');
		}

	});

	/*-------------------- MODULE --------------------*/

	return {
		id:'AddCreditCart',
		level:20,
		view:View
	};

});
