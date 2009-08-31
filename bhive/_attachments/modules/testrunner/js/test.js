jQuery(document).ready(function(){

	module("Bootstrap");
	
	test("Load Settings", function() {
		expect( 1 );
		var local_bh_copy = window.bh;
		bh.load_settings();
		bh.settings.modules = [];
		if(bh.settings.debug != "undefined"){
			ok( true, "loaded settings");
		}
		window.bh = local_bh_copy;
	});
	
	test("Detect Browser", function() {
		expect( 1 );
		var local_bh_copy = window.bh;
		bh.load_settings();
		bh.settings.modules = [];
		bh.detect_browser();
		if(bh.settings.msie == "0" || bh.settings.msie == "1"){
			ok(true, "detected browser");
		}
		window.bh = local_bh_copy;
	});
	
	test("Test Require: Load Base", function() {
		expect( 2 );
		var local_bh_copy = window.bh;
		bh.load_settings();
		bh.settings.modules = [];
		bh.detect_browser();
		var callback = function(){
			ok((typeof(bh.loadModules) == "function"), "loaded base");
			jQuery("link").each(function(i){
				console.log(this.href);
				if(this.href.match("base.css$")){
					ok(true, "found base css");
				}
			});
			window.bh = local_bh_copy;
			start();
		};
		bh.loader.require("base", callback);
		stop();
		
	});
	
	module("Model");
	
	test("Create, Save, Retrive", function() {
		expect( 4 );
		

		var test_docs = function(){

			
			var DocumentManager = bh.document.Manager.extend({
				init: function(){
					var fields = {
						name: new bh.document.fields.StringField( {optional:false} ),
						company: new bh.document.fields.StringField( {max_length:25} )
					};
					this._super(fields);
				}
			});
			var doc_manager = new DocumentManager();
			
			
			ok(doc_manager, "created a document manager");
			var doc = doc_manager.create({
				name:"william",
				company:"browns"
			});
			ok( (doc.data._id == undefined), "created a document but not saved yet");
			var saved_doc = function(resp,doc){
				ok( (doc.data._id != undefined), "created a document and saved yet");
				var got_doc = function(doc){
					ok( (doc.data._id != "undefined"), "retrived doc.");
					doc.del();
					start();
				};
				doc_manager.get(doc.data._id, got_doc);
			};
			doc.save(saved_doc);
		};
		bh.loader.require("document", test_docs);
		stop();
	});
	
	test("Test Load Modules: No Modules", function() {
		expect( 1 );
		var local_bh_copy = window.bh;
		bh.load_settings();
		bh.detect_browser();
		bh.settings.modules = [];
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
		bh.settings.modules = [];
		bh.settings.modules.push("example");
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
		bh.settings.modules = [];
		bh.settings.modules.push("example");
		bh.settings.modules.push("testrunner");
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
	


	


	
	

	
	
	
	

});