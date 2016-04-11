// Filename: view/join/final.js
define([
	'jquery',
	'underscore',
	'backbone',
	'utils',
	'model/join',
	'text!templates/join/final.html'
], function($, _, Backbone, Utils, JoinModel, Tpl){

	/*-------------------- CONFIG --------------------*/

	var View = Backbone.View.extend({

	
		initialize:function(){

		},
	
		/*-------------------- EVENTS --------------------*/	
		events:{},

		/*-------------------- RENDER --------------------*/
		render:function(){
			 
			/* Vars */
			var	compiledTemplate = _.template(Tpl, { model:JoinModel } );
			
			/* Append */
			this.$el.html(compiledTemplate); 
		}

	});

	/*-------------------- MODULE --------------------*/
	return {
		id:'joinFinal',
		level:6,
		view:View
	};

});
