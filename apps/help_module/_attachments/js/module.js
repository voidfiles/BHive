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
	
	bh.logger("adding my help module");
	var module1 = new module("help");
	var module2 = new module("help2");
	var module3 = new module("help3");
	bh.module.addModule("tab","help",module1);
	bh.module.addModule("tab","help2",module2);
	bh.module.addModule("tab","help3",module3);
	window.bh = bh;
	
})();