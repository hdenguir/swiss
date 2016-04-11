// Filename: view/user/mycreditcard/editcreditcart.js
define([
	'jquery',
	'underscore',
	'backbone',
	'utils',
	'model/user/cards',
	'text!templates/user/mycreditcard/editcreditcart.html'
], function($, _, Backbone, Utils, CardsModel, Tpl){

	/*-------------------- CONFIG --------------------*/

	var View = Backbone.View.extend({
		initialize : function() {
			var that = this;

			CardsModel.on("change", function(){ that.render(); });
	    },
		/*-------------------- EVENTS --------------------*/

		events:{
			'submit .joinForm':'updateCard',
			'change input:not([type="submit"]):not(.show_password):not(.ignor),select':'memorize',
		}, 

		memorize:function(e){

			Utils.form.modelMemorize.call(CardsModel,e.target);

		},

		updateCard:function(e){ 
			var model = CardsModel.get('EditSecurityData'),
				cards = CardsModel.get("cards")[CardsModel.get("id")];

			Utils.form.validate(e,function(){ 

				jQuery('input:not([type="submit"]):not(.show_password):not(.ignor),select').trigger("change"); 

				/*var arr = jQuery('form').serialize().split("&")[0];

				model.type = arr.split("type=")[1].replace("+", " ");*/

				model.token = Utils.storage.get('token').key;
				model.id = cards.id;
				model.expire_date = model.month +"/"+ model.year;
				
				delete model.month;
				delete model.year;

				if(model.default){
					model.default = "1";
				}else{
					model.default = "0";
				} 
				
				CardsModel.updateCard(); 

				e.preventDefault(); 
			});
		},

		/*-------------------- RENDER --------------------*/

		render:function(){ 
			/* Check token */
			if (!Utils.storage.get('token')) {
				Utils.router.navigate('home',{ trigger:true });
            }
			
			var	compiledTemplate = _.template(Tpl, { model: CardsModel });
			this.$el.html(compiledTemplate);

			/* Apply validate form */	
			Utils.form.validatorForm('EditSecurityData');
		}

	});

	/*-------------------- MODULE --------------------*/

	return {
		id:'EditCreditCart',
		level:22,
		view:View
	};

});