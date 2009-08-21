/*  
===============================================================================
Chili is the jQuery code highlighter plugin
...............................................................................
LICENSE: http://www.opensource.org/licenses/mit-license.php
WEBSITE: http://noteslog.com/chili/

											   Copyright 2007 / Andrea Ercolino
===============================================================================
*/


( function($) {

ChiliBook = { //implied global

	  version:            "1.9" // 2007-09-24

	, automatic:          true
	, automaticSelector:  "code"

	, codeLanguage:       function( el ) {
		var recipeName = $( el ).attr( "class" );
		return recipeName ? recipeName : '';
	}

	, metadataSelector:   "object.chili"             // use an empty string for not executing

	, recipeLoading:      true
	, recipeFolder:       "" // used like: recipeFolder + recipeName + '.js'
	, stylesheetLoading:  true
	, stylesheetFolder:   "" // used like: stylesheetFolder + recipeName + '.css'

	, defaultReplacement: '<span class="$0">$$</span>'

	, replaceSpace:       "&#160;"                   // use an empty string for not replacing
	, replaceTab:         "&#160;&#160;&#160;&#160;" // use an empty string for not replacing
	, replaceNewLine:     "&#160;<br/>"              // use an empty string for not replacing

	, recipes:            {} //repository
	, queue:              {} //register

	//fix for IE: copy of PREformatted text strips off all html, losing newlines
	, preFixCopy:         document.selection && document.selection.createRange
	, preContent:         ""
	, preElement:         null
};


$.metaobjects = function( options ) { 

	options = $.extend( { 
		  context:  document 
		, clean:    true 
		, selector: 'object.metaobject' 
	}, options ); 

	function jsValue( value ) { 
		eval( 'value = ' + value + ";" ); 
		return value; 
	} 

	return $( options.selector, options.context ) 
	.each( function() { 

		var settings = { target: this.parentNode }; 
		$( '> param[@name=metaparam]', this ) 
		.each( function() {  
			$.extend( settings, jsValue( this.value ) ); 
		} ); 

		$( '> param', this ) 
		.not( '[@name=metaparam]' ) 
		.each( function() { 
			var name = this.name, value = jsValue( this.value ); 
			$( settings.target ) 
			.each( function() { 
				this[ name ] = value; 
			} ); 
		} ); 

		if( options.clean ) { 
			$( this ).remove(); 
		} 
	} ); 
}; 

$.fn.chili = function( options ) {
	var book = $.extend( {}, ChiliBook, options || {} );

	function cook( ingredients, recipe ) {

		function prepareStep( stepName, step ) {
			var exp = ( typeof step.exp == "string" ) ? step.exp : step.exp.source;
			steps.push( {
				stepName: stepName
				, exp: "(" + exp + ")"
				, length: 1                         // add 1 to account for the newly added parentheses
					+ (exp                          // count number of submatches in here
						.replace( /\\./g, "%" )     // disable any escaped character
						.replace( /\[.*?\]/g, "%" ) // disable any character class
						.match( /\((?!\?)/g )       // match any open parenthesis, not followed by a ?
					|| []                           // make sure it is an empty array if there are no matches
					).length                        // get the number of matches
				, replacement: (step.replacement) ? step.replacement : book.defaultReplacement 
			} );
		} // function prepareStep( stepName, step )
	
		function knowHow() {
			var prevLength = 1;
			var exps = [];
			for (var i = 0; i < steps.length; i++) {
				var exp = steps[ i ].exp;
				// adjust backreferences
				exp = exp.replace( /\\\\|\\(\d+)/g, function( m, aNum ) {
					return !aNum ? m : "\\" + ( prevLength + 1 + parseInt( aNum, 10 ) );
				} );
				exps.push( exp );
				prevLength += steps[ i ].length;
			}
			var prolog = '((?:\\s|\\S)*?)';
			var epilog = '((?:\\s|\\S)+)';
			var source = '(?:' + exps.join( "|" ) + ')';
			source = prolog + source + '|' + epilog;
			return new RegExp( source, (recipe.ignoreCase) ? "gi" : "g" );
		} // function knowHow()

		function escapeHTML( str ) {
			return str.replace( /&/g, "&amp;" ).replace( /</g, "&lt;" );
		} // function escapeHTML( str )

		function replaceSpaces( str ) {
			return str.replace( / +/g, function( spaces ) {
				return spaces.replace( / /g, replaceSpace );
			} );
		} // function replaceSpaces( str )

		function filter( str ) {
			str = escapeHTML( str );
			if( replaceSpace ) {
				str = replaceSpaces( str );
			}
			return str;
		} // function filter( str )

		function chef() {
			var i = 0;  // iterate steps
			var j = 2;	// iterate chef's arguments
			var prolog = arguments[ 1 ];
			var epilog = arguments[ arguments.length - 3 ];
			if (! epilog) {
				var step;
				while( step = steps[ i++ ] ) {
					var aux = arguments; // this unmasks chef's arguments inside the next function
					if( aux[ j ] ) {
						var pattern = /(\\\$)|(?:\$\$)|(?:\$(\d+))/g;
						var replacement = step.replacement
							.replace( pattern, function( m, escaped, K ) {
								var bit = '';
								if( escaped ) {       /* \$ */ 
									return "$";
								}
								else if( !K ) {       /* $$ */ 
									return filter( aux[ j ] );
								}
								else if( K == "0" ) { /* $0 */ 
									return step.stepName;
								}
								else {                /* $K */
									return filter( aux[ j + parseInt( K, 10 ) ] );
								}
							} );

						return filter( prolog ) + replacement;
					} 
					else {
						j+= step.length;
					}
				}
			}
			else {
				return filter( epilog );
			}
		} // function chef()

		var replaceSpace = book.replaceSpace;
		var steps = [];
		for( var stepName in recipe.steps ) {
			prepareStep( stepName, recipe.steps[ stepName ] );
		}

		var perfect = ingredients.replace( knowHow(), chef );
		return perfect;

	} // function cook( ingredients, recipe )

	function checkCSS( stylesheetPath ) {
		if( ! book.queue[ stylesheetPath ] ) {
			var e = document.createElement( "link" );
			e.rel = "stylesheet";
			e.type = "text/css";
			e.href = stylesheetPath;
			document.getElementsByTagName( "head" )[0].appendChild( e );

			book.queue[ stylesheetPath ] = true;
		}
	} // function checkCSS( recipeName )

	function makeDish( el, recipePath ) {
		var recipe = book.recipes[ recipePath ];
		if( ! recipe ) {
			return;
		}
		$el = $( el );
		var ingredients = $el.text();
		if( ! ingredients ) {
			return;
		}
		// hack for IE: \r is used instead of \n
		ingredients = ingredients.replace(/\r\n?/g, "\n");

		var dish = cook( ingredients, recipe ); // all happens here
	
		if( book.replaceTab ) {
			dish = dish.replace( /\t/g, book.replaceTab );
		}
		if( book.replaceNewLine ) {
			dish = dish.replace( /\n/g, book.replaceNewLine );
		}

		el.innerHTML = dish; //much faster than $el.html( dish );

		if( ChiliBook.preFixCopy ) {
			$el
			.parents()
			.filter( "pre" )
			.bind( "mousedown", function() {
				ChiliBook.preElement = this;
			} )
			.bind( "mouseup", function() {
				if( ChiliBook.preElement == this ) {
					ChiliBook.preContent = document.selection.createRange().htmlText;
				}
			} )
			;
		}
	} // function makeDish( el )

	function getPath( recipeName, options ) {
		var settingsDef = {
			  recipeFolder:     book.recipeFolder
			, recipeFile:       recipeName + ".js"
			, stylesheetFolder: book.stylesheetFolder
			, stylesheetFile:   recipeName + ".css"
		};
		var settings;
		if( options && typeof options == "object" ) {
			settings = $.extend( settingsDef, options );
		}
		else {
			settings = settingsDef;
		}
		return {
			  recipe    : settings.recipeFolder     + settings.recipeFile
			, stylesheet: settings.stylesheetFolder + settings.stylesheetFile
		};
	} //function getPath( recipeName, options )

//-----------------------------------------------------------------------------
// initializations
	if( book.metadataSelector ) {
		$.metaobjects( { context: this, selector: book.metadataSelector } );
	}

//-----------------------------------------------------------------------------
// the coloring starts here
	this
	.each( function() {
		var el = this;
		var recipeName = book.codeLanguage( el );
		if( '' != recipeName ) {
			var path = getPath( recipeName, el.chili );
			if( book.recipeLoading || el.chili ) {
				/* dynamic setups come here */
				if( ! book.queue[ path.recipe ] ) {
					/* this is a new recipe to download */
					try {
						book.queue[ path.recipe ] = [ el ];
						$.getJSON( path.recipe, function( recipeLoaded ) {
							recipeLoaded.path = path.recipe;
							book.recipes[ path.recipe ] = recipeLoaded;
							if( book.stylesheetLoading ) {
								checkCSS( path.stylesheet );
							}
							var q = book.queue[ path.recipe ];
							for( var i = 0, iTop = q.length; i < iTop; i++ ) {
								makeDish( q[ i ], path.recipe );
							}
						} );
					}
					catch( recipeNotAvailable ) {
						alert( "the recipe for '" + recipeName + "' was not found in '" + path.recipe + "'" );
					}
				}
				else {
					/* not a new recipe, so just enqueue this element */
					book.queue[ path.recipe ].push( el );
				}
				/* a recipe could have been already downloaded */
				makeDish( el, path.recipe ); 
			}
			else {
				/* static setups come here */
				makeDish( el, path.recipe );
			}
		}
	} );

	return this;
//-----------------------------------------------------------------------------
};

//main
$( function() {

	if( ChiliBook.automatic ) {
		if( ChiliBook.elementPath ) {
			//preserve backward compatibility
			ChiliBook.automaticSelector = ChiliBook.elementPath;
			if( ChiliBook.elementClass ) {
				ChiliBook.codeLanguage = function ( el ) {
					var selectClass = new RegExp( "\\b" + ChiliBook.elementClass + "\\b", "gi" );
					var elClass = $( el ).attr( "class" );
					if( ! elClass ) { 
						return ''; 
					}
					var recipeName = $.trim( elClass.replace( selectClass, "" ) );
					return recipeName;
				};
			}
		}

		$( ChiliBook.automaticSelector ).chili();
	}

	if( ChiliBook.preFixCopy ) {
		function preformatted( text ) {
			if( '' == text ) { 
				return ""; 
			}
			do { 
				var newline_flag = (new Date()).valueOf(); 
			}
			while( text.indexOf( newline_flag ) > -1 );
			text = text.replace( /\<br[^>]*?\>/ig, newline_flag );
			var el = document.createElement( '<pre>' );
			el.innerHTML = text;
			text = el.innerText.replace( new RegExp( newline_flag, "g" ), '\r\n' );
			return text;
		}

		$( "body" )
		.bind( "copy", function() {
			if( '' != ChiliBook.preContent ) {
				window.clipboardData.setData( 'Text', preformatted( ChiliBook.preContent ) );
				event.returnValue = false;
			}
		} )
		.bind( "mousedown", function() {
			ChiliBook.preContent = "";
		} )
		.bind( "mouseup", function() {
			ChiliBook.preElement = null;
		} )
		;
	}

} );

} ) ( jQuery );

ChiliBook.recipeLoading = false;


ChiliBook.recipes[ "html.js" ] = 
{
    steps: {
          mlcom : { exp: /\<!--(?:\w|\W)*?--\>/ }
        , tag   : { exp: /(?:\<\!?[\w:]+)|(?:\>)|(?:\<\/[\w:]+\>)|(?:\/\>)/ }
		, php   : { exp: /(?:\<\?php\s)|(?:\<\?)|(?:\?\>)/ }
        , aname : { exp: /\s+?[\w-]+:?\w+(?=\s*=)/ }
        , avalue: { exp: /(=\s*)(([\"\'])(?:(?:[^\3\\]*?(?:\3\3|\\.))*?[^\3\\]*?)\3)/
			, replacement: '$1<span class="$0">$2</span>' }
        , entity: { exp: /&[\w#]+?;/ }
    }
};

ChiliBook.recipes[ "javascript.js" ] = 
{
	steps: {
		  mlcom   : { exp: /\/\*[^*]*\*+(?:[^\/][^*]*\*+)*\// }
		, com     : { exp: /\/\/.*/ }
		, regexp  : { exp: /\/[^\/\\\n]*(?:\\.[^\/\\\n]*)*\/[gim]*/ }
		, string  : { exp: /(?:\'[^\'\\\n]*(?:\\.[^\'\\\n]*)*\')|(?:\"[^\"\\\n]*(?:\\.[^\"\\\n]*)*\")/ }
		, numbers : { exp: /\b[+-]?(?:\d*\.?\d+|\d+\.?\d*)(?:[eE][+-]?\d+)?\b/ }
		, keywords: { exp: /\b(arguments|break|case|catch|continue|default|delete|do|else|false|for|function|if|in|instanceof|new|null|return|switch|this|true|try|typeof|var|void|while|with)\b/ }
		, global  : { exp: /\b(toString|valueOf|window|self|element|prototype|constructor|document|escape|unescape|parseInt|parseFloat|setTimeout|clearTimeout|setInterval|clearInterval|NaN|isNaN|Infinity)\b/ }
	}
};
