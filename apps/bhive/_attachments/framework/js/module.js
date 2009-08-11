(function(){
	// Basic Module handling framework
	var bh = window.bh;
	
	bh.module = {};
	bh._modules = [];
	bh.module.getModules = function(){
		return bh._modules;
	};
	
	
	bh.module.addModule = function(type,name,ref){
		bh.logger("adding modules",type,name,ref)
		bh._modules.push(
			{
				name:name,
				type:type,
				ref:ref
			}
		);
	};
	bh.module.types = {};
	bh.module.types.tab = function(ref){
	   var num_of_tabs = jQuery("#module_1 .main_module ul li").size();
	   var text = "<li><a href=\"#tabs-{tab_number}\">{tab_title}</a></li>";
	   var replacement = {
			tab_number:num_of_tabs,
			tab_title:ref.header
		};
		var conf = {
			data:replacement,
			template:text
		};
		var text = bh.template.render(conf);
		var tab_container = jQuery("#module_1 .main_module ul").append(text);
		var tab_content = "<div id=\"tabs-{tab_number}\">{content}</div>";
		var replacement = {
			tab_number:num_of_tabs,
			content:ref.content
		};
		var conf = {
			data:replacement,
			template:tab_content
		};
		var tab_content = bh.template.render(conf);
		jQuery("#module_1 .main_module").append(tab_content);
		
	};
	bh.module.drawOnPage = function(){
		bh.logger("going to draw on page",bh._modules);
		for(var x in bh._modules){
			mod = bh._modules[x];
			var output = mod.ref.render();
			bh.logger("output of ",mod.name,output);
			renderer = bh.module.types[mod.type];
			renderer(output);
		}
	};
	window.bh = bh;
})();