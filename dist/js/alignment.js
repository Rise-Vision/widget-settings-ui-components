if(typeof TEMPLATES === 'undefined') {var TEMPLATES = {};}
TEMPLATES['alignment.html'] = "<div class=\"btn-group alignment\">\n" +
    "  <button type=\"button\" class=\"btn btn-default btn-sm btn-alignment dropdown-toggle\"\n" +
    "    data-toggle=\"dropdown\" data-wysihtml5-command-value=\"left\">\n" +
    "    <i class=\"fa fa-align-left\"></i>\n" +
    "    <span class=\"caret\"></span>\n" +
    "  </button>\n" +
    "  <div class=\"dropdown-menu\" role=\"menu\">\n" +
    "    <div class=\"btn-group\">\n" +
    "      <button type=\"button\" class=\"btn btn-default btn-sm\" data-wysihtml5-command=\"alignment\"\n" +
    "        data-wysihtml5-command-value=\"left\" tabindex=\"-1\">\n" +
    "        <i class=\"fa fa-align-left\"></i>\n" +
    "      </button>\n" +
    "      <button type=\"button\" class=\"btn btn-default btn-sm\" data-wysihtml5-command=\"alignment\"\n" +
    "        data-wysihtml5-command-value=\"center\" tabindex=\"-1\">\n" +
    "        <i class=\"fa fa-align-center\"></i>\n" +
    "      </button>\n" +
    "      <button type=\"button\" class=\"btn btn-default btn-sm\" data-wysihtml5-command=\"alignment\"\n" +
    "        data-wysihtml5-command-value=\"right\" tabindex=\"-1\">\n" +
    "        <i class=\"fa fa-align-right\"></i>\n" +
    "      </button>\n" +
    "      <button type=\"button\" class=\"btn btn-default btn-sm\" data-wysihtml5-command=\"alignment\"\n" +
    "        data-wysihtml5-command-value=\"justify\" tabindex=\"-1\">\n" +
    "        <i class=\"fa fa-align-justify\"></i>\n" +
    "      </button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    ""; 
/*  Copyright © 2014 Rise Vision Incorporated.
 *  Use of this software is governed by the GPLv3 license
 *  (reproduced in the LICENSE file).
 */

/* global TEMPLATES */
;(function ($, window, document, TEMPLATES, undefined) {
  "use strict";

  var _pluginName = "alignment";

  function Plugin(element, options) {
    var $element = $(element);
    var $btnAlignment = null;
    var defaultAlignment = "left";

    options = $.extend({}, { "align": defaultAlignment }, options);

    /*
     *  Private Methods
     */
    function _init() {
      // Get the HTML markup from the template.
      $element.append(TEMPLATES["alignment.html"]);
      $btnAlignment = $element.find(".btn-alignment");

      setAlignment(options.align);

      $element.find(".dropdown-menu button").on("click", function() {
        var alignment = $(this).data("wysihtml5-command-value");

        setAlignment(alignment);
        $element.trigger("alignmentChanged", alignment);
      });
    }

    /*
     *  Public Methods
     */
    function getAlignment() {
     return $btnAlignment.data("wysihtml5-command-value");
    }

    function setAlignment(alignment) {
      var $primaryIcon = $element.find(".btn-alignment .fa");
      var currentClass = $primaryIcon.attr("class").match(/fa-align-[a-z]+/g);
      var newClass = "fa-align-" + alignment;

      // Remove current alignment icon.
      if (currentClass && currentClass.length > 0) {
        $primaryIcon.removeClass(currentClass[0]);
      }

      // Add new alignment icon.
      $primaryIcon.addClass(newClass);
      $btnAlignment.data("wysihtml5-command-value", alignment);
    }

    function reset() {
      setAlignment(defaultAlignment);
    }

    _init();

    return {
      getAlignment: getAlignment,
      setAlignment: setAlignment,
      reset:        reset
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
      "Verdana=verdana,geneva,sans-serif;",
  "sizes": "8px 9px 10px 11px 12px 14px 18px 24px 30px 36px 48px 60px 72px 96px"
};
