(function(bh){

	bh.loadModules = function(callback){
		var prev = "";
		var module_name = "";
		if(bh.settings.modules.length > 0){
			for(module_name in bh.settings.modules){
				module_name = bh.settings.modules[module_name];
				js = bh.app_name_dep("couch_design_url")+"modules/" + module_name + "/module.js";
				bh.settings.file_groups[module_name] = {
					js:[js],
					css:[]
				};
				if(prev){
					bh.settings.file_groups[module_name]["deps"] = [prev];
				}
				prev = module_name;
			}

			bh.loader.require(module_name, callback);
		} else {
			callback();
		}
	};
})(window.bh);

// Inspired by base2 and Prototype
// Taken from http://ejohn.org/blog/simple-javascript-inheritance/
(function(){
     var initializing = false;

     var fnTest = new RegExp(/xyz/).test(function(){xyz;}) ? new RegExp(/\b_super\b/) : new RegExp(/.*/);

     // The base Class implementation (does nothing)
     this.Class = function(){};
 
     // Create a new Class that inherits from this class
     Class.extend = function(prop) {
          var _super = this.prototype;
      
          // Instantiate a base class (but only create the instance,
          // don't run the init constructor)
          initializing = true;
          var prototype = new this();
          initializing = false;
      
          // Copy the properties over onto the new prototype
          for (var name in prop) {
               // Check if we're overwriting an existing function
               prototype[name] = typeof prop[name] == "function" &&
                    typeof _super[name] == "function" && fnTest.test(prop[name]) ?
                    (function(name, fn){
                         return function() {
                              var tmp = this._super;
                          
                              // Add a new ._super() method that is the same method
                              // but on the super-class
                              this._super = _super[name];
                          
                              // The method only need to be bound temporarily, so we
                              // remove it when we're done executing
                              var ret = fn.apply(this, arguments);                
                              this._super = tmp;
                          
                              return ret;
                         };
                    })(name, prop[name]) :
                    prop[name];
          }
      
          // The dummy class constructor
          function Class() {
               // All construction is actually done in the init method
               if ( !initializing && this.init )
                    this.init.apply(this, arguments);
          }
      
          // Populate our constructed prototype object
          Class.prototype = prototype;
      
          // Enforce the constructor to be what we expect
          Class.constructor = Class;

          // And make this class extendable
          Class.extend = arguments.callee;
      
          return Class;
     };
})();
