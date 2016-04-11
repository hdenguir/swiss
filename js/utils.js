// Filename: utils.js
define([
	'jquery',
	'serialize',
	'underscore',
	'backbone',
	'view/header',
	'view/navigation',
], function($, Serialize, _, Backbone, Header, Navigation) {

	Utils = {

		/*-------------------- Navigation --------------------*/

		navigation:{
			activate:function(){ Navigation.activate.apply(Navigation,arguments); },
			hide:function(){ Navigation.hide.apply(Navigation,arguments); },
			setBadge:function(){ Navigation.setBadge.apply(Navigation,arguments); }
		},

		/*-------------------- Header --------------------*/
		header:{
			setLeftButtonAndAddRetour:function(){ Header.setLeftButtonAndAddRetour.apply(Header,arguments); },
			setLeftButton:function(){ Header.setLeftButton.apply(Header,arguments); },
			setLeftButtonWithCheckNetwork:function(){ Header.setLeftButtonWithCheckNetwork.apply(Header,arguments); },
			setRightButton:function(){ Header.setRightButton.apply(Header,arguments); }
		},

		/*-------------------- Session --------connexion------------*/

		session:{
			
			check:function(params){
				var obj = params || {};
					
				obj.valid = obj.valid || function(){};
				obj.expired = obj.expired || function(){};

				if(null != Utils.storage.get('token',false)) obj.valid();
				else obj.expired();
			},
			save: function(login, mobile, pass){  

				//$.cookie("email", login, { expires: 3650 }); //SETS IN DAYS (10 YEARS) 
			}

		},

		/*-------------------- Storage --------------------*/
		
		storage:{

			set:function(row,key,value,persistent){  

				var type = (persistent)? window.localStorage : window.sessionStorage,
					action = (persistent)? 'localStorage' : 'sessionStorage';
				if(type && type != undefined){
					/* get previously stored row */
					var data = Utils.storage.get(row,persistent) || {};
					/* Add key / value pair or update */
					data[key] = value;
					/* Update stored data */
					if(data) {
						type.setItem(row,JSON.stringify(data)); 
					}
					if(DEBUG) console.log(key+' value of '+row+' stored in '+action);
					return true;
				};
				return false;

			},

			get:function(row,persistent){  

				var type = (persistent)? window.localStorage : window.sessionStorage,
					action = (persistent)? 'localStorage' : 'sessionStorage';
				if(type){
					var data = type.getItem(row);
					if(DEBUG) console.log(row+' read from '+action);
					return (data) ? JSON.parse(data) : null;
				};
				return false;

			},

			destroy:function(row,persistent){
				
				var type = (persistent)? window.localStorage : window.sessionStorage,
					action = (persistent)? 'localStorage' : 'sessionStorage',
					rows = ('string' == typeof row)? [row] : row;
				if(type){
					for(var i=0; i<rows.length; i++){
						type.removeItem(rows[i]);
						if(DEBUG) console.log(rows[i]+' removed from '+action);
					};
				};

			},

			clear:function(persistent){
				
				var type = (persistent)? window.localStorage : window.sessionStorage,
					action = (persistent)? 'localStorage' : 'sessionStorage';
				if(type){
					type.clear();
					if(DEBUG) console.log(action+' cleared');
				};
			},
		},

		/*-------------------- Service Call --------------------*/

		service:{
			call:function(params){
				/*if(!Utils.isConnectedNetwork()){
					return false;
				}*/

				if (DEBUG) console.log("CallService");
				if (DEBUG) console.log(Utils.storage.get('token'));
				if (DEBUG) console.log("params.data > ",params);  

				var params = params || {},
					isDir = ('/' == params.name.charAt(params.name.length-1)),
					ext = (ISLOCAL && !isDir)? '.json' : '';

					Utils.service.finish();// remove class loading
					$(".content").append('<div class="load"><img src="'+SITEURL+'css/loading.gif" /></div>');
					$(".inner").addClass('loading');   

				$.ajax({
				    url: USEPROXY
                        ? (( SITEURL || PROXYURL  ) + 'proxy.php?url='+ encodeURIComponent(CMSURL+params.name+ext))
                        : ( CMSURL+params.name+ext )
                        ,
					cache:false,
					crossDomain: true,
					beforeSend: function(jqXHR, settings) {  
						//settings.data +="&deviceId = "+Utils.params.getDevice(); 
/*				
						settings.data+= (PHONEGAP) ? "&deviceId = "+Utils.params.getDevice() : "&deviceId =4a6a2cb0-7eff-11e4-b4a9-0800200c9a66"; 

						JSON.stringify();*/
					},
					dataType: params.dataType || 'html',
					type:params.type || 'POST',
					data: params.data || {},
					success: function(response){ 
						params.success(response) || function(){}
					},
					error:function(response){
						if( params.error ) { params.error(response) || function(){} }
						Utils.service.finish();// remove class loading
					}
				});

			},

			finish: function(page){
				if(!page){
					$(".loading").removeClass('loading');
				}else{	
					var currentPage = Utils.getCurrentPage();
					if(currentPage == page){
						$(".loading").removeClass('loading');
					}
				}
				$(".load").remove();
			},

			refresh: function(){
				// delete all local storage
				//localStorage.clear();
				var arr = ['email', 'mobile', 'type'];
				Object.keys(localStorage).forEach(function(key){  
		            if ( jQuery.inArray(key,arr) == -1 ) {
		                localStorage.removeItem(key); 
		            } 
		        }); 

				location.reload(true);
				if( location.hash != "#home" ){
					Utils.service.redirectHome();
				}
			},

			redirectHome:function(){
				Utils.router.navigate('#home',{ trigger:true }); 
			}
		},
			
		getCurrentPage:function(){

			var location = top.location.href;
			var page = location.replace(SITEURL + "#" ,"");
			return page;
		}, 
		
		
		/*-------------------- Form validation --------------------*/

		form:{

			modelMemorize:function(field){
				var root = field.getAttribute('data-root') || field.form.getAttribute('data-root') || false,
					key = field.name,
					value = ('checkbox' == field.type)? field.checked : $(field).val(),
					obj = {};
					
					if ( field.id == "prefixregister" ) { return; }
					if ( field.id == "birthDate" ) {
						var dt = $(field).val().split('/');
						value = dt[2]+'-'+dt[1]+'-'+dt[0];
					}

				/* If is sub object */
				if(root){
					/* Build obj */
					obj[root] = {};
					obj[root][key] = value;
				} else {
					obj[key] = value;
				};
				/* Udpate model */ 
				this.set(obj);
			},

			validate:function(e,callback){
		
				var form = e.target,
					$fields = $('input,select,textarea',form).not('input[type="submit"]'),
					row = form.name,
					data = $(form).serializeObject(),
					errors = [],
					lastField = null;  

				/* Per field check */
				$fields.each(function(){
					
					/* Memorize value */
					// Utils.form.memorize(this);

					/* Check */
					switch(this.type){
						case 'radio':
							var val = $('input[name="'+this.name+'"]').val(),
								req = ('required' == this.getAttribute('required'));
							if(undefined == val && req) errors.push(this);
							break;
						case 'checkbox':
							var req = ('required' == this.getAttribute('required')),
								checked = this.checked;
							if(req && !checked) errors.push(this);
							break;
						default:
							
							var val = this.value,
								pat = this.getAttribute('pattern') || false,
								reg = (pat)? new RegExp(pat,'ig') : false,
								req = ('required' == this.getAttribute('required'));
							
							/* Check */
							if((req || '' != val) && (pat && !reg.test(val))){
								errors.push(this);
							}; 

							break;
					};
					lastField = this;
				});

				/* Callback on success */
				if(0 == errors.length || !VALIDATE){
					callback(data);
				/* Or display errors */
				} else {
					
					/* Message */
					Utils.popin.open({ content:'form-error', data:{} });

					for(var i=0; i<errors.length; i++){
						var field = errors[i];
					};
				};

				e.preventDefault();
				return false;

			},
			validatorForm: function(form){ 
			
			
				// form validate / step1 / step2 / step 3
				 var validator = $('form[data-root= '+form+']').validate({
					rules: {
						username: { 
							required:true,
							email:true,
							lettersonlyemail: true
						},
						password: { 
							required:true
						},
						hashed_password: { 
							required:true
						},
						confirm_password: { 
							required:true,
							equalTo: "#hashed_password"
						},
						new_password: { 
							required:true
						},
						confirm_password2: { 
							required:true,
							equalTo: "#new_password"
						},
						digits_code: { 
							required:true,
							maxlength: 4,
							minlength: 4
						},
						confirm_digits_code: { 
							required:true,
							minlength: 4,
							maxlength: 4,
							equalTo: "#digits_code"
						},
						new_digits_code: { 
							required:true,
							maxlength: 4,
							minlength: 4
						},
						current_digits_code: { 
							required:true,
							maxlength: 4,
							minlength: 4
						},
						confirm_digits_code2: { 
							required:true,
							minlength: 4,
							maxlength: 4,
							equalTo: "#new_digits_code"
						},
						first_name: { required:true},
						last_name: { required:true},
						email: { 
							required:true,
							email: true,
							lettersonlyemail: true
						},
						confirm_email: { 
							required:true,
							email: true,
							lettersonlyemail: true,
							equalTo: "#email"
						},
						cardholer_name: { required:true},
						end_date: { required:true},
						code: { required:true},
						address_name: { required:true},
						address_first_name: { required:true},
						address_last_name: { required:true},
						address_company: { required:true},
						address_line_one: { required:true},
						address_line_two: { required:true},
						address_state: { required:true},
						address_city: { required:true},
						address_zip: { 
							required: true,
							number: true
						},
						address_country: { required:true},
						address_billing: { required:true},
						type: { required:true},
						address_phone: { required:true},
						address: { required:true},
						payment: { required:true}
					},
					messages: {	},
					focusInvalid: false,

					errorPlacement: function(error, element) {

					},

					highlight: function(element, errorClass, validClass) {
						var $item = $(element);
					    $item.parents('.formline').addClass('error').removeClass('valid'); 
					},

					unhighlight: function(element, errorClass, validClass) {
					    $(element).parents('.formline').removeClass('error').addClass("valid");
					},
					invalidHandler: function(f, v) { 
						//Errors.loadErrorTextById( v.errorList );  
					}
				});

				/* 
				* Trigger Error on Blur on each input text
				*/
				$('form[data-root= '+form+']').find('input').blur(function(){
					$(this).valid();
				});

			}, 

			validatorFormInfo: function(form){

				$('form.'+form).validate({
					rules:{
						zipCode: { 
							number: true,
							minlength: 4,
							maxlength: 5
						},
						email1: { 
							lettersonlyemail: true
						},
						email2: { 
							lettersonlyemail: true
						},
						email3: { 
							lettersonlyemail: true
						},
						email4: { 
							lettersonlyemail: true
						}
					},
					errorPlacement: function(error, element) {},

					highlight: function(element, errorClass, validClass) {
						var $item = $(element);
					    $item.parents('.field').addClass('error'); 
					},

					unhighlight: function(element, errorClass, validClass) {

					    $(element).parents('.field').removeClass('error');

					},
					invalidHandler: function(f, v) { 
							//Errors.loadErrorTextById( v.errorList ); 
					}
				});
			},

			validatorFormAskSend: function(form){

				$('form[name='+form+']').validate({
					rules:{
						amount:{
							amountValid: true,
							maxlength: 13
						},
						email:{
							lettersonlyemail: true
						}
					},
					errorPlacement: function(error, element) {},

					highlight: function(element, errorClass, validClass) {
						var $item = $(element);
					    $item.parents('.field').addClass('error'); 
					},
					focusInvalid: false,

					unhighlight: function(element, errorClass, validClass) {

					    $(element).parents('.field').removeClass('error');

					},
					invalidHandler: function(f, v) { 
						Errors.loadErrorTextById( v.errorList ); 
					}
				});
			},

			clear:function(){
				$(this).unbind('focus click',Utils.form.clear).parents('.field,.sub').removeClass('error');
			}

		},
				
		isConnectedNetwork : function(){
			var isConnected = false;
			if(PHONEGAP){
				try{
					var networkState = navigator.connection.type;
					if(networkState != "none"){
						isConnected = true;
					}
				}catch(ex){
					
				}
				if(!isConnected){
					Utils.popin.open({ data:{ title:'Problème de connexion Internet', content: "L’application nécessite une connexion Internet." } });
				}
			}else{
				isConnected = true;
			}
			
			return isConnected;
		},
		
		/*-------------------- File --------------------*/
		file:{
			check:function(){
				
			},
			load:function(){

			}
		},

		isEmailValid:function(email)
		{
			
			var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(email);
		},

		isNumberValid:function(number)
		{
			var numberTrim = number.replace(/\s/g, '');
			var reg = /([0-9]|\+33\s?)(\s?\d{2})/ ;
			return reg.test(numberTrim);
		},

		/*-------------------- Popin --------------------*/
		popin:{
			opened:null,
			open:function(data){				

				require(['view/popin'],function(Popin){
					Popin.load(data);
				});

			},
			offline:function(){
				Utils.router.navigate('popin/content/connexion-error',{ trigger:true });
			},
			unable:function(){
				Utils.popin.open({ data:{ title:'Erreur', content:'Impossible de charger cette ressource.' } });
			},
			close: function(){
				$('.popin').remove();
			}
		},
		params:{ 
			getDevice: function(){
				return (PHONEGAP) ? device.uuid : "4a6a2cb0-7eff-11e4-b4a9-0800200c9a66";
			}
		},

			content: {
				notfound:function(){
					Utils.popin.open({
						data:{
							content:Utils.params.contentnotfound,
							nobuttons:false,
							closeWithAction:true,
							valid:function(){ 
								Utils.popin.close(); 
							}
						}
					});
				}
			},

			isMobile: { 
			    Android: function() {
			        return navigator.userAgent.match(/Android/i);
			    },
			    iOS: function() {
			        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
			    },
			    iOS7: function() {
			        return navigator.userAgent.match(/OS 7|OS 6/i);
			    },
			    Windows: function() {
			        return navigator.userAgent.match(/IEMobile/i);
			    },
			    Win7: function() {
			        return navigator.userAgent.match(/Windows Phone 7/i);
			    },
			    Win8: function() {
			        return navigator.userAgent.match(/Windows Phone 8/i);
			    },
			    LG610: function() {
			        return navigator.userAgent.match(/LG-E610/i);
			    },
			    mobile: function() {
			        return (Utils.isMobile.Android() || Utils.isMobile.iOS() || Utils.isMobile.Windows());
			    }
			},
			Functions: {
				init:function(){     
					Utils.Functions.hideKeyboardOnEnter();// disactivate enter keyboard 
					Utils.Functions.RefreshPage(); // check connection on navigate in the page  
					Utils.Functions.resize(); // check resize window
				}, 

				resize: function(){
					$(window).resize(function(){
						Utils.Functions.resizePopin();
					});
				},

				hideShowHome: function(){

					setTimeout(function(){
						console.log( jQuery(".inner.auth").length );

						if(jQuery(".inner.auth").length) 
							jQuery("#header").addClass("hp");
						else jQuery("#header").removeClass("hp");
					},600);

				},

				ButtonWithCheckNetwork: function(){ 
		                if (Utils.storage.get('token')) {
		                    $(".leftButtonsContainer,.rightButtonsContainer").removeClass("hidden");
		                }else{
		                    $(".leftButtonsContainer,.rightButtonsContainer").addClass("hidden");  
                    		//Utils.service.redirectHome();
		                } 
		        },

				hideKeyboardOnEnter: function() {
				    $(document).on('keypress','input,select,textarea', function(ev){
				    	var e = ev || window.event,
				    	 	charCode = (typeof e.which == "number") ? e.which : e.keyCode;
					    if( charCode == 13 ){
						    document.activeElement.blur();
						    $("input").blur();
						    return false;
					    }
				    });
				},  

				RefreshPage: function(){
					$(document).on("click", ".refresh", function(){
						if(!Utils.isConnectedNetwork()){
							return false;
						}
					});
				},

				resizePopin:function(){
					var h_layer  =  $(".layer").outerHeight(),
							h_window = $(window).height(),
							h_doc= $(document).height(),
							top = (h_window - h_layer) / 2; 

						// set hegiht overlay	
						$(".overlay").height(h_doc);

						if( h_layer > h_window ){
							$(".popin .popin").css('margin-top',  0 );  
							$(".overlay").height(h_doc); 
						}
						else {
							$(".popin .popin").css('margin-top',  top ); 
						}
				}
			}

	};	

	/*-------------------- Deffered router - Circular dependencie --------------------*/

	require(['router'],function(Router){
		
		Utils.router = {
			navigate:function(){ Router.navigate.apply(Router,arguments); },
			refresh:function(){alert("refresh");Backbone.history.stop(); Backbone.history.start();}
		}

	});

	return Utils;

});
