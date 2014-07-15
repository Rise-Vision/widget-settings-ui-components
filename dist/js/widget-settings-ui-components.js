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

/*  Copyright © 2014 Rise Vision Incorporated.
 *  Use of this software is governed by the GPLv3 license
 *  (reproduced in the LICENSE file).
 */
;(function ($, window, document, TEMPLATES, undefined) {
  "use strict";

  var _pluginName = "fontStyle";

  function Plugin(element, options) {
    var $element = $(element);
    var $bold = null;
    var $italic = null;
    var $underline = null;

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

      $bold = $element.find(".bold");
      $italic = $element.find(".italic");
      $underline = $element.find(".underline");

      // Initialize all styles.
      setStyles({
        "bold": options.bold,
        "italic": options.italic,
        "underline": options.underline,
      });

      // Handle clicking on any of the style buttons.
      $(".btn").on("click", function() {
        _setStyle($(this), !$(this).hasClass("active"));
      });
    }

    function _getStyle($styleElem) {
      return $styleElem.hasClass("active");
    }

    function _setStyle($styleElem, value) {
      if (value) {
        $styleElem.addClass("active");
      }
      else {
        $styleElem.removeClass("active");
      }

      $element.trigger("styleChanged",
        [$styleElem.attr("data-wysihtml5-command"), value]);
    }

    /*
     *  Public Methods
     */
    function isBold() {
      return _getStyle($bold);
    }

    function setBold(value) {
      _setStyle($bold, value);
    }

    function isItalic() {
     return _getStyle($italic);
    }

    function setItalic(value) {
      _setStyle($italic, value);
    }

    function isUnderline() {
     return _getStyle($underline);
    }

    function setUnderline(value) {
      _setStyle($underline, value);
    }

    function getStyles() {
      return  {
        "bold": isBold(),
        "italic": isItalic(),
        "underline": isUnderline(),
      };
    }

    function setStyles(styles) {
      _setStyle($bold, styles.bold);
      _setStyle($italic, styles.italic);
      _setStyle($underline, styles.underline);
    }

    _init();

    return {
      isBold:         isBold,
      isItalic:       isItalic,
      isUnderline:    isUnderline,
      setBold:        setBold,
      setItalic:      setItalic,
      setUnderline:   setUnderline,
      getStyles:      getStyles,
      setStyles:      setStyles,
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
