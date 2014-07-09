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
