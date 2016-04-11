// Filename: view/user/mycreditcard/deletecreditcart.js
define([
	'jquery',
	'underscore',
	'backbone',
	'utils',
	'model/user/cards',
	'text!templates/user/mycreditcard/deletecreditcart.html'
], function($, _, Backbone, Utils, CardsModel, Tpl){

	/*-------------------- CONFIG --------------------*/

	var View = Backbone.View.extend({
		initialize : function() {
			var that = this;

			CardsModel.on("change", function(){ that.render(); }); 

			if( typeof CardsModel.get("cards")[CardsModel.get("id")] == "undefined"){
				Utils.router.navigate('user/mycreditcard/mycreditcart',{ trigger:true });
			}
	    },
		/*-------------------- EVENTS --------------------*/

		events:{
			'click .delete':'deleteCard',
		}, 

		deleteCard:function(e){  
			var model   = CardsModel.get("deleteSecurityData"),
				cards   = CardsModel.get("cards")[CardsModel.get("id")];

			model.id    = cards.id;
			model.token = Utils.storage.get('token').key; 

			// call function to delete card
			CardsModel.deleteCard();
			model.id    = "";

			e.preventDefault();  
		},

		/*-------------------- RENDER --------------------*/

		render:function(){ 
			/* Check token */
			if (!Utils.storage.get('token')) {
				Utils.router.navigate('home',{ trigger:true });
            }
			
			var	compiledTemplate = _.template(Tpl, { model: CardsModel });
			this.$el.html(compiledTemplate); 
		}

	});

	/*-------------------- MODULE --------------------*/

	return {
		id:'DeleteCreditCart',
		level:25,
		view:View
	};

});