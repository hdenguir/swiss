// Filename model/user/profile.js
define([
	'backbone',
	'underscore',
	'utils'
], function(Backbone, _, Utils){

	/*-------------------- CONFIG --------------------*/

	var Model = Backbone.Model.extend({
			defaults:{
			    data : {
				    title: "",
				    first_name : "",
				    last_name : "",
				    email : "",
				    birthdate : "",
				    photo : ""
			    },
			    personalData: {
				    title: "",
				    first_name : "",
				    last_name : "",
				    email : "",
				    birthdate : "",
				    current_password : "",
				    new_password : "",
				    current_digits_code : "",
				    new_digits_code : "",
					day:'',
					month:'',
					year:''
			    }
			},
			updateProfile: function(){
				var that = this,
					model = that.get("personalData"); 

				model.birthdate = model.day +"/"+model.month +"/"+model.year;
				model.token = Utils.storage.get('token').key;

				delete model.day;
				delete model.month;
				delete model.year;

				Utils.service.call({
						name:'account',
						data:JSON.stringify(model),
						success:function(response){  

							var res = jQuery.parseJSON(response);   

							if(res.hasOwnProperty('success') && res.success == false){
								Utils.popin.open({ data:{ title:'Error', content: res.message.msg } });
								Utils.service.finish();
								return;
							} 

							Utils.popin.open({ data:{ title:'Success', content: res.message.msg } });
							Utils.service.finish();

							setTimeout(function(){ 
								Utils.popin.close();
								Utils.router.navigate('user/profile',{ trigger:true });
							},1000); 

							//model.set({ registerFinish:1 }); 
							Utils.service.finish();// remove class loading

						},
						error:function(response){ 
							console.log("Error");
							console.log(response);
							Utils.service.finish();// remove class loading

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