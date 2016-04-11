// Filename: view/home.js
define([
    'jquery',
    'jqueryvalidator',
    'underscore',
    'backbone',
    'utils',
    'model/home',
    'model/user/profile',
    'text!templates/home.html',
], function($, jqueryvalidator, _, Backbone, Utils, HomeModel, ProfileModel, Tpl){

	/*-------------------- CONFIG --------------------*/

	var View = Backbone.View.extend({
		
		/*-------------------- INIT --------------------*/

		initialize:function(){  
			/* Check token */
			if (Utils.storage.get('token')) {
				//Utils.router.navigate('user/home',{ trigger:true, replace:true });
				Utils.storage.destroy('token', false);
				//Utils.service.refresh();
				navigator.app.exitApp();
				return false;
            }

			if(PHONEGAP){
				var telephoneNumber = cordova.require("cordova/plugin/telephonenumber");
					telephoneNumber.get(function(result) {
				        Utils.storage.set('phoneNumber','key',result,false);
				    }, function() {
				        //alert("error");
				    });				
			}
		}, 

		/*-------------------- EVENTS --------------------*/

		events:{ 
			'submit .logForm':'callAuth'
		},

		/*-------------------- HANDLERS --------------------*/    
		callAuth:function(e){   
			/*if(!Utils.isConnectedNetwork()){
				return false;
			}*/

			if(DEBUG){ console.log("call Auth"); }

			Utils.form.validate(e,function(serialized){

				var login = serialized.username,
					data = {
						email:login,
						pwd:serialized.password,
						gcmRegistrationId: 'APA91bGZgolf28xFBsE8qjt3ptS9h_g8KRZoYbYe7U_EgX01QspvN4w_v8MuRm2-4oFq_Mq2mn-wSCHwWJ7_X9I4ry-WulRGZal5jge-EF9YDrkKCXL8T4ccRr5bV7um6s5S2gWsPEy3TCAlUqDtyLNdHGy49VX9dw',
						apnToken: ""
					};  

					/*if(PHONEGAP){
						data = {
							email:login,
							pwd:serialized.password, 
							gcmRegistrationId: "Utils.storage.get('phoneNumber').key",
							apnToken: ""
						}
					} */ 
				
				Utils.service.call({
					name:'login',
					data:data,
					success:function(response){
						var res = jQuery.parseJSON(response);

						if(!res.success){
							Utils.popin.open({ data:{ title:'Error', content: res.message.msg } }); 
							Utils.service.finish();
							return false;
						}
						
						if(res.success || res.contents.token){

							ProfileModel.get("data").title = res.data.title;
							ProfileModel.get("data").first_name = res.data.first_name;
							ProfileModel.get("data").last_name = res.data.last_name;
							ProfileModel.get("data").email = res.data.email;
							ProfileModel.get("data").birthdate = res.data.birthdate;
							ProfileModel.get("data").photo = res.data.photo;

							top.location = '#login/'+res.token;
						} 

						Utils.service.finish();
					},
					error:function(response){
						//console.log(response); 
						Utils.service.finish();
					}
				});

			});

		},
		
		/*-------------------- RENDER --------------------*/
		render:function(isGlobal){ 

			/* Vars */
			var	compiledTemplate = _.template(Tpl, { model:HomeModel });

			/* Append */
			this.$el.html(compiledTemplate); 
			
			/* Hide Navigation */
			Utils.navigation.hide();

			/* Apply validate form */	
			Utils.form.validatorForm('logForm');
		}

	});

	/*-------------------- MODULE --------------------*/

	return {
		id:'home',
		level:2,
		view:View
	};

});
