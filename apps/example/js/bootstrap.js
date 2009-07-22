

var BHIVE = {
	"Settings": {
		"load_ui_on_load":1,
		"debug":1,
		"data_uri":"http://localhost:8085/",
		"framework_root":"http://bhive.local/framework/",
		"file_groups": {
			"base": {
				"js":["base.js"],
				"css":["base.css"]
			},
			"data": {
				"js":["data.js"],
				"css":[]
			}
		}
	},
	"Logger": function(stuff){
		if(window["console"] !== undefined && BHIVE.Settings.debug){
			window.console.log(arguments);
		}
		
	},
	"loader":{
		"groups":{
			// Each group should have 2 properties loaded, loading 
			// "base" :{ "loaded":0, "loading":0}
			"blah":"blah"
		},
		"require":function(group_name,callback){
			file_group = BHIVE.Settings.file_groups[group_name];
			BHIVE.loader.groups[group_name]["loaded"] = 0;
			BHIVE.loader.groups[group_name]["loading"] = 1;
			BHIVE.loader.groups[group_name]["main_callback"] = callback;
			BHIVE.loader.groups[group_name]["ind_callback"] = [];
			BHIVE.loader.groups[group_name]["ind_status"] = [];
			var b = 0; 
			
			for(i in file_group.css){
				url = filr_group.css[i];
				link = BHIVE.loader.create_css(url);
				jQuery("head")[0].appendChild(link);
			}
			
			for(i in file_group.js){
				url  = file_group.js[i];
				script = BHIVE.loader.create_js(url);
				jQuery("head")[0].appendChild(script);
				
				BHIVE.loader.groups[group_name]["ind_callback"][b] = function(){
					var index = b;
					var group_name = group_name;
					BHIVE.loader.groups[group_name]["ind_status"][index] = 1;
					all_done = 1;
					for(c in BHIVE.loader.groups[group_name]["ind_status"]){
						if(BHIVE.loader.groups[group_name]["ind_status"][c] == 0){
							all_done = 0;
						}
					}
					if(all_done){
						callback = BHIVE.loader.groups[group_name]["main_callback"];
						callback();
					}
				};
				if(jQuery.browser.msie){
					script.onload = BHIVE.loader.groups[group_name]["ind_callback"][b];
				} else {
					script.onreadystatechange = function () {
						if (script.readyState == 'loaded' || script.readyState == 'complete') {
							callback = BHIVE.loader.groups[group_name]["main_callback"];
							callback();
					    }
					};
				}
			}
			
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
			var script = document.createElement("link");
			script.src  = url;
			script.type = "text/javascript";
			
			jQuery("head")[0].appendChild(script);  // add script tag to head element
			return script;

		}
	}
};
