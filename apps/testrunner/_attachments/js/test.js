jQuery(document).ready(function(){

	module("Bootstrap");

	test("Run Boostrap", function() {
		var local_bh_copy = window.bh;
		 
		bh.settings.load_local_jquery = 1;
		
		var callback = function(){
			console.info("test 1");
			ok(true, "loaded jquery local");
			window.bh = local_bh_copy;
			start();
		};
		bh.bootstrap(callback);
		stop();
		expect( 1 );
		
	});
	
	test("Run Boostrap", function() {
		var local_bh_copy = window.bh;
		 
		bh.settings.load_local_jquery = 1;
		
		var callback = function(){
			console.info("test 1");
			ok(true, "loaded jquery local");
			window.bh = local_bh_copy;
			start();
		};
		bh.bootstrap(callback);
		stop();
		expect( 1 );
		
	});
	
	

	
	
	
	

});