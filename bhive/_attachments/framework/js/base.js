(function(){
	var bh = window.bh;

	bh.loadModules = function(callback){
		var prev = "";
		var module_name = "";
		if(bh.settings.modules.length > 0){
			for(module_name in bh.settings.modules){
				module_name = bh.settings.modules[module_name];
				js = "/" + module_name +"/_design/" + module_name +"/js/module.js";
				css = "/" + module_name +"/_design/" + module_name +"/css/module.css";
				bh.settings.file_groups[module_name] = {
					js:[js],
					css:[css]
				};
				if(prev){
					bh.settings.file_grous[module_name]["deps"] = [prev];
				}
			}

			bh.loader.require(module_name, callback);
		} else {
			callback();
		}
	};
	window.bh = bh;
})();