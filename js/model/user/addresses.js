// Filename model/user/addresses.js
define([
	'backbone',
	'underscore',
	'utils'
], function(Backbone, _, Utils){

	/*-------------------- CONFIG --------------------*/

	var Model = Backbone.Model.extend({
			defaults:{
			    addresses : [],
			    id: "",
			    loading: false,
			    deleteAddresses:{ 
			    	id: ""
			    },
			    EditMyAdresses: {
			    	name:'',
					first_name:'',
					last_name:'',
					company: '',
					address1:'',
					address2:'',
					city:'',
					county:'',
					country:'',
					phoneNumber:"",
					zipCode:"",
					infos:"",
					default: ""
			    },
			    AddMyAdresses: {
			    	name:'',
					first_name:'',
					last_name:'',
					company: '',
					address1:'',
					address2:'',
					city:'',
					county:'',
					country:'',
					phoneNumber:"",
					zipCode:"",
					infos:"",
					default: ""
			    }
			},

			getAddresses: function(){
				var data = {
					token: Utils.storage.get('token').key
				},
				that = this;

				that.set({ loading: true });

				Utils.service.call({
					name:"address?h="+Utils.storage.get('token').key, 
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

						that.set({addresses : res.addresses});
						that.set({ loading: false }); 
						//console.log( that.get("addresses") );

						Utils.service.finish();
					},

					error:function(response){
						alert("Error Ajax");
						Utils.service.finish();
					}
				});
			},

			addAddress: function(){
				var data = {
					token: Utils.storage.get('token').key
				},
				that = this; 

				//console.log( that.get("AddMyAdresses") ); return;

				Utils.service.call({
					name:"address", 
					data : that.get("AddMyAdresses"), 
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
								Utils.router.navigate('user/myaddress/myadress',{ trigger:true });
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

			updateAddress: function(){
				var data = {
					token: Utils.storage.get('token').key
				},
				that = this; 

				Utils.service.call({
					name:"address", 
					data : JSON.stringify(that.get("EditMyAdresses")),
					type: "PUT",
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
								Utils.router.navigate('user/myaddress/myadress',{ trigger:true });
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

			deleteAddress: function(){
				var that = this;  

				Utils.service.call({
					name:"address", 
					type: 'DELETE',
					data : JSON.stringify(that.get("deleteAddresses")),
					success:function(response){ 
						
						var res = jQuery.parseJSON(response);    

						if(res.hasOwnProperty('success') && res.success == false){
							Utils.popin.open({ data:{ title:'Error', content: res.message.msg } });
							Utils.service.finish();
							return;
						} 

						if(res.hasOwnProperty('success') && res.success ){
							Utils.popin.open({ data:{ title:'Success', content: res.message.msg } });

							setTimeout(function(){ 
								Utils.popin.close() 
								Utils.router.navigate('user/myaddress/myadress',{ trigger:true });
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