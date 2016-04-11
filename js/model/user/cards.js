// Filename model/user/cards.js
define([
	'backbone',
	'underscore',
	'utils'
], function(Backbone, _, Utils){

	/*-------------------- CONFIG --------------------*/

	var Model = Backbone.Model.extend({
			defaults:{
			    cards : [],
			    id: "",
			    loading: false,
			    AddSecurityData:{ 
					type:'',    
					card_number:'',
					holder_name:'',
					month:'',
					year:'',
					cvc:'',
					default: ""
			    },

			    EditSecurityData:{  
					holder_name:'',
					month:'',
					year:'',
					default: "0"
				},

			    deleteSecurityData:{ 
			    	id: ""
			    }
			},

			getCards: function(){
				var data = {
					token: Utils.storage.get('token').key
				},
				that = this;

				that.set({ loading: true });

				Utils.service.call({
					name:"cards?h="+Utils.storage.get('token').key, 
					type:"GET",
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

						that.set({cards : res.cards});
						that.set({ loading: false });

						Utils.service.finish();
					},

					error:function(response){
						alert("Error Ajax");
						Utils.service.finish();
					}
				});
			},

			addCard: function(){
				var data = {
					token: Utils.storage.get('token').key
				},
				that = this;

				Utils.service.call({
					name:"cards", 
					data : that.get("AddSecurityData"), 
					success:function(response){

						var res = jQuery.parseJSON(response);    

						if(res.hasOwnProperty('success') && res.success == false){
							Utils.popin.open({ data:{ title:'Error', content: res.message.msg } });
							Utils.service.finish();
							return;
						} 

						if(res.hasOwnProperty('success') && res.success ){
							Utils.popin.open({ data:{ title:'success', content: res.message.msg } });

							setTimeout(function(){ 
								Utils.popin.close() 
								Utils.router.navigate('user/mycreditcard/mycreditcart',{ trigger:true });
							},1500);
						}


						Utils.service.finish();
					},

					error:function(response){
						alert("Error Ajax");
						Utils.service.finish();
					}
				});
			},

			updateCard: function(){
				var data = {
					token: Utils.storage.get('token').key
				},
				that = this; 

				Utils.service.call({
					name:"cards", 
					data : JSON.stringify(that.get("EditSecurityData")),
					type: 'PUT',
					success:function(response){

						var res = jQuery.parseJSON(response);    

						if(res.hasOwnProperty('success') && res.success == false){
							Utils.popin.open({ data:{ title:'Error', content: res.message.msg } });
							Utils.service.finish();
							return;
						} 

						if(res.hasOwnProperty('success') && res.success ){
							Utils.popin.open({ data:{ title:'success', content: res.message.msg } });

							setTimeout(function(){ 
								Utils.popin.close() 
								Utils.router.navigate('user/mycreditcard/mycreditcart',{ trigger:true });
							},1500);
						}


						Utils.service.finish();
					},

					error:function(response){
						alert("Error Ajax");
						Utils.service.finish();
					}
				});
			},

			deleteCard: function(){
				var that = this;  

				Utils.service.call({
					name:"cards", 
					type: 'DELETE',
					data : JSON.stringify(that.get("deleteSecurityData")),
					success:function(response){

						var res = jQuery.parseJSON(response);    

						if(res.hasOwnProperty('success') && res.success == false){
							Utils.popin.open({ data:{ title:'Error', content: res.message.msg } });
							Utils.service.finish();
							return;
						} 

						if(res.hasOwnProperty('success') && res.success ){
							Utils.router.navigate('user/mycreditcard/mycreditcart',{ trigger:true });  

							Utils.popin.open({ data:{ title:'Success', content: res.message.msg } });
  

							setTimeout(function(){ 
								Utils.popin.close();
							},1500);
						}

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