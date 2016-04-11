// Filename: view/join/step3.js
define([
	'jquery',
	'jqueryvalidator',
	'underscore',
	'backbone',
	'utils',
	'model/join',
	'text!templates/join/step3.html'
], function($, jqueryvalidator, _, Backbone, Utils, JoinModel, Tpl){

	/*-------------------- CONFIG --------------------*/

	var View = Backbone.View.extend({
		
		
		initialize:function(){ 
			  
		},
		
		/*-------------------- EVENTS --------------------*/

		events:{
			'submit .joinForm':'validateStep',
			'change input:not([type="submit"]:not(".ignore"),[type="checkbox"]),select':'memorize'
		},

		/*-------------------- HANDLERS --------------------*/

		memorize:function(e){

			Utils.form.modelMemorize.call(JoinModel,e.target);

		},

		validateStep:function(e){
			
			Utils.form.validate(e,function(){ 
				JoinModel.registerUser();
				//Utils.router.navigate('home',{ trigger:true });
				e.preventDefault(); 
			});


		},
		

		/*-------------------- RENDER --------------------*/

		render:function(){

			/* Prevent direct access */
			/*var auth = (2 == JoinModel.get('completed'))
			if(!auth) { 
				Utils.router.navigate('join/step1',{ trigger:true, replace:true });
			}*/

			/* Vars */
			var	compiledTemplate = _.template(Tpl, { model:JoinModel } );

			/* Append */
			this.$el.html(compiledTemplate); 
			 
			/* Apply validate form */	
			Utils.form.validatorForm('securityData');

		}

	});

	/*-------------------- MODULE --------------------*/

	return {
		id:'joinStep3',
		level:5,
		view:View
	};

});
