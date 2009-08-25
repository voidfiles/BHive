(function(bh){ 
	
	bh.module.includeCSS("css/testsuite.css");
	var module_object = {
		name:"TestRunner",
		displayModules:{
				tab:{
					header:"BH Testrunner",
					body:"<h2 id=\"banner\"></h2>" +
			        "<h2 id=\"userAgent\"></h2>" +
			        "<ol id=\"tests\"></ol>" +
			        "<div id=\"main\"></div>" +
			        "<script type=\"text/javascript\" src=\"/bhive/_design/bhive/libs/qunit/testrunner.js\"></script>" +
			        "<script type=\"text/javascript\" src=\"/bhive/_design/bhive/modules/testrunner/js/test.js\"></script>"
				}
		},
		api:{
			name: function(){
				return "example";
			}
		}
	};

	bh.module.addModule(module_object);
})(window.bh);

