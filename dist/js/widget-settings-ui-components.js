/*  Copyright © 2014 Rise Vision Incorporated.
 *  Use of this software is governed by the GPLv3 license
 *  (reproduced in the LICENSE file).
 */
;(function ($, window, document, TEMPLATES, undefined) {
  "use strict";

  var _pluginName = "alignment";

  function Plugin(element, options) {
    var $element = $(element);
    var $btnAlignment = null;

    options = $.extend({}, { "align": "left" }, options);

    /*
     *  Private Methods
     */
    function _init() {
      // Get the HTML markup from the template.
      $element.append(TEMPLATES["alignment.html"]);
      $btnAlignment = $element.find(".btn-alignment");

      setAlignment(options.align);

      $element.find(".dropdown-menu button").on("click", function() {
        setAlignment($(this).data("wysihtml5-command-value"));
      });
    }

    /*
     *  Public Methods
     */
    function getAlignment() {
     return $btnAlignment.data("wysihtml5-command-value");
    }

    function setAlignment(alignment) {
      var $primaryIcon = $element.find(".btn-alignment .glyphicon");
      var currentClass = $primaryIcon.attr("class").match(/glyphicon-align-[a-z]+/g);
      var newClass = "glyphicon-align-" + alignment;

      // Remove current alignment icon.
      if (currentClass && currentClass.length > 0) {
        $primaryIcon.removeClass(currentClass[0]);
      }

      // Add new alignment icon.
      $primaryIcon.addClass(newClass);
      $btnAlignment.data("wysihtml5-command-value", alignment);

      $element.trigger("alignmentChanged", alignment);
    }

    _init();

    return {
      getAlignment: getAlignment,
      setAlignment: setAlignment
    };
  }

  /*
   *  A lightweight plugin wrapper around the constructor that prevents
   *  multiple instantiations.
   */
  $.fn.alignment = function(options) {
    return this.each(function() {
      if (!$.data(this, "plugin_" + _pluginName)) {
        $.data(this, "plugin_" + _pluginName, new Plugin(this, options));
      }
    });
  };
})(jQuery, window, document, TEMPLATES);

if(typeof TEMPLATES === 'undefined') {var TEMPLATES = {};}
TEMPLATES['alignment.html'] = "<div class=\"btn-group alignment\">\n" +
    "  <button type=\"button\" class=\"btn btn-default btn-alignment dropdown-toggle\"\n" +
    "    data-toggle=\"dropdown\" data-wysihtml5-command-value=\"left\">\n" +
    "    <i class=\"glyphicon glyphicon-align-left\"></i>\n" +
    "    <span class=\"caret\"></span>\n" +
    "  </button>\n" +
    "  <div class=\"dropdown-menu\" role=\"menu\">\n" +
    "    <div class=\"btn-group\">\n" +
    "      <button type=\"button\" class=\"btn btn-default btn-sm\" data-wysihtml5-command=\"align\"\n" +
    "        data-wysihtml5-command-value=\"left\" tabindex=\"-1\">\n" +
    "        <i class=\"glyphicon glyphicon-align-left\"></i>\n" +
    "      </button>\n" +
    "      <button type=\"button\" class=\"btn btn-default btn-sm\" data-wysihtml5-command=\"align\"\n" +
    "        data-wysihtml5-command-value=\"center\" tabindex=\"-1\">\n" +
    "        <i class=\"glyphicon glyphicon-align-center\"></i>\n" +
    "      </button>\n" +
    "      <button type=\"button\" class=\"btn btn-default btn-sm\" data-wysihtml5-command=\"align\"\n" +
    "        data-wysihtml5-command-value=\"right\" tabindex=\"-1\">\n" +
    "        <i class=\"glyphicon glyphicon-align-right\"></i>\n" +
    "      </button>\n" +
    "      <button type=\"button\" class=\"btn btn-default btn-sm\" data-wysihtml5-command=\"align\"\n" +
    "        data-wysihtml5-command-value=\"justify\" tabindex=\"-1\">\n" +
    "        <i class=\"glyphicon glyphicon-align-justify\"></i>\n" +
    "      </button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    ""; 
