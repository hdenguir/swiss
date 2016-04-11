// Filename: view/join/step1.js
define([
	'jquery',
	'jqueryvalidator',
	'underscore',
	'backbone',
	'utils',
	'model/join',
	'text!templates/join/step1.html'
], function($, jqueryvalidator, _, Backbone, Utils,JoinModel, Tpl){

	/*-------------------- CONFIG --------------------*/

	var View = Backbone.View.extend({
		initialize : function() {
			this.render(); 
	    },
		/*-------------------- EVENTS --------------------*/

		events:{ 
			'submit .joinForm':'validateStep',
			'change input:not([type="submit"]):not(.show_password):not(.ignor),select':'memorize',
			'change .show_password':'showPassword',
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
				$(".digits").attr("type","text");
			}else{
				$(".digits").attr("type","password");
			}
			return false;
		},

		memorize:function(e){

			Utils.form.modelMemorize.call(JoinModel,e.target);

		},

		validateStep:function(e){ 

			Utils.form.validate(e,function(){
				//jQuery('change input:not([type="submit"]):not(.show_password):not(.ignor),select').trigger("change");
				//JoinModel.set({ completed:1 });
				Utils.router.navigate('join/step2',{ trigger:true });
				e.preventDefault(); 
			});
		},

		/*-------------------- RENDER --------------------*/

		render:function(){ 
			var	compiledTemplate = _.template(Tpl, { model: JoinModel});
			this.$el.html(compiledTemplate);

			/* Apply validate form */	
			Utils.form.validatorForm('personalData');

			Utils.Functions.hideShowHome();
		}

	});

	/*-------------------- MODULE --------------------*/

	return {
		id:'joinStep1',
		level:3,
		view:View
	};

});
