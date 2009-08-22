
(function(){ 
	
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

	window.bh.module.addModule(module_object);
})();

