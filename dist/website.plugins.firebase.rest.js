/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	function fix(data){
	  if(typeof data === 'string'){
	    return data.replace(/\\/,'/').replace(/-dot-/g,'.');
	  } else if(typeof data === 'object' && typeof data.sitemap === 'object'){
	    var sitemap = {};
	    for(var key in data.sitemap){
	      sitemap[fix(key)] = data.sitemap[key];
	    }
	    data.sitemap = sitemap;
	  }
	  return data;
	}

	function safe(url){
	  return url.replace(/\//,'\\').replace(/\./g,'-dot-');
	}

	function http(url,cb) {
	  var xhr = new XMLHttpRequest();
	  xhr.open('GET', url);
	  xhr.onreadystatechange = function() {
	   if (xhr.readyState == 4 && cb) {
	        var data = fix(JSON.parse(xhr.responseText));
	        if(xhr.status === 200){
	          cb(null,data);
	        } else {
	          cb(xhr.status,xhr);
	        }
	      }
	  };
	  xhr.send();
	  return xhr;
	}

	var FirebaseRestPlugin = {
	  created: function(options){
	    if(!options.firebase || !options.firebase.content || !options.firebase.data){
	      self.emit('dataError','no firebase url');
	      self.emit('contentError','no firebase url');
	      return;
	    }
	    if(options.firebase.content[options.firebase.content.length-1] !== '/') {
	      options.firebase.content += '/';
	    }
	    if(options.firebase.data[options.firebase.data.length-1] === '/') {
	      options.firebase.data = options.firebase.data.substr(0,options.firebase.data.length-1);
	    }
	  },
		getContent: function(id,callback){
			return http(this.options.firebase.content + safe(id) + '.json',callback);
		},
		getData: function(callback){
			return http(this.options.firebase.data + '.json',callback);
		}
	};

	if(window.Website) window.Website.plugins.firebase = FirebaseRestPlugin;
	module.exports = FirebaseRestPlugin;

/***/ }
/******/ ])