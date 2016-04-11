// Filename: view/user/content/mentions.js
define([
	'jquery',
	'underscore',
	'backbone',
	'utils',
	'text!templates/user/content/mentions.html'
], function($, _, Backbone, Utils, Tpl){

	/*-------------------- CONFIG --------------------*/

	var View = Backbone.View.extend({
		initialize : function() {
			this.render(); 
	    },
		/*-------------------- EVENTS --------------------*/

		events:{ }, 

		/*-------------------- RENDER --------------------*/

		render:function(){ 
			/* Check token */
			if (!Utils.storage.get('token')) {
				Utils.router.navigate('home',{ trigger:true });
            }
			
			var	compiledTemplate = _.template(Tpl);
			this.$el.html(compiledTemplate); 
		}

	});

	/*-------------------- MODULE --------------------*/

	return {
		id:'Mentions',
		level:10,
		view:View
	};

});
