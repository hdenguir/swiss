// Filename model/user/product.js
define([
	'backbone',
	'underscore',
	'utils'
], function(Backbone, _, Utils){

	/*-------------------- CONFIG --------------------*/

	var Model = Backbone.Model.extend({
			defaults:{
			    name: "",
			    loading: false,
			    photo: "",
			    stock : 0,
			    etPrice : 0, // prix HT
			    currency : "euro",
			    shippingAddresses : [],
			    cards : [],
				storeId: "1",
				productId: "123",
				shippingAddressId: 0,
				digits_code: "",
				cardId: 0,
			    orders : [],
			    id: "",
			    eq:{
			    	quantity: 1,
			    	atiPrice: 1,
			    	tax: 0.08,
			    	shippingFees: 1
			    },
			    archiver: {
			    	archive: '',
			    	id: ''
			    }
			},

			getOrders: function(){
				var data = {
					token: Utils.storage.get('token').key
				},
				that = this;


				that.set({ loading: true });

				Utils.service.call({
					name:'orders',
					data:data,
					success:function(response){ 

						var res = jQuery.parseJSON(response);    

						if(res.hasOwnProperty('success') && res.success == false){
							Utils.popin.open({ data:{ title:'Error', content: res.message.msg } });
							Utils.service.finish();
							return;
						}

						if(res.hasOwnProperty('token')){
							Utils.storage.set('token','key',res.token,false);
						}

						that.set({orders : res.orders});	

						that.set({ loading: false }); 

						Utils.service.finish();
					},
					error:function(response){
						alert("Error Ajax");
						Utils.service.finish();
					}
				});
			},

			updateArchive: function(){
				var that = this;

				that.set({ loading: true });

				Utils.service.call({
					name:'myorder',
					data:JSON.stringify(that.get("archiver")),
					success:function(response){ 

						var res = jQuery.parseJSON(response);    

						if(res.hasOwnProperty('success') && res.success == false){
							Utils.popin.open({ data:{ title:'Error', content: res.message.msg } });
							Utils.service.finish();
							return;
						}

						if(res.hasOwnProperty('success')){
							Utils.popin.open({ data:{ title:'Success', content: res.message.msg } });
							setTimeout(function(){
								Utils.service.finish();
								Utils.popin.close();
								Utils.router.navigate('user/myorders/myorders',{ trigger:true });								
							},1000);
							return;
						}

						if(res.hasOwnProperty('token')){
							Utils.storage.set('token','key',res.token,false);
						}  

						that.set({ loading: false }); 

						Utils.service.finish();
					},
					error:function(response){
						alert("Error Ajax");
						Utils.service.finish();
					}
				});
			},

			reset:function(){
				this.set(this.defaults);
			}
		}),

		Instance = new Model();

	// Return the model for the module
	return Instance;

});