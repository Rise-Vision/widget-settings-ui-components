if(typeof TEMPLATES === 'undefined') {var TEMPLATES = {};}
TEMPLATES['font-style.html'] = "<div class=\"btn-group\">\n" +
    "  <a class=\"btn btn-sm btn-default bold\" data-wysihtml5-command=\"bold\" title=\"CTRL+B\" tabindex=\"-1\">B</a>\n" +
    "  <a class=\"btn btn-sm btn-default italic\" data-wysihtml5-command=\"italic\" title=\"CTRL+I\" tabindex=\"-1\">I</a>\n" +
    "  <a class=\"btn btn-sm btn-default underline\" data-wysihtml5-command=\"underline\" title=\"CTRL+U\" tabindex=\"-1\">U</a>\n" +
    "</div>\n" +
    ""; 
/*  Copyright © 2014 Rise Vision Incorporated.
 *  Use of this software is governed by the GPLv3 license
 *  (reproduced in the LICENSE file).
 */

/* global TEMPLATES */
;(function ($, window, document, TEMPLATES, undefined) {
  "use strict";

  var _pluginName = "fontStyle";

  function Plugin(element, options) {
    var $element = $(element);
    var $bold = null;
    var $italic = null;
    var $underline = null;
    var defaults = {
      "bold":      false,
      "italic":    false,
      "underline": false,
    };

    options = $.extend({}, defaults, options);

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
      $element.find(".btn").on("click", function() {
        var value = !$(this).hasClass("active");
        _setStyle($(this), value);

        $element.trigger("styleChanged",
          [$(this).attr("data-wysihtml5-command"), value]);
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

    function reset() {
      setStyles(defaults);
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
      reset:          reset
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

/* exported WIDGET_SETTINGS_UI_CONFIG */
var WIDGET_SETTINGS_UI_CONFIG = {
  "families": "Andale Mono=andale mono,monospace;" +
      "Arial=arial,helvetica,sans-serif;" +
      "Arial Black=arial black,sans-serif;" +
      "Book Antiqua=book antiqua,palatino,serif;" +
      "Comic Sans MS=comic sans ms,sans-serif;" +
      "Courier New=courier new,courier,monospace;" +
      "Georgia=georgia,palatino,serif;" +
      "Helvetica=helvetica,arial,sans-serif;" +
      "Impact=impact,sans-serif;" +
      "Symbol=symbol;" +
      "Tahoma=tahoma,arial,helvetica,sans-serif;" +
      "Terminal=terminal,monaco,monospace;" +
      "Times New Roman=times new roman,times,serif;" +
      "Trebuchet MS=trebuchet ms,geneva,sans-serif;" +
      "Verdana=verdana,geneva,sans-serif;" +
      "Webdings=webdings;" +
      "Wingdings=wingdings,zapf dingbats;",
  "sizes": "8px 9px 10px 11px 12px 14px 18px 24px 30px 36px 48px 60px 72px 96px"
};
