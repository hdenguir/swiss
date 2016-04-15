// Filename: main.js

/* Require config */
require.config({
	catchError:true,
	shim:{
	    'jquery': {
	      exports: '$'
	  	},
	    'serialize': {
	      deps:['jquery'],
	      exports: 'serialize'
	    }
    },
	paths: {
		jquery: 'lib/jquery/jquery-min',
		jqueryvalidator: 'lib/jquery/jquery.validate.min',
		serialize: 'lib/jquery/jquery-serialize',
		uaparser: 'lib/jquery/ua-parser',
		underscore: 'lib/underscore/underscore-min',
		backbone: 'lib/backbone/backbone-min',
		templates: '../templates'
	}
});
require(['app']);
 
var	Utils = {},
	DEBUG = false,
	CHANGED = false,
	PHONEGAP = false,
	VALIDATE = false,
	ISLOCAL = false,
	STEPREGISTER = false,
	SITEURL = 'http://sc.owa.tf/', //http://sc.owa.tf/
    USEPROXY = true,
	PROXYURL = 'http://dev.calyos.fr/skape/skape-be/api/',
	CMSURL = 'http://dev.calyos.fr/skape/skape-be/api/',
	ISTOUCH = 'ontouchstart' in window,
	STARTEVENT = (ISTOUCH)? 'touchstart' : 'mousedown',
	MOVEEVENT = (ISTOUCH)? 'touchmove' : 'mousemove',
	ENDEVENT = (ISTOUCH)? 'touchend' : 'mouseup';
	ORIENTATIONEVENT = ('onorientationchange' in window)? 'orientationchange' : 'resize';

/* Test if Cordova loaded and inside a webview */
document.addEventListener("deviceready", function(){
	PHONEGAP = true;
}, false);

