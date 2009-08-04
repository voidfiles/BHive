// Routes 
// http://localhost:8888/Javascript-Application-Platform/
// http://localhost:8888/Javascript-Application-Platform/

if(typeof(bh) === "undefined"){
	bh = {};
}
bh.settings = {
	"load_local_jquery":1,
	"load_ui_on_load":1,
	"debug":1,
	"data_uri":"http://localhost:8085/", 
	"http_server":"http://localhost:8888/Javascript-Application-Platform/", 
	"framework_path":"framework/",
	"root_app_path":"/Javascript-Application-Platform/apps/testrunner/"
};

bh.settings["file_groups"] = {
	jsapi:{
		"js":["http://www.google.com/jsapi"],
		"css":[]
	},
	jquery:{
		"js":[bh.settings.http_server + "libs/jquery/jquery-1.3.2.min.js" ],
		"css":[]
	},
	jqueryui:{
		"js":[bh.settings.http_server + "libs/jqueryui/js/jquery-ui-1.7.2.custom.min.js" ],
		"css":[bh.settings.http_server + "libs/jqueryui/css/ui-lightness/jquery-ui-1.7.2.custom.css" ],
		"depends":["jquery"]

	},
	base: {
		"js":[bh.settings.framework_path + "base.js"],
		"css":bh.settings.framework_path + ["base.css"],
		"depdends":["jquery"]
	},
	data: {
		"js":[bh.settings.framework_path + "data.js"],
		"css":[],
		"depdends":["jquery"]
	}
};
	
bh.settings["routes"] = [
	{
		"name":"main",
		"path":"/",
		"view":"main"
	}
];


if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)){ //test for MSIE x.x;
 var ieversion=new Number(RegExp.$1); // capture x.x portion and store as a number
 if (ieversion>=8)
  bh.settings["msie"] = 1;
 else if (ieversion>=7)
  bh.settings["msie"] = 1;
 else if (ieversion>=6)
  bh.settings["msie"] = 1;
 else if (ieversion>=5)
  bh.settings["msie"] = 1;
}
else
 bh.settings["msie"] = 0;


