// Filename: view/popin.js
define([
	'jquery',
	'underscore',
	'backbone',
	'utils',
	'text!templates/popin.html'
], function($, _, Backbone, Utils, Tpl){

	/*-------------------- CONFIG --------------------*/

	var PopinView = Backbone.View.extend({

		className:'popin',

		events:{
			'click .close':'close',
			'click .cancel':'cancel',
			'click .valid, .overlay':'valid',
			'click .validCode':'valideCode',
			'click .photoCam':'photoCam',
			'click .photoLib':'photoLib',
			'click .overlay':'layerClose',
		},

		/* Handlers */
		layerClose:function(ev){ 
			var that = this;  
				that.close(); 
		},
		close:function(){
			var that = this;
			that.$el.removeClass('display');
			that.$el.removeClass('popin');
			// that.destroy();
			setTimeout(function(){
				that.destroy();
			},500); 
		},
		valid:function(){ this.close(); },
		cancel:function(){ this.close(); },
		photoLib:function(){ this.close(); },
		photoCam:function(){ this.close(); },
		valideCode : function() { this.close(); },

		/* Init and render */
		
		initialize:function(params){
		
		
		
			/* Binds callbacks */
			if(!params.contentid && !params.content) this.back = this.close;
			if(params.data.valid && true != params.data.valid) this.valid = params.data.valid;
			if(params.data.cancel && true != params.data.cancel) this.cancel = params.data.cancel;

			if(params.data.photoLib && true != params.data.photoLib) this.photoLib = params.data.photoLib;
			if(params.data.photoCam && true != params.data.photoCam) this.photoCam = params.data.photoCam;
			if(params.data.valideCode && true != params.data.valideCode) this.valideCode = params.data.valideCode;
			
			/* Render */
			this.render(params);
			

		},

		render:function(params){

		
			if(DEBUG){console.log("RENDER POPIN");}

			/*
			//Remove all popin also display
			$( ".display" ).each(function( index ) {
				console.log( this );
				this.remove();
				
			});	
*/
			//Remove all popin also display
			$( "#popinId" ).each(function( index ) {
				
				$(this).parents("div:first").remove();
				
			});	
			
			
			
			/* Vars */
			var	that = this,
				params = params || { data:{ }},
				compiledTemplate = _.template(Tpl, params );
			
			 
			
		
		
			// Append
			that.$el.html(compiledTemplate).appendTo(document.body);
			//that.$el.addClass('display');
			setTimeout(function(){ that.$el.addClass('display'); },500);
			
			

		},

		destroy:function(){
			this.unbind();
			this.remove();
		}

	});

	/*-------------------- METHODS --------------------*/

	if(DEBUG) console.log('Popin module loaded');

	var load = function(params){
			/* Call AJAX if has a contentid */
			if(params.contentid){
				ext = (ISLOCAL && !isDir)? '.json' : '';
				$.ajax({
					url: USEPROXY                    
                        ? (( PROXYURL || SITEURL  ) + 'proxy.php?url='+ encodeURIComponent(CMSURL + 'anon/getContent/' + params.contentid + ext) +'&mode=native&full_headers=0&full_status=0')
                        : (CMSURL+'anon/getContent/' + params.contentid + ext)
                        ,
					cache:false,
					dataType:'json',
					type:'POST',
					data:JSON.stringify(params.data) || {},
					success:params.success || function(response){ 
																		if(response.error){
																			getLocal(params);
																		} else {
																			params.data.content = response.content;
																			create(params);
																		}
																}, error:function(response){ }
				});
			/* IF has a local content, get local version  and if the forcemessage is false if not the*/
			} else if(params.content && !(params.forcemessage)) {
				getLocal(params);
			/* Else just build popin with passed parameters */
			} else {
				create(params);
			};

		},
		getLocal = function(params){
			
			var file = params.contentid || params.content;
			require(['text!templates/popin/'+file+'.html'],function(tpl){
				
				/* Store content data */
				if('' != tpl) params.data.content = tpl;
				create(params);

			} //,Utils.popin.unable
			); 

		},
		create = function(params){
			/* Instanciate the view 

			test if the Popin is Already Loaded */
			$(document.body).find('.popin').removeClass('popin');

		if(!$(document.body).find('.popin').length)
			var Popin = new PopinView(params);

			require(['utils'],function(Utils){ Utils.Functions.resizePopin(); }); // resize popin

			// custem popin form error / large
			//setTimeout( function(){ if( $('.form').length ) $('.popin.display').addClass('msg-form'); }, 500);
			//
			// Attach callbacks to functions callback on validate Codes
			tempscallbacks = params.callbacks || function(){};
		};

	return {
		load:load,
		create : create,
		getLocal : getLocal
	};

});