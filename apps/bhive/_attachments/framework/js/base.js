(function(){
	var bh = window.bh;

	bh.loadModules = function(callback){
		var prev = "";
		var module_name = "";
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
		berfore_other = function(){
			bh.logger("Finished loading all the modules");
			bh.module.drawOnPage();
			callback();
		};
		bh.loader.require(module_name, berfore_other);
	};
	window.bh = bh;
})();