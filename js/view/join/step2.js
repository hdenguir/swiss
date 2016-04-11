// Filename: view/join/step2.js
define([
	'jquery',
	'jqueryvalidator',
	'underscore',
	'backbone',
	'utils',
	'model/join',
	'text!templates/join/step2.html'
], function($, jqueryvalidator,_, Backbone, Utils, JoinModel, Tpl){

	/*-------------------- CONFIG --------------------*/

	var View = Backbone.View.extend({
		
		/*-------------------- INIT --------------------*/

		initialize:function(){

			/* Get secrect questions list */
			//JoinModel.getSecretQuestions();

			/* Get international dialling codes */
			//JoinModel.getInternationalDiallingCodes();

			/* View / Model association */
			var that = this;
			/* Bind model changes that need the view to refresh */
			//JoinModel.bind('change:questions', function(){ if(DEBUG) console.log('Step 2 event'); that.render(); });

		},
		/* Unlink model to prevent multiple binding and save resources */
		unlink:function(){
			//JoinModel.off();
		},

		/*-------------------- EVENTS --------------------*/

		events:{
			'submit .joinForm':'validateStep',
			'change input:not(".ignore"),select':'memorize',
			'change  input[name="billing"]': 'ShowNewAddress'
		},

		ShowNewAddress: function(e){
			var input = $(e.target).val();

				if(input == 1){
					$(".new_address").show();
				}else{
					$(".new_address").hide();
				}

			return false;
		},

		/*-------------------- HANDLERS --------------------*/

		memorize:function(e){
			Utils.form.modelMemorize.call(JoinModel,e.target);

		},
		
		validateStep:function(e){
			
			Utils.form.validate(e,function(){
				//JoinModel.set({ completed:2 }); 
				Utils.router.navigate('join/step3',{ trigger:true });
				e.preventDefault(); 
			});


		},

		/*-------------------- RENDER --------------------*/

		render:function(){
			
			
			//console.log('Render');
			/* Prevent direct access */
			/*var auth = (1 == JoinModel.get('completed'));
			if(!auth) Utils.router.navigate('join/step1',{ trigger:true, replace:true });*/

			/* Vars */
			var	compiledTemplate = _.template(Tpl, { model:JoinModel } );

			/* Append */
			this.$el.html(compiledTemplate);
			 
			/* Apply validate form */	
			Utils.form.validatorForm('ShippingAddresses');

		}

	});

	/*-------------------- MODULE --------------------*/

	return {
		id:'joinStep2',
		level:4,
		view:View
	};

});
