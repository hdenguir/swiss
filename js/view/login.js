// Filename: view/login.js
define([
	'jquery',
	'underscore',
	'backbone'
], function($, _, Backbone){

	/*-------------------- CONFIG --------------------*/

	var View = Backbone.View.extend({
		
		initialize:function(params){
			
			/* Store token in non persistent storage */
			Utils.storage.set('token','key',params.token,false);
			Utils.router.navigate('user/home',{ trigger:true, replace:true });

			require(['utils'], function(Utils){
            	Utils.Functions.ButtonWithCheckNetwork();
            });	

		}

	});

	/*-------------------- MODULE --------------------*/

	return View;

});
