var CONFIG = {};

/*  Copyright © 2014 Rise Vision Incorporated.
 *  Use of this software is governed by the GPLv3 license
 *  (reproduced in the LICENSE file).
 */
;(function ($, window, document, CONFIG, undefined) {
  "use strict";

  var _pluginName = "fontSizePicker";

  function Plugin(element, options) {
    var $element = $(element);
    var defaultSize = "14";

    options = $.extend({}, {
      "font-size":  defaultSize,
      "blank":      false,
    }, options);

    /*
     *  Private Methods
     */
    function _init() {
      // Add the markup.
      $element.append("<select class='form-control bfh-fontsizes' " +
        "data-style='btn-default btn-sm'></select>");

      // Initialize the font size picker component.
      $element.find(".bfh-fontsizes").bfhfontsizes({
        "fontsize": options["font-size"],
        "blank":    options.blank,
      }).selectpicker();

      $element.find(".bfh-fontsizes").on("change.bfhselectbox", function(e) {
        $element.trigger("sizeChanged", getSize());
      });
    }

    /*
     *  Public Methods
     */
    function getSize() {
      return $element.find(".bfh-fontsizes").val();
    }

    function setSize(size) {
      var $selectElem = $element.find(".bfh-fontsizes");

      if (size) {
        size = parseInt(size, 10);

        // Find the drop-down item for this font size and select it.
        $selectElem.find("> .dropdown-menu li").each(function(index) {
          if ($(this).find("span").text() == size) {
            $(this).toggleClass("selected", true);
          }
          else {
            $(this).toggleClass("selected", false);
          }
        });

        // Update the UI with the current font size.
        $selectElem.find("> button").attr("title", size);
        $selectElem.find(".filter-option").html(size);
        $selectElem.val(size);
      }
    }

    function reset() {
      setSize(defaultSize);
    }

    _init();

    return {
      getFontSize: getSize,
      setFontSize: setSize,
      reset:       reset
    };
  }

  /*
   *  A lightweight plugin wrapper around the constructor that prevents
   *  multiple instantiations.
   */
  $.fn.fontSizePicker = function(options) {
    return this.each(function() {
      if (!$.data(this, "plugin_" + _pluginName)) {
        $.data(this, "plugin_" + _pluginName, new Plugin(this, options));
      }
    });
  };
})(jQuery, window, document, CONFIG);