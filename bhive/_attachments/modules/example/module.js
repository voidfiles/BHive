
(function(bh){ 
	
	var module_object = {
		name:"Example",
		displayModules:{
				tab:{
					header:"Example Tab",
					body:"Example tabs body"
				},
				module:{
					header:"Example Module",
					body:"Example module body"
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

