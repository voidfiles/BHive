(function(){
	var bh = window.bh,DUMP='dump', SPACE=' ', LBRACE='{', RBRACE='}';
	
	bh.template = {};
	bh._templates = {};
	bh.template.storeTemplate = function(name,data){
		bh._templates[name] = data;
	};
	bh.template.render = function(conf){
		// conf = {data:Object,tempalte_name:String,template:String}
		if(conf.template_name){
			var template = bh.template.getTemplate(conf.template_name);
		} else {
			var template = conf.template;
		}
		
		var handler = 0;
		
		if(conf.handler){
			handler = conf.handler;
		}
		
		return bh.template.substitute(template,conf.data,handler);
	};
	bh.template.substitute = function (s, o, f, ldelim, rdelim) {
		// Stolen from the YUI Library
		// in YUI 3 called substitue
        var i, j, k, key, v, meta, saved=[], token, dump;
        ldelim = ldelim || LBRACE;
        rdelim = rdelim || RBRACE;

        for (;;) {
            i = s.lastIndexOf(ldelim);
            if (i < 0) {
                break;
            }
            j = s.indexOf(rdelim, i);
            if (i + 1 >= j) {
                break;
            }

            //Extract key and meta info 
            token = s.substring(i + 1, j);
            key = token;
            meta = null;
            k = key.indexOf(SPACE);
            if (k > -1) {
                meta = key.substring(k + 1);
                key = key.substring(0, k);
            }

            // lookup the value
            v = o[key];

            // if a substitution function was provided, execute it
            if (f) {
                v = f(key, v, meta);
            }

			/*
            if (isObject(v)) {
                if (!Y.dump) {
                    v = v.toString();
                } else {
                    if (jQuery.isArray(v)) {
                        v = Y.dump(v, parseInt(meta, 10));
                    } else {
                        meta = meta || "";

                        // look for the keyword 'dump', if found force obj dump
                        dump = meta.indexOf(DUMP);
                        if (dump > -1) {
                            meta = meta.substring(4);
                        }

                        // use the toString if it is not the Object toString 
                        // and the 'dump' meta info was not found
                        if (v.toString===Object.prototype.toString||dump>-1) {
                            v = Y.dump(v, parseInt(meta, 10));
                        } else {
                            v = v.toString();
                        }
                    }
                }
            } else if (!L.isString(v) && !L.isNumber(v)) {
                // This {block} has no replace string. Save it for later.
                v = "~-" + saved.length + "-~";
                saved[saved.length] = token;

                // break;
            }
			*/
            s = s.substring(0, i) + v + s.substring(j + 1);

        }

        // restore saved {block}s
        for (i=saved.length-1; i>=0; i=i-1) {
            s = s.replace(new RegExp("~-" + i + "-~"), ldelim  + saved[i] + rdelim, "g");
        }

        return s;

    };

	window.bh = bh;
})();