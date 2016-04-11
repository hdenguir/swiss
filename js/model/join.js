// Filename model/join.js
define([
	'backbone',
	'underscore',
	'utils'
], function(Backbone, _, Utils){

	/*-------------------- CONFIG --------------------*/

	var Model = Backbone.Model.extend({
			defaults:{
				
				/* Overall */
				completed:0,

				/* Personal Data */
				personalData:{

					title:'',
					first_name:'',
					last_name:'',
					email:'',
					hashed_password:'',
				    digits_code : "",
					birthdate:'',
					day:'',
					month:'',
					year:'',

				},
				
				/* Carte Data */
				securityData:{ 
					type:'',    
					card_number:'',
					holder_name:'',
					expire_date:'',
					month:'',
					year:'',
					cvc:''

				},

				/* my Adresses */
				ShippingAddresses: [
						{
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
							infos:""
						},

						{
							new_name:'',
							new_first_name:'',
							new_last_name:'',
							new_company: '',
							new_address1:'',
							new_address2:'',
							new_city:'',
							new_county:'',
							new_zipCode:'',
							new_country:'',
							new_infos:'',
							new_phoneNumber:''
						}
				]

			},

			/*-------------------- Methods --------------------*/
			init:function(){
				var model = this;
				model.set({ registerFinish:0 }); 
			},	

			registerUser:function(){  
				
				if(DEBUG) console.log("registerUser");
				var model = this,
					personalData = model.get('personalData'),
					securityData = model.get('securityData'),
					ShippingAddresse = model.get('ShippingAddresses'),
					address1 = {}, 					
					address2 = {},
					ShippingAddresses = [];

					address1.name        = ShippingAddresse.name,
					address1.first_name  = ShippingAddresse.first_name,
					address1.last_name   = ShippingAddresse.last_name,
					address1.company     = ShippingAddresse.company,
					address1.address1    = ShippingAddresse.address1,
					address1.address2    = ShippingAddresse.address2,
					address1.city        = ShippingAddresse.city,
					address1.county       = ShippingAddresse.county,
					address1.country     = ShippingAddresse.country, 
					address1.phoneNumber = ShippingAddresse.phoneNumber,
					address1.zipCode     = ShippingAddresse.zipCode,
					address1.infos       = "infos ...";

					ShippingAddresses.push(address1); 

					if(ShippingAddresse.new_name){
						address2.name        = ShippingAddresse.new_name,
						address2.first_name  = ShippingAddresse.new_first_name,
						address2.last_name   = ShippingAddresse.new_last_name,
						address2.company     = ShippingAddresse.new_company,
						address2.address1    = ShippingAddresse.new_address1,
						address2.address2    = ShippingAddresse.new_address2,
						address2.city        = ShippingAddresse.new_city,
						address2.county      = ShippingAddresse.new_county,
						address2.zipCode     = ShippingAddresse.new_zipCode,
						address2.country     = ShippingAddresse.new_country,
						address2.infos       = ShippingAddresse.new_infos,
						address2.phoneNumber = ShippingAddresse.new_phoneNumber	

						ShippingAddresses.push(address2); 
					} 

					securityData.expire_date =securityData.month +"/"+securityData.year;
					personalData.birthdate = personalData.day +"/"+personalData.month +"/"+personalData.year;

					/*delete securityData.month;
					delete securityData.year;*/

					/*delete personalData.day;
					delete personalData.month;
					delete personalData.year;*/

				var data = {
						    "register": {
						    	"title"            : personalData.title,
							    "first_name"       : personalData.first_name,
							    "last_name"        : personalData.last_name,
							    "email"            : personalData.email,
							    "hashed_password"  : personalData.hashed_password,
							    "birthdate"        : personalData.birthdate,
							    "digits_code"      : personalData.digits_code,
						        "addresses"        : ShippingAddresses,
						        "cards"            : [{ 
										type        :securityData.type,    
										card_number :securityData.card_number,
										holder_name :securityData.holder_name,
										expire_date :securityData.expire_date, 
										cvc         :securityData.cvc
									}]
						    }
						};  

				if(DEBUG) console.log(data);
				//if(2 == model.get('completed')){
					Utils.service.call({
							name:'register',
							data:JSON.stringify(data),
							success:function(response){  

								var res = jQuery.parseJSON(response);   

								if(res.hasOwnProperty('success') && res.success == false){
									Utils.popin.open({ data:{ title:'Error', content: res.message.msg } });
									if( res.message.msg.indexOf('Email') > -1 ){
										setTimeout(function(){ 
											Utils.popin.close(); 
											Utils.router.navigate('join/step1',{ trigger:true });
										},1000); 
									}

									Utils.service.finish();
									return;
								} 

								Utils.popin.open({ data:{ title:'Success', content: $.trim(res.message.msg.replace(",","\n")) } });
								Utils.service.finish();

								setTimeout(function(){ 
									Utils.popin.close();
									Utils.router.navigate('home',{ trigger:true });
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
				//}
			},
			
			reset:function(){
				this.set(this.defaults);
			}
		}),
	
		Instance = new Model();

	// Return the model for the module
	return Instance;

});