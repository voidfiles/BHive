/* I want to define a basic data model, that can save,validate,display its self. */

(function(){

	var bh = window.bh;
	
	bh.model = {};
	
	
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
			bh.logger("what are the fields", this.fields);
			for(var b in this.fields){
				field = this.fields[b];
				if(!field.validate(object[b])){
					bh.logger("invalid");
					return false;
				}
			}
			
			return true;
		};
		
		modelFunction.save = function(object){
			// Send to db
			bh.logger("saving", object);
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
		this.optional = conf.optional || true;
		
		this.validate = function(value){
			bh.logger("validating value:",value);
			if(!this.optional && value === ""){
				throw "Error this is not an optional field";
				return false;
			}
			
			return true;
		};
	};
	
	bh.model.types = {};
	bh.model.types.string = {
		name:"String data type",
		validator:function(element){
			return true;
		},
		entryWidget:bh.model.widgets.textbox,
		displayWidget:bh.model.widgets.span
	};
	

	
	/*
	model = {
		fields: {
			first_name:bh.model.types.string,
			last_name:bh.model.types.string
		}
	}
	*/
})();