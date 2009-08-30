/* I want to define a basic data model, that can save,validate,display its self. */

(function(bh){

	
	bh.document = {};
	
	console.log("app name ", bh.settings);
	bh.document.db = jQuery.couch.db(bh.app_name_dep("base_app_name"));
	
	bh.document.Field = function(){
		
		/*
		this.validationError = function(field, message){
			return new Error("Field " + field.type + " didn't validate: ");
		};
		*/
		this.options = {
			optional: True,
			unique: False
		};
		/*
		this.validate = function(){
			if(!this.options.optional){
				if(!this.value){
					throw this.validationError(this,"missing value, field not optional");
				}
			}
			
			return true;
		};
		*/
		this.value = "";
		this.type  = undefined;
	};
	
	bh.document.fields = {};
	
	bh.document.fields.StringField = function(options){
		this.options = {
			max_length:0
		};
		this.options = jQuery.extend(this.prototype.options, this.options,options);

		/*
		this.validate = function(){
			this.prototype.validate();
			if(this.options.max_length && this.value.length > this.options.max_length){
				throw this.validationError("longer then max_length of field");
			}
			
			return true;
		};
		*/
	};
	
	bh.document.fields.StringField.prototype = bh.document.Field;
	
	bh.document.Document = function(data){
		this.data = {};
		this.data = data;
	};
		/*
		this.validate = function(){
			//
		};
		*/
		
		bh.document.Document.prototype.save = function(callback){
			var success = function(resp,doc){
				this.data = doc;
				callback(resp,this);
			};
	
			var options = {
				success:success
			};
	
			bh.document.db.saveDoc(this.data, options);
		};
		
		
		bh.document.Document.prototype.del = function(){
			if(this.data._id){
				bh.document.db.removeDoc(this.data);
			}
			delete this;
		};

	
	bh.document.Manager = function(fields){
		this.fields = fields;
		
	};
	bh.document.Manager.prototype.get = function(id,callback){
		// Get 
		var success = function(doc){
			var new_doc = new bh.document.Document(doc);
			callback(new_doc);
		};
		var options = {
			success:success
		};
		bh.document.db.openDoc(id,options);

	};
	
	bh.document.Manager.prototype.del = function(doc,callback){
		bh.document.db.removeDoc(doc);
	};
	
	bh.document.Manager.prototype.create = function(data){
		var document = new bh.document.Document(data);
		return document;
	};

	
	

	
	/*
	
	bh.document.blessModel = function(modelFunction){
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
				del: function(callback){
					if(!this.data._id){
						callback();
					}
					var options = {
						success: callback
					};
					bh.document.db.removeDoc(this.data, options);
				},
				fields: this.fields
			};
			
			
			
			return document_instance;
		};
		
		modelFunction.save = function(object, callback){
			// Send to db
			var options = {
				success: callback
			};
			bh.document.db.saveDoc(object,options);
		};
		
		return modelFunction;
	};
	
	bh.document.widgets = {};
	
	bh.document.widgets.textbox = function(ref,class_names,id){
		var template = "<input id=\"{id}\" class=\"{class}\">{data}</input>";
		
		
	};
	
	bh.document.widgets.span = function(ref,class_names,id){
		var template = "<span>{data}</span>";
	};
	
	
	bh.document.fields = {};
	bh.document.fields.String = function(conf){
		// Defaults
		this.optional = true;		
		this.validate = function(value){
			if(!this.optional && value === ""){
				throw "Error this is not an optional field";
				return false;
			}
			
			return true;
		};
		this.editWidget =  bh.document.widgets.textbox;
		this.displayWidget = bh.document.widgets.span;
		var self = this;
		self = jQuery.extend(self,conf);
		return self;
	};
	*/
})(window.bh);