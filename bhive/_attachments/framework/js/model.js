/* I want to define a basic data model, that can save,validate,display its self. */

(function(){

	var bh = window.bh;
	
	bh.model = {};
	
	bh.model.db = jQuery.couch.db(BH_APP_NAME);
	bh.model.blessModel = function(modelFunction){
		function ObjectManager(){
			this.name = "model";
		};
		modelFunction.objects = new ObjectManager();
		modelFunction.objects.all = function(){
			// Get a list of all data. 
			// Preferably lazy 
			// self caching mayby
			//return function(){
			//	
			//	return 
			//}();
			return "all objects";
		};
		
		var save_function = function(object){
			this.save(object);
		};
		
		modelFunction.create = function(object){

			
			var document_instance = {
				data: object,
				save: function(callback){
					var callback = this.afterSave(callback);
					modelFunction.save(this.data,callback);
				},
				afterSave:function(callback){
					return function(resp,doc){
						this.data = doc;
						callback(resp,doc);
					};
				},
				validate:function(){
					for(var b in this.fields){
						field = this.fields[b];
						if(!field.validate(this.data[b])){
							return false;
						}
					}
					
					return true;
				},
				"delete": function(callback){
					if(!this.data._id){
						callback();
					}
					var options = {
						success: callback
					};
					bh.model.db.removeDoc(this.data, options);

				fields: this.fields
			};
			
			
			
			return document_instance;
		};
		
		modelFunction.save = function(object, callback){
			// Send to db
			var options = {
				success: callback
			};
			bh.model.db.saveDoc(object,options);
		};
		
		return modelFunction;
	};
	
	bh.model.widgets = {};
	
	bh.model.widgets.textbox = function(ref,class_names,id){
		var template = "<input id=\"{id}\" class=\"{class}\">{data}</input>";
		
		
	};
	
	bh.model.widgets.span = function(ref,class_names,id){
		var template = "<span>{data}</span>";
	};
	
	
	bh.model.fields = {};
	bh.model.fields.String = function(conf){
		// Defaults
		this.optional = true;		
		this.validate = function(value){
			if(!this.optional && value === ""){
				throw "Error this is not an optional field";
				return false;
			}
			
			return true;
		};
		this.editWidget =  bh.model.widgets.textbox;
		this.displayWidget = bh.model.widgets.span;
		var self = this;
		self = jQuery.extend(self,conf);
		return self;
	};
})();