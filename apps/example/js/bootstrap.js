

var BHIVE = {
	"Settings": {
		"load_ui_on_load":1,
		"debug":1,
		"data_uri":"http://localhost:8085/"
	},
	"Logger": function(stuff){
		if(window.console && BHIVE.Settings.debug){
			window.console.log(arguments);
		}
		
	}
};
