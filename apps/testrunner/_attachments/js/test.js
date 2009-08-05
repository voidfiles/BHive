jQuery(document).ready(function(){

	module("Bootstrap");
	test("Load Bootstrap", function() {
		
		stop();
		jQuery.getScript( "../../framework/js/bootstrap.js", function(){
			ok( bh, "bh loaded" );
			start();
		});
		expect( 1 );
	});
	test("Run Boostrap load local", function() {
		var local_bh_copy = window.bh;
		 
		bh.settings.load_local_jquery = 1;
		
		bh.route = function(){
			ok(true, "loaded jquery local");
			window.bh = local_bh_copy;
			start();
		};
		
		bh.bootstrap();
		stop();
		expect( 1 );
		
	});
	
	
	test("Test Route Function", function() {
		var local_bh_copy = window.bh;
		bh.settings.routes = [
			{
				"name":"testing",
				"path":"/",
				"view":"testing"
			}
		];
		bh.views = {
			"testing": {
				render:function(){
					ok(true, "routed correct place");
					window.bh = local_bh_copy;
					//start();
				}
			}
		};
		//stop();
		bh.route();
		expect( 1 );
		
	});	
	

});