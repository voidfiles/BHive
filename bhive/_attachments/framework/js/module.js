(function(bh){
	// Basic Module handling framework

	
	bh.module = {};
	bh._modules = [];
	bh.module.getModules = function(){
		return bh._modules;
	};
	
	bh.module.includeCSS = function(css_href){
		jQuery("head").append("<link rel=\"stylesheet\" href=\""+css_href+"\" type=\"text/css\" media=\"screen\" />");
	};
	bh.module.addModule = function(module){
		//bh.logger("adding modules",type,name,ref);
		bh._modules.push(module);
	};
	bh.module.types = {};

	bh.module.types.module = function(ref,view){
		
		bh.template.return_template("default/module.html", function(data){
			var last_module = jQuery(".unassigned:first");
			var template = data;
			var replacement = {
				hd:view.header,
				bd:view.body,
				ft:""
			};
			var conf = {
				data:replacement,
				template:template
			};
			//bh.logger(last_module);
			last_module.html(bh.template.render(conf));
			last_module.removeClass("unassigned");
		});

	};
	bh.module.types.tab = function(ref,view){
	   bh.logger(ref);
	   var num_of_tabs = jQuery(".tab-container:first ul li").size();
	   var text = "<li><a href=\"#tabs-{tab_number}\">{tab_title}</a></li>";
	   var replacement = {
			tab_number:num_of_tabs,
			tab_title:view.header
		};
		var conf = {
			data:replacement,
			template:text
		};
		var text = bh.template.render(conf);
		var tab_container = jQuery(".tab-container:first ul").append(text);
		var tab_content = "<div id=\"tabs-{tab_number}\">{content}</div>";
		var replacement = {
			tab_number:num_of_tabs,
			content:view.body
		};
		var conf = {
			data:replacement,
			template:tab_content
		};
		var tab_content = bh.template.render(conf);
		jQuery(".tab-container:first").append(tab_content);
		
	};
	bh.module.refreshView = function(){
		for(var m in bh._modules){
			var module = bh._modules[m];
			for(var d in module.displayModules){
				var view = module.displayModules[d];
				bh.module.types[d](module,view);
			}
		}
	};
	bh.module.drawOnPage = function(){
		//bh.logger("going to draw on page",bh._modules);
		for(var x in bh._modules){
			mod = bh._modules[x];
			var output = mod.ref.render();
			//bh.logger("output of ",mod.name,output);
			renderer = bh.module.types[mod.type];
			renderer(output);
		}
		$(function() {
			$(".row-modules").sortable({
				connectWith: '.row-modules'
			}).disableSelection();
		});
		
	};

})(window.bh);