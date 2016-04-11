// Filename: router.js
define([
	'jquery',
	'underscore',
	'backbone',
	'utils'
], function($, _, Backbone, Utils) {

	/*-------------------- CONFIG --------------------*/

	/* Define routes */
	var AppRouter = Backbone.Router.extend({
			routes: {
				'login/:token':'login',
				'popin/:type/:name':'openPopin', 				
				'user/myorders/order/:id':'orderView', 				
				'user/mycreditcard/editcreditcart/:id':'cardEditView',
				'user/mycreditcard/deletecreditcart/:id':'cardDeleteView',		
				'user/myaddress/editmyadress/:id':'addressEditView',
				'user/myaddress/deletemyadress/:id':'addressDeleteView',

				'user/*path':'loadUserView',

				'passwordRecovery/:crypt/:key':'loadPasswordRecovery',
				'':'redirectToHome',
				'*path':'loadView'
			},
			refresh:function(){
				Backbone.history.fragment = null;
				Backbone.history.navigate(document.location.hash, { trigger:true, replace:true });
			}
		});

	/*-------------------- INIT --------------------*/
	
	if(DEBUG) console.log('Router initialized');

	/* Clear localStorage */
	Utils.storage.clear(false);

	/* Instanciate the router */
	var Router = new AppRouter(),
		currentLevel = null,
		currentView = null,
		currentContent = null,
		progress = false,
		refresh = false,
		renderAndDisplay = function(Screen, params){
			

			Utils.Functions.hideShowHome();
			
			/* If non visible view - Background task */
			if(-1 == Screen.level){
				var task = new Screen.view();
				task.render(true);

				/* No need to refresh */
				refresh = false;

				return
			
			/* Else if same level view, simple replace */
			} else if(currentLevel == Screen.level){
				/* Add ID il Screen object and store CurrentID to prevent same view replacment */
				if(Screen.id == currentContent) return;

				/* Append new container without 'prev' or 'next' */
				currentView.$el.after('<section class="same"></section>');
				
				/* store old reference for destruction purpose */
				var oldView = currentView,
					View = Screen.view.extend({
						el:$('.same')
					});

				currentContent = Screen.id;
				currentView = new View();
				currentView.render(true);
				currentView.$el.removeClass('same');

				/* Destuction of old view */
				if(oldView.unlink) oldView.unlink();
				oldView.unbind();
				oldView.remove();

				/* No need to refresh */
				refresh = false;

			/* Else if transition in progress, history back to prevent multiple transition */
			} else if(progress){
				//console.log(progress);
				refresh = true;
				return;

			/* Else manage transition */
			} else {
				
				progress = true;

				/* DETERMINE IF FORWARD OR BACKWARD */
				var first = (null == currentLevel),
					way = (Screen.level > currentLevel)? 'forward' : 'backward',
					from = 'current',
					to = '',
					oldView = currentView;

				/* If previous screen loaded */
				if(!first){
					from = ('forward' == way)? 'next' : 'prev';
					to = ('forward' == way)? 'prev' : 'next';

					/* Hide */
					oldView.$el.addClass(to);
				};

				
				/* Set view root, instanciate and render */
				var View = Screen.view.extend({
						el:$('.'+from)
					});				
				
				currentContent = Screen.id;
				if(params){
					currentView = new View({params:params});
				}else{
					currentView = new View();
				}
				
				currentView.render(true);
				currentView.$el.removeClass(from);

				/* Store current screen level */
				currentLevel = Screen.level;

				/* Reset base DOM structure after transition */
				setTimeout(function(){

					progress = false;

					/* Remove oldview */
					if(oldView){
						if(oldView.unlink) oldView.unlink();
						oldView.unbind();
						oldView.remove();
					}; 

					/* Reset DOM base structure */
					currentView.$el.prevAll('section').remove();
					currentView.$el.nextAll('section').remove();
					currentView.$el.before('<section class="prev"></section>').after('<section class="next"></section>');
					
					/* Check if refresh is needed */
					if(refresh){
						/* Need redirection */
						Router.refresh();
						/* Reset previously store redirection */
						refresh = false;
					};

				},500);

			};

		},
		backupToHome = function(err){
			/* Allow multiple require on a file (ensure network problem won't bloc user) */
			if(err) require.undef(err.requireModules[0]);
			/* Redirect to home - Maybe we must condition this action */
			Router.navigate('home',{ trigger: true, replace: true });
		};

	/*-------------------- ACTIONS --------------------*/

	/* If call on root */
	Router.on('route:redirectToHome',backupToHome);

	/* Standard pages */
	Router.on('route:loadView', function (path) {
		 
		/* Require view */
		require(['view/'+path],renderAndDisplay,backupToHome); 
		if(DEBUG) console.log(path+' Route');

	});

	Router.on('route:loadPasswordRecovery',function(crypt,key){ 

		var params = new Object();
		params.crypt = crypt;
		params.key = key;
		require(['view/passwordRecovery'],function(view){
			renderAndDisplay(view,params)
		},backupToHome);		
		
	});

	/* Pages that need a valid session */
	var loadUserView = function(path){
		
		/* Check if session still valid */
		Utils.session.check({
			// expired:backupToHome,
			expired:function(){
		
				/* Require view */
				require(['view/user/'+path],renderAndDisplay,backupToHome);
				if(DEBUG) console.log('User : '+path+' Route');

			},
			valid:function(){
		
				/* Require view */
				require(['view/user/'+path],renderAndDisplay,backupToHome);
				if(DEBUG) console.log('User : '+path+' Route');

			}
		});

	};
	Router.on('route:loadUserView',loadUserView);

	Router.on('route:orderView', function(id) {   
		require(['model/user/product'],function(ProductModel){
			ProductModel.set({ id:id , silent:true });
		});
		var path = 'myorders/order';
		loadUserView(path);
	});
 
	Router.on('route:cardEditView', function(id) {   
		require(['model/user/cards'],function(CardsModel){
			CardsModel.set({ id:id , silent:true });
		});
		var path = 'mycreditcard/editcreditcart';
		loadUserView(path);
	});

	Router.on('route:cardDeleteView', function(id) {   
		require(['model/user/cards'],function(CardsModel){
			CardsModel.set({ id:id , silent:true });
		});
		var path = 'mycreditcard/deletecreditcart';
		loadUserView(path);
	});
 
	Router.on('route:addressEditView', function(id) {   
		require(['model/user/addresses'],function(CardsModel){
			CardsModel.set({ id:id , silent:true });
		});
		var path = 'myaddress/editmyadress';
		loadUserView(path);
	});

	Router.on('route:addressDeleteView', function(id) {   
		require(['model/user/addresses'],function(CardsModel){
			CardsModel.set({ id:id , silent:true });
		});
		var path = 'myaddress/deletemyadress';
		loadUserView(path);
	});

	/* Popin */
	Router.on('route:openPopin', function(type,name) {

		history.back();
		
		/* Build params obj */
		var contentid = ('id' == type)? name : undefined,
			content = ('id' != type)? name : 'connexion-error',
			params = {
				contentid:contentid,
				content:content,
				data:{  }
			};

		Utils.popin.open(params);

	});

	/* Popin */
	Router.on('route:login', function(token) {
		require(['view/login'],function(loginView){
			var login = new loginView({ token:token });
		});		
	});

	return Router;

});
