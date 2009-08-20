jQuery(document).ready(function(){

	module("Bootstrap");
	
	test("Load Settings", function() {
		expect( 1 );
		var local_bh_copy = window.bh;
		bh.load_settings();
		equals( bh.settings.app_name, "testrunner", "app name should be testrunner" );
		window.bh = local_bh_copy;
	});
	
	test("Detect Browser", function() {
		expect( 1 );
		var local_bh_copy = window.bh;
		bh.load_settings();
		bh.detect_browser();
		if(bh.settings.msie == "0" || bh.settings.msie == "1"){
			ok(true, "detected browser");
		}
		window.bh = local_bh_copy;
	});
	
	test("Test Require: Load Base", function() {
		expect( 1 );
		var local_bh_copy = window.bh;
		bh.load_settings();
		bh.detect_browser();
		var callback = function(){
			ok((typeof(bh.loadModules) == "function"), "loaded base");
			window.bh = local_bh_copy;
			start();
		};
		bh.loader.require("base", callback);
		stop();
		
	});
	
	test("Test Load Modules: No Modules", function() {
		expect( 1 );
		var local_bh_copy = window.bh;
		bh.load_settings();
		bh.detect_browser();
		var callback = function(){
			ok((bh._modules.length == 0), "loaded no modules");
			window.bh = local_bh_copy;
			start();
		};
		bh.loader.require("base", function(){
			bh.loadModules(callback);
		});
		stop();
		
	});
	
	test("Test Load Modules: One Module", function() {
		expect( 1 );
		
		var local_bh_copy = window.bh;
		bh.load_settings();
		bh.detect_browser();
		bh.settings.modules.push("mock_module");
		var callback = function(){
			ok((bh._modules.length == 1), "loaded one module");
			window.bh = local_bh_copy;
			start();
		};
		bh.loader.require("base", function(){
			bh.loadModules(callback);
		});
		stop();
		
	});
	
	
	test("Test Load Modules: Two Module", function() {
		expect( 1 );
		var local_bh_copy = window.bh;
		bh.load_settings();
		bh.detect_browser();
		bh.settings.modules.push("mock_module");
		bh.settings.modules.push("mock_module2");
		var callback = function(){
			ok((bh._modules.length == 2), "loaded two module");
			window.bh = local_bh_copy;
			start();
		};
		bh.loader.require("base", function(){
			bh.loadModules(callback);
		});
		stop();
		
	});
	
	module("Model");
	
	test("Create model", function() {
		expect( 2 );
		var local_bh_copy = window.bh;
		bh.load_settings();
		bh.detect_browser();
		callback = function(){
			
			
			TestModel = {
				fields:{
					first_name:new bh.model.fields.String({optional:true}),
					last_name:new bh.model.fields.String({optional:false})
				}
			};
			
			TestModel = bh.model.blessModel(TestModel);
			
			bh.logger("what do we get back",TestModel);
			ok(TestModel.objects, " we inserted an object manager");
			
			
			test_model = TestModel.create({frist_name:"alex",last_name:"kessinger"});
			
			ok(test_model, " we created an object");
			
			test_model = TestModel.create({frist_name:"alex",last_name:""});
			
			
			ok(test_model, " we failed validation");
			start();
		};
		
		bh.loader.require("model", function(){
			bh.loadModules(callback);
		});
		stop();
		
	});
	



	
	

	
	
	
	

});