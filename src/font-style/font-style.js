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
