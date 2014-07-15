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
