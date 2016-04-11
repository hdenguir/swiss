// Filename model/navigation.js
define([
	'backbone',
	'underscore',
	'utils'
], function(Backbone, _, Utils){

	/*-------------------- CONFIG --------------------*/

	var Model = Backbone.Model.extend({
			defaults:{
				active:0,
				buttons:[
					{
						id:'scan-and-buy',
						label:'Scan and buy',
						route:'#user/home',
						separator: 0
					},
					{
						id:'my-orders',
						label:'My orders',
						route:'#user/myorders/myorders',
						separator: 0
					},
					{
						id:'manage-my-credit-card',
						label:'Manage my credit(s) card(s)',
						route:'#user/mycreditcard/mycreditcart',
						separator: 0
					},
					{
						id:'manage-my-adress',
						label:'Manage my adress(es)',
						route:'#user/myaddress/myadress',
						separator: 0
					},
					{
						id:'me',
						label:'Me',
						route:'#user/profile',
						separator: 0
					},
					{
						id:'mentions',
						label:'Terms & conditions',
						route:'#user/content/mentions',
						separator: 1
					},
					{
						id:'policy',
						label:'Privacy & policy',
						route:'#user/content/privacy',
						separator: 0
					},
					{
						id:'help',
						label:'Help',
						route:'#user/content/help',
						separator: 0
					},
					{
						id:'contact-us',
						label:'Contact',
						route:'#user/content/contact',
						separator: 0
					}
				]
			}, 
			reset:function(){
				this.set(this.defaults);
			}
		}),

		Instance = new Model();

	// Return the model for the module
	return Instance;

});