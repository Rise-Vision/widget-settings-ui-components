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
      toggleStyles({
        "bold": options.bold,
        "italic": options.italic,
        "underline": options.underline,
      });

      // $element.find(".dropdown-menu button").on("click", function() {
      //   setAlignment($(this).data("wysihtml5-command-value"));
      // });
    }

    function _getStyle($elem) {
      return $elem.hasClass("active");
    }

    function _setStyle($elem, style) {
      $elem.toggleClass("active");
      $element.trigger(style + "Changed", $elem.hasClass("active"));
    }

    /*
     *  Public Methods
     */
    function getBold() {
      return _getStyle($bold);
    }

    function toggleBold() {
      _setStyle($bold, "bold");
    }

    function getItalic() {
     return _getStyle($italic);
    }

    function toggleItalic() {
      _setStyle($italic, "italic");
    }

    function getUnderline() {
     return _getStyle($underline);
    }

    function toggleUnderline() {
      _setStyle($underline, "underline");
    }

    function getStyles() {
      return  {
        "bold": _getStyle($bold),
        "italic": _getStyle($italic),
        "underline": _getStyle($underline),
      };
    }

    function toggleStyles(styles) {
      _setStyle($bold, styles.bold);
      _setStyle($italic, styles.italic);
      _setStyle($underline, styles.underline);
    }

    _init();

    return {
      getBold:          getBold,
      getItalic:        getItalic,
      getUnderline:     getUnderline,
      getStyles:        getStyles,
      toggleBold:       toggleBold,
      toggleItalic:     toggleItalic,
      toggleUnderline:  toggleUnderline,
      toggleStyles:     toggleStyles,
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
