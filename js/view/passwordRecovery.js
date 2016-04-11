// Filename: passwordRecovery.js
define([
	'jquery',
	'jqueryvalidator',
	'underscore',
	'backbone',
	'utils',
	'text!templates/passwordRecovery.html'
], function($, jqueryvalidator, _, Backbone, Utils, PasswordTpl){

	/*-------------------- CONFIG --------------------*/

	var View = Backbone.View.extend({
		
		/*-------------------- INIT --------------------*/
		initialize:function(){  
		}, 

		/*-------------------- EVENTS --------------------*/
		events:{ 
			'submit .joinForm':'validateStep'
		}, 

		validateStep:function(e){ 

			Utils.form.validate(e,function(){
				Utils.router.navigate('home',{ trigger:true });
				e.preventDefault(); 
			});
		},

		/*-------------------- RENDER --------------------*/
		render:function(){ 

			/* Vars */
			var	compiledTemplate = _.template(PasswordTpl);
			
			/* Append */
			this.$el.html(compiledTemplate);   

			Utils.form.validatorForm('forgotPassword');

		}

	});

	/*-------------------- MODULE --------------------*/

	return {
		id:'passwordRecovery',
		level:1,
		view:View
	};

});



