// Filename: view/user/myorders.js
define([
	'jquery',
	'underscore',
	'backbone',
	'jqueryvalidator',
	'utils',
	'model/user/product',
	'text!templates/user/mycommand.html'
], function($, _, Backbone,jqueryvalidator, Utils, ProductModel, Tpl){

	/*-------------------- CONFIG --------------------*/

	var View = Backbone.View.extend({
		initialize : function() { 
			var that = this;

			ProductModel.on("change", function(){ that.render(); });
	    },
		/*-------------------- EVENTS --------------------*/

		events:{
			'change .payment':'memorizePaiementID',
			'change .address':'memorizeshippingAddressID',
			'change .digitscode':'memorizeDigits',
			'submit .payForm':'goToStep',
			'change #qte':'memorizeQTE',
			'click .detail em':'openDetail'
		}, 

		openDetail: function(e){
			var self   = jQuery(e.target),
				parent = self.parents(".large");

			if(parent.hasClass("open")){
				parent.nextAll().hide(); parent.removeClass("open");
			}else{
				parent.nextAll().show(); parent.addClass("open");
			}
		},

		calculQTE: function(){

			var quantity        = parseInt(ProductModel.attributes.eq.quantity),
				atiPrice        = parseFloat(ProductModel.attributes.eq.atiPrice),
				shippingFees    = parseFloat(ProductModel.attributes.eq.shippingFees),
				tax             = parseFloat(ProductModel.attributes.eq.tax),
				priceHT         = parseFloat(ProductModel.attributes.etPrice),
				priceTTC        = parseFloat(atiPrice),
				shippingFeesTTC = parseFloat(shippingFees) + ( parseFloat(shippingFees) * tax ),  
				shippingFeesHT  = parseFloat(shippingFees);  

			var ttc = ( quantity * priceTTC ) + shippingFeesTTC,
				ht  = ( quantity * priceHT ) + shippingFeesHT,
				tax = (parseFloat(atiPrice)*tax) + ( parseFloat(shippingFees) * tax );

			$("p.ttc i").text( parseFloat(ttc).toFixed(2) ); 
			$("p.ht i ").text( parseFloat(ht).toFixed(2) ); 
			$("p.tax i").text( parseFloat(tax).toFixed(2) ); 
		},

		memorizeQTE: function(e){
			var quantity = $(e.target).val(), 
			 	that = this;

			if(quantity){
				ProductModel.attributes.eq.quantity = quantity;
				that.calculQTE();
			} 
		},

		memorizePaiementID: function(e){ 
			var option= $(e.target).find('option:selected'),
				id = option.data("id"), 
			 	that = this;

				ProductModel.attributes.cardId = id; 

				//return;
		},

		memorizeDigits: function(e){ 
			var that= $(e.target),
				val = that.val(); 

				ProductModel.attributes.digits_code = val; 

				//return;
		},

		memorizeshippingAddressID: function(e){
			var option= $(e.target).find('option:selected'),
				id = option.data('id'),
				shippingFees = option.data("shippingfees"),
				atiPrice     = option.data("atiprice"),
				tax          = option.data("tax"),
			 	that         = this;  

				ProductModel.attributes.shippingAddressId = id;
				ProductModel.attributes.eq.shippingFees = shippingFees;
				ProductModel.attributes.eq.atiPrice = atiPrice; 
				ProductModel.attributes.eq.tax = tax; 

				that.calculQTE();

				return;
		},

		goToStep: function(e){  
		 	
		 	$(".payment,.address,.digitscode").trigger("change");

			var data = {
					token: Utils.storage.get('token').key, 
					shippingAddressId : ProductModel.attributes.shippingAddressId,
					billingAddressId : ProductModel.attributes.shippingAddressId,
					storeId: ProductModel.attributes.storeId,
					productId: ProductModel.attributes.productId,
					cardId : ProductModel.attributes.cardId,
					quantity : ProductModel.attributes.eq.quantity,
					digits_code : ProductModel.attributes.digits_code
				};  
			
			Utils.form.validate(e,function(){
				Utils.service.call({
					name:'pay',
					data:data,
					success:function(response){ 
						
						Utils.service.finish();   

						var res = jQuery.parseJSON(response);

						if(res.hasOwnProperty('success') && res.success == false){
							Utils.popin.open({ data:{ title:'Error', content: res.message.msg } });
							return;
						}     

						if(res.hasOwnProperty('status') && res.status == 1){ 
							Utils.router.navigate('user/confirmCommand',{ trigger:true }); 
						}
					},
					error:function(response){
						alert("Error Ajax");
						Utils.service.finish();
					}
				});
				return false;
			});

			return false;

			   
		},							

		/*-------------------- RENDER --------------------*/

		render:function(){ 
			/* Check token */
			if (!Utils.storage.get('token')) {
				Utils.router.navigate('home',{ trigger:true });
            }
			

			var	compiledTemplate = _.template(Tpl, { model:ProductModel } );

			this.$el.html(compiledTemplate); 


			/* Apply validate form */	
			Utils.form.validatorForm('formPay');


			/* Calculate Price */
			var option       = $("#address").find('option:selected'),
				id           = option.data('id'),
				shippingFees = option.data("shippingfees"),
				atiPrice     = option.data("atiprice"),
				tax          = option.data("tax"),
			 	that         = this; 

				ProductModel.attributes.eq.shippingFees = shippingFees;
				ProductModel.attributes.eq.atiPrice = atiPrice; 
				ProductModel.attributes.eq.tax = tax; 

			this.calculQTE();
		}

	});

	/*-------------------- MODULE --------------------*/

	return {
		id:'MyOrders',
		level:12,
		view:View
	};

});
