// Filename: navigation.js
define([
	'jquery',
	'underscore',
	'backbone',
	'model/navigation',
	'text!templates/navigation.html'
], function($, _, Backbone, NavigationModel, navigationTpl){

	/*-------------------- CONFIG --------------------*/

	var View = Backbone.View.extend({

		el:$('.nav'),
		
		/*-------------------- INIT / DEFERED INIT --------------------*/

		initialize:function(){

			/* View / Model association */
			var that = this;
			
			/* Bind collection changes that need the view to refresh */
			NavigationModel.bind('change',function(){ that.render(); });

		},
		/* Unlink model to prevent multiple binding and save resources */
		unlink:function(){
			NavigationModel.off();
		},

        events:{
          'click .item a':'showNav',
        },

        showNav: function(e){
        	var self = $(e.target),
        		indx = self.parents("li").index();

        	/* Hide/Show Nav */
            $(".nav").toggleClass("empty"); 

            /* Add class 'active' to current page */
            $(".item").removeClass("active").eq(indx).addClass("active");
        },

		/*-------------------- RENDER --------------------*/
		render:function(){
			
			// Vars
			var	compiledTemplate = _.template(navigationTpl, { model:NavigationModel });
			
			// Append
			this.$el.html(compiledTemplate);

		},

		/*-------------------- METHODS --------------------*/

		activate:function(index){  
			this.$el.removeClass('empty');
			NavigationModel.set({ active:index });
		},

		hide:function(){
			this.$el.addClass('empty');
		}

	}); 

	/* Instanciate the view */
	var Navigation = new View();
	Navigation.render();


	return Navigation;

});
