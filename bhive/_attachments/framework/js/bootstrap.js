(function(){
	
	if (typeof Object.create !== 'function') {
	    Object.create = function (o) {
	        function F() {}
	        F.prototype = o;
	        return new F();
	    };
	}
	
	
	if ( typeof(window.bh) ===  "undefined"){
		var bh = {};
	} else {
		var bh = window.bh;
	}
	
	b = bh; // protects the defention of the logger function against mass comment, uncomments
	b.logger = function(stuff){
		if(window["console"] !== undefined && ( (bh && bh.settings && bh.settings.debug) || DEBUG ) ){
			console.log.apply(console,arguments);
		}

	};
	bh = b;
	
	bh.app_name_dep = function(what){
		var cache_name = "_" + what;
		if(this[cache_name]){
			return this[cache_name];
		}
		
		switch(what){
			case "base_app_name":
		  		var location = document.location;
				var base_app_name = document.location.href.split('/')[3];
				this[cache_name]  = base_app_name;
		  		break;
			case "couch_design_url":
				var base_database_name = bh.app_name_dep("base_app_name");
				this[cache_name]  = "/"+base_database_name+"/_design/"+base_database_name+"/";
		  		break;
			case "couch_url":
				var base_database_name = bh.app_name_dep("base_app_name");
				this[cache_name]  = "/"+base_database_name+"/";
		  		break;
			case "template_url":
				var design_doc = bh.app_name_dep("couch_design_url");
				this[cache_name]  = design_doc + "templates/";
		  		break;
		default:
		  throw "done have "+ what + "handerl in bh.app_name_dep";
		}
		
		return this[cache_name];
	};

	bh.detect_browser = function(){
		if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)){ //test for MSIE x.x;
		  bh.settings["msie"] = 1;
		} else {
		 bh.settings["msie"] = 0;
		}
	};
	bh.load_settings = function(){
		var settings_url =  bh.app_name_dep("couch_design_url");
		var options = {
			url:settings_url,
			success:function(data) {
				bh.settings = data.data.settings;
			},
			async:false,
			dataType:"json"
		};
		jQuery.ajax( options );
	};

	var d = 0;
	bh.load_layout = function(callback){
		

		var rows = function(){
			var templates = [];
			for(var b in bh.settings.starting_layout){
				var template_name = bh.settings.starting_layout[b];
				var path = "default/" + template_name;
				templates.push(path);
			}
			var options = {
				templates:templates,
				callback:function(data){
					for(var d in data){
						var html = data[d];
						jQuery("#main_module_container").append(html);
					}
					callback();
				}
			};
			
			bh.template.multi_load_template(options);
		};
		
		
		bh.template.load_template("body","default/main_body.html",rows);
	
		
	};
	bh.bootstrap = function(callback){
		var after_modules = function(){
			bh.module.refreshView();
			$(".tab-container").tabs();
			//callback();
		};
        var run_after_base = function(){
            bh.loadModules(after_modules);
        };
		
		var run_after_ui_load = function(){
			bh.loader.require("base", run_after_base);
		};
		var run_after_layout = function(){
			bh.loader.require("jqueryui", run_after_ui_load );
			
		};
		
		var run_after_template = function(){
			bh.load_layout(run_after_layout);
		};
	
		bh.load_settings();
		bh.detect_browser();
		bh.loader.require("template", run_after_template);
        
	};
	
bh.loader = {
	
	groups:{},// This is where we can store data about stuff we loaded.
	require:function(group_name,callback){
		//bh.logger("inside require", group_name);
		file_group = bh.settings.file_groups[group_name];
		//bh.logger("file group desc", file_group);
		if(file_group["deps"]){
			//bh.logger("We Have some dependencys", file_group["deps"]);
			for(var i in file_group["deps"]){
				dep_name = file_group["deps"][i];
				//bh.logger("Do we have it",bh.loader.groups[dep_name]);
				if(typeof(bh.loader.groups[dep_name]) == "undefined"){
					//bh.logger("inside dep, don't have it asking for it.", dep_name);
					bh.loader.require(dep_name, function(){
						//bh.logger("Were done loading", dep_name,"Now were going to load", group_name);
						bh.loader.require(group_name,callback);
					});
					return;
				}
			}
		}

		if(typeof(bh.loader.groups[group_name]) != "undefined"){
			//bh.logger("we have something by that name",group_name);
			
			if(bh.loader.groups[group_name]["loaded"]){
				//bh.logger("Dep:", group_name,"has been loaded run callback");
				callback();
				return;
			}
			if(bh.loader.groups[group_name]["loading"]){
				//bh.logger(group_name," is loading looping", group_name);
				redo_in_some_time = function(){
					bh.loader.require(group_name,callback);
				};
				//bh.logger("Would set re-try here.");
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
		
		//bh.logger(bh.loader.groups[group_name]);
		
		
		
		var b = 0; 
		
		for(i in file_group.css){
			var url = file_group.css[i];
			var string  = "<link type=\"text/css\" href=\""+url+"\" rel=\"stylesheet\" />"; 
			jQuery("head").append(string);
		}
		
		for(i in file_group.js){
			
			url  = file_group.js[i];
			
			bh.loader.groups[group_name]["ind_callback"][b] = function(){
				
				var index = b;
				//var group_name = group_name;
				//bh.logger("callback being called", index, group_name);
				bh.loader.groups[group_name]["ind_status"][index] = 1;
				all_done = 1;
				for(c in bh.loader.groups[group_name]["ind_status"]){
					if(bh.loader.groups[group_name]["ind_status"][c] == 0){
						all_done = 0;
					}
				}
				if(all_done){
					//bh.logger("all files reporting done calling the main callback of group_name ",group_name, callback);
					all_done_callback = bh.loader.groups[group_name]["main_callback"];
					bh.loader.groups[group_name]["loaded"] = 1;
					bh.loader.groups[group_name]["loading"] = 0;
					all_done_callback();
				}
			};
			jQuery.getScript( url, bh.loader.groups[group_name]["ind_callback"][b] );
		}
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
	"del":function(key){
		delete this["_store"][key];
	},
	"_store":{}
};


window.bh = bh;
})();

bh.bootstrap();