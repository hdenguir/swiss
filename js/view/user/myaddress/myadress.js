// Filename: view/user/myaddress/myadress.js
define([
	'jquery',
	'underscore',
	'backbone',
	'utils',
    'model/user/addresses',
	'text!templates/user/myaddress/myadress.html'
], function($, _, Backbone, Utils, AddressesModel, Tpl){

	/*-------------------- CONFIG --------------------*/

	var View = Backbone.View.extend({
		initialize : function() {
			var that = this;
			AddressesModel.on("change", function(){ that.render(); });
			AddressesModel.getAddresses();
	    },
		/*-------------------- EVENTS --------------------*/

		events:{ }, 

		/*-------------------- RENDER --------------------*/

		render:function(){ 
			/* Check token */
			if (!Utils.storage.get('token')) {
				Utils.router.navigate('home',{ trigger:true });
            }
			
			var	compiledTemplate = _.template(Tpl, { model:AddressesModel });
			this.$el.html(compiledTemplate); 
		}

	});

	/*-------------------- MODULE --------------------*/

	return {
		id:'MyAdress',
		level:11,
		view:View
	};

});
