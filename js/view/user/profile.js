// Filename: view/user/profile.js
define([
	'jquery',
	'underscore',
	'backbone',
	'jqueryvalidator',
	'utils',
    'model/user/cards',
    'model/user/addresses',
    'model/user/profile',
	'text!templates/user/profile.html'
], function($, _, Backbone,jqueryvalidator, Utils, CardsModel, AddressesModel, ProfileModel, Tpl){

	/*-------------------- CONFIG --------------------*/

	var View = Backbone.View.extend({
		initialize : function() {

			var that = this;
			
			ProfileModel.on("change", function(){ that.render(); });

			CardsModel.on("change", function(){ that.render(); });
			CardsModel.getCards();

			AddressesModel.on("change", function(){ that.render(); });
			AddressesModel.getAddresses();

	    },
		/*-------------------- EVENTS --------------------*/

		events:{ 
			'submit .joinForm':'validateStep',
			'change .show_password':'showPassword',
			'change input:not(".ignor"),select':'memorize',
			'change .show_digits_code':'showDigitsCode'	
		},

		showPassword: function(e){
			var self = $(e.target);

			if(self.is(':checked')){
				$(".pass").attr("type","text");
			}else{
				$(".pass").attr("type","password");
			}
			return false;
		}, 

		showDigitsCode: function(e){
			var self = $(e.target); 

			if(self.is(':checked')){
				$(".digitscode").attr("type","text");
			}else{
				$(".digitscode").attr("type","password");
			}
			return false;
		},

		/*-------------------- RENDER --------------------*/
		
		memorize:function(e){
			Utils.form.modelMemorize.call(ProfileModel,e.target);
		},

		validateStep:function(e){ 
			var that = this;

			Utils.form.validate(e,function(){ 
				
				$("input:not(.ignore),select").trigger("change");

				ProfileModel.updateProfile();

				e.preventDefault(); 
			});
		},

		render:function(){ 
			/* Check token */
			if (!Utils.storage.get('token')) {
				Utils.router.navigate('home',{ trigger:true });
            }
			
			var	compiledTemplate = _.template(Tpl, {model:ProfileModel,cards:CardsModel,addresses:AddressesModel });
			this.$el.html(compiledTemplate);

			/* Apply validate form */	
			Utils.form.validatorForm('personalData');
		}

	});

	/*-------------------- MODULE --------------------*/

	return {
		id:'Profile',
		level:18,
		view:View
	};

});
