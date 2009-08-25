(function(bh){

	bh.loadModules = function(callback){
		var prev = "";
		var module_name = "";
		if(bh.settings.modules.length > 0){
			for(module_name in bh.settings.modules){
				module_name = bh.settings.modules[module_name];
				js = bh.app_name_dep("couch_design_url")+"modules/" + module_name + "/module.js";
				bh.settings.file_groups[module_name] = {
					js:[js],
					css:[]
				};
				if(prev){
					bh.settings.file_groups[module_name]["deps"] = [prev];
				}
				prev = module_name;
			}

			bh.loader.require(module_name, callback);
		} else {
			callback();
		}
	};
})(window.bh);