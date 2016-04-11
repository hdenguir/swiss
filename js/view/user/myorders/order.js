// Filename: view/user/myorders/order.js
define([
	'jquery',
	'underscore',
	'backbone',
	'utils',
	'model/user/product',
	'text!templates/user/myorders/order.html'
], function($, _, Backbone, Utils, ProductModel, Tpl){

	/*-------------------- CONFIG --------------------*/

	var View = Backbone.View.extend({
		initialize : function() { 
			var that = this;

			ProductModel.on("change", function(){ that.render(); });

	    },
		/*-------------------- EVENTS --------------------*/

		events:{ 
			'change input:not(".ignore"),select':'memorize'
		},

		memorize:function(e){
			var self = $(e.target);

				if( self.is(":checked") ){
					ProductModel.get("archiver").archive = 1;
				}else{
					ProductModel.get("archiver").archive = 0;
				}

				ProductModel.get("archiver").id = self.val();
				ProductModel.get("archiver").token = Utils.storage.get('token').key;

				ProductModel.updateArchive();
				return;
		},

		/*-------------------- RENDER --------------------*/

		render:function(){ 
			/* Check token */
			if (!Utils.storage.get('token')) {
				Utils.router.navigate('home',{ trigger:true });
            }

			var	compiledTemplate = _.template(Tpl, { model:ProductModel } );

			this.$el.html(compiledTemplate); 
		}

	});

	/*-------------------- MODULE --------------------*/

	return {
		id:'orderView',
		level:16,
		view:View
	};

});