if (typeof WIDGET_SETTINGS_UI_CONFIG === "undefined") {
  var WIDGET_SETTINGS_UI_CONFIG = {
    //put variables here
  };
}

if (typeof WIDGET_SETTINGS_UI_CONFIG === "undefined") {
  var WIDGET_SETTINGS_UI_CONFIG = {
    //put variables here
  };
}

/*  Copyright © 2014 Rise Vision Incorporated.
 *  Use of this software is governed by the GPLv3 license
 *  (reproduced in the LICENSE file).
 */
;(function ($, window, document, TEMPLATES, undefined) {
  "use strict";

  var _pluginName = "fontStyle";

  function Plugin(element, options) {
    var $element = $(element);
    var $btnAlignment = null;

    options = $.extend({}, {
      "bold": false,
      "italic": false,
      "underline": false,
    }, options);

    /*
     *  Private Methods
     */
    function _init() {
      // Get the HTML markup from the template.
      $element.append(TEMPLATES["font-style.html"]);
      // $btnAlignment = $element.find(".btn-alignment");

      // Set them all at once.
      //setStyle();

      // $element.find(".dropdown-menu button").on("click", function() {
      //   setAlignment($(this).data("wysihtml5-command-value"));
      // });
    }

    /*
     *  Public Methods
     */
    function setStyle(style) {

    }

    function getBold() {
     return $btnAlignment.data("wysihtml5-command-value");
    }

    function setBold(isBold) {
      $element.find(".bold").toggleClass("bold");
      $element.trigger("boldChanged", isBold);
    }

    _init();

    return {
      getBold: getBold,
      setBold: setBold,
    };
  }

  /*
   *  A lightweight plugin wrapper around the constructor that prevents
   *  multiple instantiations.
   */
  $.fn.fontStyle = function(options) {
    return this.each(function() {
      if (!$.data(this, "plugin_" + _pluginName)) {
        $.data(this, "plugin_" + _pluginName, new Plugin(this, options));
      }
    });
  };
})(jQuery, window, document, TEMPLATES);

if(typeof TEMPLATES === 'undefined') {var TEMPLATES = {};}
TEMPLATES['font-style.html'] = "<div class=\"btn-group\">\n" +
    "  <a class=\"btn btn-sm btn-default bold\" data-wysihtml5-command=\"bold\" title=\"CTRL+B\" tabindex=\"-1\">B</a>\n" +
    "  <a class=\"btn btn-sm btn-default italic\" data-wysihtml5-command=\"italic\" title=\"CTRL+I\" tabindex=\"-1\">I</a>\n" +
    "  <a class=\"btn btn-sm btn-default underline\" data-wysihtml5-command=\"underline\" title=\"CTRL+U\" tabindex=\"-1\">U</a>\n" +
    "</div>\n" +
    ""; 
if (typeof WIDGET_SETTINGS_UI_CONFIG === "undefined") {
  var WIDGET_SETTINGS_UI_CONFIG = {
    //put variables here
  };
}

/*  Copyright © 2014 Rise Vision Incorporated.
 *  Use of this software is governed by the GPLv3 license
 *  (reproduced in the LICENSE file).
 */
;(function ($, window, document, CONFIG, undefined) {
  "use strict";

  var _pluginName = "urlField";

  function Plugin(element, options) {

    return {

    };
  }

  /*
   *  A lightweight plugin wrapper around the constructor that prevents
   *  multiple instantiations.
   */
  $.fn.urlField = function(options) {
    return this.each(function() {
      if (!$.data(this, "plugin_" + _pluginName)) {
        $.data(this, "plugin_" + _pluginName, new Plugin(this, options));
      }
    });
  };
})(jQuery, window, document, WIDGET_SETTINGS_UI_CONFIG);

if(typeof TEMPLATES === 'undefined') {var TEMPLATES = {};}
TEMPLATES['url-field-template.html'] = "<div></div>\n" +
    ""; 
if (typeof WIDGET_SETTINGS_UI_CONFIG === "undefined") {
  var WIDGET_SETTINGS_UI_CONFIG = {
    //put variables here
  };
}
