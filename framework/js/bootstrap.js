
(function(){
	if ( typeof(window.bh) ===  "undefined"){
		var bh = {};
		
	} else {
		var bh = window.bh;
	}
	
	bh.logger = function(stuff){
		if(window["console"] !== undefined && bh.settings.debug){
			console.log.apply(console,arguments);
		}

	};

	bh.bootstrap = function(){
		this.load_jquery_through_jsapi = function(){
	        google.load("jquery", "1");
			google.load("jqueryui", "1.7.2");
			google.setOnLoadCallback(bh.route);
	    };
	    if(!bh.settings.load_local_jquery){
	        bh.loader.require("jsapi",this.load_jquery_through_jsapi);
	    } else {
	        bh.logger("loading local jqueryui locally");
	        bh.loader.require("jqueryui",bh.route);
	    }
	};
	
	bh.routeToView = function(){
		var routes = bh.settings.routes;
		for(i in routes){
			route = routes[i];
			current_path = bh.cache.get("current_path");
			if(route.path == current_path){
				bh.logger("Current View is ", route.view);
				var view = bh["Views"][route.view];
				view.render();
			}

		}
	};

	bh.route = function(){
		bh.logger("Ready to roll");
		var current_path = document.location.pathname;
		bh.logger(bh.settings.root_app_path, current_path);
		current_path = current_path.replace(bh.settings.root_app_path,"/");
		bh.cache.set("current_path",current_path);
		
		bh.logger("this is the path", current_path);


		var routes = bh.settings.routes;
		for(i in routes){
			route = routes[i];
			
			if(route.path == current_path){
				bh.logger("Current View is ", route.view);
				var view = bh.views[route.view];
				view.render();
			}

		}



		return true;

	};
bh.loader = {
	
	groups:{},// This is where we can store data about stuff we loaded.
	require:function(group_name,callback){
		bh.logger("inside require", group_name);
		bh.logger(bh.settings, bh.settings.file_groups);
		file_group = bh.settings.file_groups[group_name];
		
		if(file_group["depends"]){
			bh.logger("We Have some dependencys", file_group["depends"]);
			for( i in file_group["depends"]){
				dep_name = file_group["depends"][i];
				bh.logger("Do we have it",bh.loader.groups[dep_name]);
				if(typeof(bh.loader.groups[dep_name]) == "undefined"){
					bh.logger("inside dep, don't have it asking for it.", dep_name);
					bh.loader.require(dep_name, function(){
						bh.logger("Were done loading", dep_name,"Now were going to load", group_name);
						bh.loader.require(group_name,callback);
					});
					return;
				}
			}
		}

		bh.logger("Here before checking undefined",typeof(bh.loader.groups[group_name]));
		if(typeof(bh.loader.groups[group_name]) != "undefined"){
			bh.logger("we have something by that name",group_name);
			
			if(bh.loader.groups[group_name]["loaded"]){
				bh.logger("Dep:", group_name,"has been loaded run callback");
				callback();
				return;
			}
			if(bh.loader.groups[group_name]["loading"]){
				bh.logger(group_name," is loading looping", group_name);
				redo_in_some_time = function(){
					bh.loader.require(group_name,callback);
				};
				bh.logger("Would set re-try here.");
				setTimeout(redo_in_some_time,50);
				return;
			}
		}
		
		bh.loader.groups[group_name] = {};
		bh.loader.groups[group_name]["loaded"] = 0;
		bh.loader.groups[group_name]["loading"] = 1;
		bh.loader.groups[group_name]["main_callback"] = callback;
		bh.loader.groups[group_name]["ind_callback"] = [];
		bh.loader.groups[group_name]["ind_status"] = [];
		
		bh.logger(bh.loader.groups[group_name]);
		
		
		
		var b = 0; 
		
		for(i in file_group.css){
			url = file_group.css[i];
			link = bh.loader.create_css(url);
			var headID = document.getElementsByTagName("head")[0]; 
			headID.appendChild(link);
		}
		
		for(i in file_group.js){
			
			url  = file_group.js[i];
			script = bh.loader.create_js(url);
			bh.logger("Creating DOM element for js file",url, script);
			var headID = document.getElementsByTagName("head")[0]; 
			headID.appendChild(script);
			
			bh.loader.groups[group_name]["ind_callback"][b] = function(){
				
				var index = b;
				//var group_name = group_name;
				bh.logger("callback being called", index, group_name);
				bh.loader.groups[group_name]["ind_status"][index] = 1;
				all_done = 1;
				for(c in bh.loader.groups[group_name]["ind_status"]){
					if(bh.loader.groups[group_name]["ind_status"][c] == 0){
						all_done = 0;
					}
				}
				if(all_done){
					bh.logger("all files reporting done calling the main callback of group_name ",group_name, callback);
					all_done_callback = bh.loader.groups[group_name]["main_callback"];
					bh.loader.groups[group_name]["loaded"] = 1;
					bh.loader.groups[group_name]["loading"] = 0;
					all_done_callback();
				}
			};
			if(!bh.settings.msie){
				
				script.onload = bh.loader.groups[group_name]["ind_callback"][b];
				bh.logger("Created NON-IE based callback", b);
			} else {
				
				script.onreadystatechange = function () {
					bh.logger("Non ID callback being called", b);
					if (script.readyState == 'loaded' || script.readyState == 'complete') {
						callback = bh.loader.groups[group_name]["ind_callback"][b];
						callback();
				    }
				};
				bh.logger("Created IE based callback", b);
			}
		}
		
		
	},
	createDom: function(conf_object){
		// conf_object should have node type and attributes
		// ex: {"node_type":"link"}
		var elem = document.createElement(conf_object["node_type"]);
		for( var i in node_object.attrs){
			elem[i] = node_object.attrs[i];
		}
		
		return elem;
	},
	"create_css": function(url){
		var link = document.createElement("link");
		link.href    = url;
		link.type    = "text/css";
		link.charset = "utf-8";
		link.media   = "screen";
		link.rel     = "stylesheet";
		  // add script tag to head element
		
		return link;

	},
	"create_js":function(url){
		var script = document.createElement("script");
		script.src  = url;
		script.type = "text/javascript";
		
		return script;

	}
};
bh.cache = {
	"set": function(key,data){
		this["_store"][key] = data;
		return 1;
	},
	"get": function(key){
		var ret_var = this["_store"][key];
		if(!ret_var){
			return 0;
		}
		
		return ret_var;
		
	},
	"delete":function(key){
		delete this["_store"][key];
	},
	"_store":{}
};
bh.localCachedAjax = {
	conf:{
		type: "GET", 
		dataType: "json"
	},
	fetching:{},
	get:function(cache_key,conf_object){
		
		var in_cache = bh.cache.get(cache_key);
		if(in_cache){
			conf_object.success();
		}
		if(bh.cachedGetter["fetching"][cache_key]){
			var recall = function(){
				bh.cachedGetter.get(cache_key,conf_object);
			};
			setTimeout(recall,50);
		}
		bh.cachedGetter["fetching"][cache_key] = 1;
		var conf = jQuery.extend(bh.cachedGetter["conf"], conf_object);
		var success_func = conf.success;
		conf.success = function(data){
			bh.cache.set(cache_key,data);
			bh.cachedGetter["fetching"][cache_key] = 0;
			success_func();
		};
		jQuery.ajax(conf);
		
	}
};

bh.views = {
	"main": {
		render:function(){
			document.write("Hello");
		}
	}
};
window.bh = bh;
})();