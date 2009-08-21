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
	var module2 = new module("help1");
	var module3 = new module("help2");
	bh.module.addModule("tab","help3",module1);
	bh.module.addModule("tab","help4",module2);
	bh.module.addModule("module","help5",module3);
	bh.module.addModule("module","help6",new module("help4"));
	bh.module.addModule("module","help7",new module("help5"));
	bh.module.addModule("module","help8",new module("help6"));
	window.bh = bh;
	
})();