/*  Copyright © 2014 Rise Vision Incorporated.
 *  Use of this software is governed by the GPLv3 license
 *  (reproduced in the LICENSE file).
 */
;(function ($, window, document, CONFIG, undefined) {
  "use strict";

  var _pluginName = "alignment";

  function Plugin(element, options) {
    var $element = $(element);
    var $btnAlignment = null;

    options = $.extend({}, { "alignment": "left" }, options);

    /*
     *  Private Methods
     */
    function _init() {
      // Get the HTML markup from the template.
      $element.append(TEMPLATES["alignment.html"]);
      $btnAlignment = $(".btn-alignment");

      setAlignment(options.alignment);

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
      var $primaryIcon = $(".btn-alignment .glyphicon");
      var currentClass = $primaryIcon.attr("class").match(/glyphicon-align-[a-z]+/g);
      var newClass = "glyphicon-align-" + alignment;

      // Remove current alignment icon.
      if (currentClass && currentClass.length > 0) {
        $primaryIcon.removeClass(currentClass[0]);
      }

      // Add new alignment icon.
      $primaryIcon.addClass(newClass);
      $btnAlignment.data("wysihtml5-command-value", alignment);
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
})(jQuery, window, document, CONFIG);
