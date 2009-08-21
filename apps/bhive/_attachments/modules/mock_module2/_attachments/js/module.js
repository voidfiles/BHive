(function(){

	var bh = window.bh;
	

	
	function module(name) {
		this.name = name;
		this.init = function(){
			this.cool = "";
		};
		this.render = function(){
			data = {
				header:"Header",
				content:"Content is here."
			};
			
			return data;
		};
	}
	
	var module1 = new module("help3");
	bh.module.addModule("tab","help3",module1);

	window.bh = bh;
	
})();