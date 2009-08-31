/* I want to define a basic data model, that can save,validate,display its self. */

(function(bh){

	
	bh.document = {};
	
	bh.document.db = jQuery.couch.db(bh.app_name_dep("base_app_name"));
	
	
	bh.document.Field = Class.extend({
		
		/*
		this.validationError = function(field, message){
			return new Error("Field " + field.type + " didn't validate: ");
		};
		*/
		init: function(d_options,options){
			var default_options = {
				optional: true,
				unique: false
			};
			
			this.options = jQuery.extend(default_options,d_options,options);
			this.value = "";
			this.type  = undefined;
		}
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

	});
	
	bh.document.fields = {};
	
	
	bh.document.fields.StringField = bh.document.Field.extend({
		
		init: function(options){ 
			
			var default_options = {
				max_length: 0
			};
			
			this._super(default_options, options);
		}
		/*
		this.validate = function(){
			this.prototype.validate();
			if(this.options.max_length && this.value.length > this.options.max_length){
				throw this.validationError("longer then max_length of field");
			}
			
			return true;
		};
		*/
	});

	
	bh.document.Document = Class.extend({
		
		init: function(data){
			this.data = data;
		},
		
		save:function(callback){
			var success = function(resp,doc){
				this.data = doc;
				callback(resp,this);
			};
	
			var options = {
				success:success
			};
	
			bh.document.db.saveDoc(this.data, options);
		},
		
		del: function(){
			if(this.data._id){
				bh.document.db.removeDoc(this.data);
			}
			delete this;
		}

		

		/*
		this.validate = function(){
			//
		};
		*/
	});



	
	bh.document.Manager = Class.extend({
		
		init: function(fields){
			this.fields = fields;
		},
		get: function(id,callback){
			// Get 
			var success = function(doc){
				var new_doc = new bh.document.Document(doc);
				callback(new_doc);
			};
			var options = {
				success:success
			};
			bh.document.db.openDoc(id,options);

		},
		del: function(doc,callback){
			bh.document.db.removeDoc(doc);
		},
		create: function(data){
			var document = new bh.document.Document(data);
			return document;
		}
		
	});


})(window.bh);