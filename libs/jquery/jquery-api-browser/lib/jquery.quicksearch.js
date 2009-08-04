/*
 * quicksearch 1.0 - jQuery plugin to filter elements like lists or tables
 *
 * Copyright (c) 2007 Rik Lomas, J�rn Zaefferer
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Revision: $Id: jquery.quicksearch.js 1219 2007-01-29 20:45:54Z joern $
 *
 */
 
(function($) {

$.fn.quicksearch = function (options) {
	
	this.timeout = null;
	
	this.settings = $.extend({
		position: 'prepend',
		attached: 'body',
		formId: 'quicksearch',
		labelText: 'Quick Search',
		labelClass: 'qs_label',
		inputText: null,
		inputClass: 'qs_input',
		loaderId: 'loader',
		loaderClass: 'loader',
		loaderImg: null,
		loaderText: 'Loading...',
		stripeRowClass: null,
		hideElement: null,
		delay: 250,
		focusOnLoad: false,
		randomElement: 'qs'+Math.floor(Math.random()*1000000)
	}, options);
	
	var el 		= this;
		
	var form1 	= new Form(this.settings);
	var key1	= new Key(this.settings);
	var loader	= new Loader(this.settings);
	var stripes = new Stripe(this.settings.stripeRowClass);	
	
	form1.initialize();
	loader.setTo('hide');	
	
	if(this.settings.stripeRowClass != null) {
		$(el).each(function () {			
			if(el.settings.hideElement == "grandparent") {
				stripes.go(this.parentNode.parentNode);
			} else if (el.settings.hideElement == "parent") {
				stripes.go(this.parentNode);
			} else {
				stripes.go(this);
			}
		});
		stripes.reset();
	}		
	
	$('form.quicksearch').submit( function () { return false; });
	
	$('input[@rel="'+this.settings.randomElement+'"]').keydown(function(e) {
		switch(e.keyCode) {
			case 9: 
			case 13:
			case 38: 
			case 40:
				e.preventDefault();
				break;
			default:
				clearTimeout(this.timeout);				
			
				this.timeout = setTimeout(function () {
						loader.setTo('show');
						setTimeout( function () {
						
							key1.setKey();
							
							$(el).each( function () {
							
								if(el.settings.hideElement == "grandparent") {
									var hide = $(this).parent().parent();
								} else if (el.settings.hideElement == "parent") {
									var hide = $(this).parent();
								} else {
									var hide = $(this)
								}
							
								$(hide)[ key1.test(this) ? "show" : "hide" ]();
								
								if(el.settings.stripeRowClass != null) {									
									if(el.settings.hideElement == "grandparent") {
										stripes.go(this.parentNode.parentNode);
									} else if (el.settings.hideElement == "parent") {
										stripes.go(this.parentNode);
									} else {
										stripes.go(this);
									}
								}				
							});						
							stripes.reset();
						}, el.settings.delay);						
						setTimeout( function () { 
							loader.setTo('hide');
						}, el.settings.delay);
				}, el.settings.delay);
				break;
		}
	});
};
	
function Key(set) {
	this.key = "";
	this.settings = set;
	this.getKey = function ()  {
		return this.key;
	};
	this.setKey = function () {
		var input = $('input[@rel="'+this.settings.randomElement+'"]').val();
		var string = input.replace(/\s{2,}/g, " ").toLowerCase();
		var arr = string.split(" ");
		for(var i in arr) {
			var regexp = new RegExp(/([^A-Za-z0-9])/gi);
			if(arr[i] == "") {
				arr.splice(i,1);
			}
		}
		this.key = arr;
	};
	this.test = function (el) {
		if( this.getKey() == '' ) {
			return true;
		} else {			
			var searchStrings = this.getKey();
			var text = $(el).html().replace(/<\/?[^>]+>/g, '').toLowerCase();	
			for (var i = 0; i < searchStrings.length; i++) {
				var test = text.indexOf(searchStrings[i]);	
				if (test == -1) {	
					return false;
				}
			}			
			return true;
		}
	}	
}
	
function Form(set) {	
	this.settings = set;
	
	this.initialize = function () {
		this.placeForm();
		if(this.settings.focusOnLoad) {
			this.focusOnLoad();
		}
		if(this.settings.inputText != "" && this.settings.inputText != null) {
			this.toggleText();
		}

	};
	this.placeForm = function () {
		var formPosition 	= this.settings.position;
		var formAttached 	= this.settings.attached;
					
		if(formPosition == 'before') {
			$(formAttached).before( makeForm(this.settings) );
		} else if(formPosition == 'prepend') {
			$(formAttached).prepend( makeForm(this.settings) );
		} else if(formPosition == 'append') {
			$(formAttached).append( makeForm(this.settings) );
		} else {
			$(formAttached).after( makeForm(this.settings) );
		}
	};
	this.focusOnLoad = function () {
		$('input[@rel="'+this.settings.randomElement+'"]').get(0).focus();
	};
	this.toggleText = function () {
		var el = this;
		$('input[@rel="'+this.settings.randomElement+'"]').focus(function () {
			if($(this).val() == el.settings.inputText) {
				$(this).val('');
			}
		});
		$('input[@rel="'+this.settings.randomElement+'"]').blur(function () {
			if($(this).val() == "") {
				$(this).val(el.settings.inputText);
			}
		})
	};	
};

function Loader(set) {
	this.settings = set;
	this.setTo = function (to) {
		if(this.settings.loaderId) {
			if(to == 'hide') {
				$('input[@rel="'+this.settings.randomElement+'"]').parent().find('.loader').hide();
			} else {
				$('input[@rel="'+this.settings.randomElement+'"]').parent().find('.loader').show();
			}			
		}
	};
}

function Stripe(set) {
	this.i = 0;
	this.set = set;
	this.go = function (el) {
		this.removeClasses(el);
		if(el.getAttribute('style') != "display: none;") {				
			$(el).addClass(this.set[this.i%this.set.length]);
			this.i += 1;
		}
	}; 
	this.removeClasses = function (el) {
		for(var j = 0; j < this.set.length; j++) {
			if(this.i%this.set.length != j) {
				$(el).removeClass(this.set[j]);
			}
		}
	};
	this.reset = function () {
		this.i = 0;
	};
}

function makeForm(set) {
	this.settings = set;
	this.mform = function () {
		return '<form action="#" ' + 
						'id="'+ this.settings.formId + '" ' +
						'class="quicksearch">' +
						this.mlabel() +
						this.minput() +
						this.mloader() +		
						'</form>';
	};
	this.mlabel = function () {
		if(!this.isEmpty(this.settings.labelText)) {
			return '<label for="' + this.settings.inputId + '" '+
						'class="' + this.settings.labelClass + '">'
						+ this.settings.labelText
						+ '</label> ';	
		}
		return '';
	};
	this.minput = function () {			
		var val = (!this.isEmpty(this.settings.inputText)) ? this.settings.inputText : "";
		return '<input type="text" ' +
					'value="' + val + '" ' + 
					'rel="' + this.settings.randomElement  + '" ' +
					'class="' + this.settings.inputClass + '" ' +
					'/> ';	
	};
	this.mloader = function () {
		if(!this.isEmpty(this.settings.loaderImg)) {
			return '<img src="' + this.settings.loaderImg + '" alt="Loading" id="' + this.settings.loaderId + '" class="' + this.settings.loaderClass + '" />';
		} else {
			return '<span id="' + this.settings.loaderId + '" class="' + this.settings.loaderClass + '">' + this.settings.loaderText + '</span>';
		}
	};
	this.isEmpty = function (input) {
		return (input == null || input == undefined || input == '' || input == 0) ? true: false;
	};
	return this.mform();
}

})(jQuery);