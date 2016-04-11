// Filename: header.js
define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

    /*-------------------- CONFIG --------------------*/ 

    var HeaderView = Backbone.View.extend({
        el: $('header'),

        initialize:function(options){
            options || (options={});
            this.setLeftButtonWithCheckNetwork('Infos','infos refresh','#infos/home', '');
            this.setRightButton('Logout','logout','#logout');

            require(['utils'], function(Utils){
                Utils.Functions.ButtonWithCheckNetwork();
            });
        },

        events:{
          'click .leftButtonsContainer':'showNav',
        }, 

        showNav: function(){
             if (Utils.storage.get('token')) {
                $(".nav").toggleClass("empty");
            }else{
                Utils.router.navigate('home',{ trigger:true });
            }

            return false;
        },

        goHome:function(){
            require(['utils'], function(Utils){
                Utils.router.navigate('home',{ trigger:true });                
            });
            // Utils.router.navigate('home',{ trigger:true });
        },

        setLeftButtonAndAddRetour: function(text, css, href) {
            this.$el.find('.leftButton').remove();
            this.$el.find('.leftButton2').remove();
            this.$el.find('.leftButtonsContainer').remove();
            if (text && css && href) {
                var t = '<div class="leftButtonsContainer">';
                t += '<a href="#home" class="leftButton2 back">Retour</a>';
                t += '<a href="' + href + '" class="leftButton ' + css + '">' + text + '</a>';
                t += '</div>';
                this.$el.append(t);
            }
        },

        setLeftButton: function(text, css, href) {
            // Remove previous buttons
            this.$el.find('.leftButton').remove();
            this.$el.find('.leftButton2').remove();
            this.$el.find('.leftButtonsContainer').remove();
            // Append new button if has
            if (text && css && href) {
                var t = '<div class="leftButtonsContainer">';
                t += '<a href="' + href + '" class="leftButton ' + css + '">' + text + '</a>';
                t += '</div>';
                this.$el.append(t);
            }
        },
		
		setLeftButtonWithCheckNetwork : function(text, css, href) {

			// Remove previous buttons
            this.$el.find('.leftButton').remove();
            this.$el.find('.leftButton2').remove();
            this.$el.find('.leftButtonsContainer').remove();
            // Append new button if has
			
            if (text && css && href) {
			     

                if( !$(".auth").length ){
				    onlick = 'if(Utils.isConnectedNetwork()){ return true; } else {return false;}';
                } 

                var t = '<div class="leftButtonsContainer hidden">';
                    t += '<a href="' + href + '" class="leftButton ' + css + '">' + text + '</a>';
                    t += '</div>';
                this.$el.append(t);
            }
        },

        setRightButton: function(text, css, href) {
            // Remove previous buttons
            this.$el.find('.rightButton').remove();
            // Append new button if has
            if (text && css && href) this.$el.append('<div class="rightButtonsContainer hidden"><a href="' + href + '" class="rightButton ' + css + '">' + text + '</a></div>');
        }


    });

    /*-------------------- INIT --------------------*/

    if (DEBUG) console.log('Header initialized');

    /* Instanciate the view */
    var Header = new HeaderView();

    return Header;

});
