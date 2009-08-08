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
	"root_app_path":"/Javascript-Application-Platform/apps/testrunner/",
	"bhive_base":"http://localhost:5984/bhive/_design/bhive/"
};
var parsed_domain = document.location.href.split('/');
//bh.settings.http_server = "http://" + parsed_domain[2] + "/" + parsed_domain[3] + "/_design/" + parsed_domain[5] +"/";
//console.log(bh.settings.http_server);
bh.settings["file_groups"] = {
	jsapi:{
		"js":["http://www.google.com/jsapi"],
		"css":[]
	},
	jquery:{
		"js":[bh.settings.bhive_base + "libs/jquery/jquery-1.3.2.min.js" ],
		"css":[]
	},
	jqueryui:{
		"js":[bh.settings.bhive_base + "libs/jqueryui/js/jquery-ui-1.7.2.custom.min.js" ],
		"css":[bh.settings.bhive_base + "libs/jqueryui/css/ui-lightness/jquery-ui-1.7.2.custom.css" ],
		"depends":["jquery"]

	},
	base: {
		"js":[bh.settings.bhive_base + "base.js"],
		"css":[bh.settings.bhive_base + "base.css"],
		"depdends":["jquery"]
	},
	data: {
		"js":[bh.settings.bhive_base + "data.js"],
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


