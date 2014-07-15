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

    function _setStyle($styleElem, style) {
      if (style) {
        $styleElem.addClass("active");
      }
      else {
        $styleElem.removeClass("active");
      }

      $element.trigger("styleChanged", [$styleElem.attr("data-wysihtml5-command"),
        style]);
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
