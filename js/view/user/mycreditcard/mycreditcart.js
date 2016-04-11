// Filename: view/user/mycreditcard/mycreditcart.js
define([
	'jquery',
	'underscore',
	'backbone',
	'utils',
	'model/user/cards',
	'text!templates/user/mycreditcard/mycreditcart.html'
], function($, _, Backbone, Utils, ModelCards, Tpl){

	/*-------------------- CONFIG --------------------*/

	var View = Backbone.View.extend({
		initialize : function() {
			
			var that = this;

			ModelCards.on("change", function(){ that.render();  });
			ModelCards.getCards();
	    },
		/*-------------------- EVENTS --------------------*/

		events:{ }, 

		/*-------------------- RENDER --------------------*/

		render:function(){ 
			/* Check token */
			if (!Utils.storage.get('token')) {
				Utils.router.navigate('home',{ trigger:true });
            }
			
			var	compiledTemplate = _.template(Tpl,{ model: ModelCards });
			this.$el.html(compiledTemplate); 
		}

	});

	/*-------------------- MODULE --------------------*/

	return {
		id:'MyCreditCart',
		level:13,
		view:View
	};

});
