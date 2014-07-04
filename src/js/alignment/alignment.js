/*  Copyright © 2014 Rise Vision Incorporated.
 *  Use of this software is governed by the GPLv3 license
 *  (reproduced in the LICENSE file).
 */
;(function ($, window, document, CONFIG, undefined) {
  "use strict";

  var _pluginName = "alignment";

  function Plugin(element, options) {
    var $element = $(element);

    options = $.extend({}, { "alignment": "left" }, options);

    /*
     *  Private Methods
     */
    function _init() {
      // Get the HTML markup from the template.
      $element.append(TEMPLATES["alignment-template.html"]);
    }

    /*
     *  Public Methods
     */
    function getAlignment() {

    }

    function setAlignment(alignment) {

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
