(function(){

	var bh = window.bh;
	
	module = {

	};
	
	function module() {
		this.render = function(){
			data = {
				header:"Header",
				content:"Content is here."
			};
			
			return data;
		};
	}
	
	bh.logger("adding my help module");
	var module1 = new module();
	var module2 = new module();
	var module3 = new module();
	bh.module.addModule("tab","help",module1);
	bh.module.addModule("tab","help2",module2);
	bh.module.addModule("tab","help3",module3);
	window.bh = bh;
	
})();