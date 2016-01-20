if(typeof TEMPLATES === 'undefined') {var TEMPLATES = {};}
TEMPLATES['url-field-template.html'] = "<div class=\"form-group validate-url\">\n" +
    "  <div class=\"checkbox\">\n" +
    "    <label>\n" +
    "      <input name=\"validate-url\" type=\"checkbox\" value=\"validate-url\" checked=\"checked\"> Validate URL\n" +
    "    </label>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "  <label>URL</label>\n" +
    "  <input name=\"url\" type=\"text\" class=\"form-control\" />\n" +
    "</div>\n" +
    ""; 
/*  Copyright © 2014 Rise Vision Incorporated.
 *  Use of this software is governed by the GPLv3 license
 *  (reproduced in the LICENSE file).
 */

/* global TEMPLATES */
/* jshint maxlen: 500 */
;(function ($, window, document, TEMPLATES, undefined) {
  "use strict";

  var _pluginName = "urlField";

  function Plugin(element, options) {
    var $element = $(element),
      $urlInp = null,
      $validateUrlCtn = null,
      $validateUrlCB = null,
      urlRegExp = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i,
      doValidation = true;

    options = $.extend({}, { "url": "http://" }, options);

    function _getUrl() {
      return $.trim($urlInp.val());
    }

    function _testUrl(value) {
      // Add http:// if no protocol parameter exists
      if (value.indexOf("://") === -1) {
        value = "http://" + value;
      }
      /*
       Discussion
       http://stackoverflow.com/questions/37684/how-to-replace-plain-urls-
       with-links#21925491

       Using
       https://gist.github.com/dperini/729294
       Reasoning
       http://mathiasbynens.be/demo/url-regex

       */

      return urlRegExp.test(value);
    }

    function _setUrl(value) {
      if (typeof value === "string") {
        if ($urlInp) {
          $urlInp.val(value);
        }
      }
    }

    function _validateUrl() {
      if (!doValidation) {
        return true;
      }

      var valid = _testUrl(_getUrl());
      if (!valid) {
        if (!$validateUrlCtn.is(":visible")) {
          $validateUrlCtn.show();
        }
      }

      return valid;
    }

    function _init() {
      // Get the HTML markup from the template.
      $element.append(TEMPLATES["url-field-template.html"]);

      $urlInp = $element.find("input[name='url']");
      $validateUrlCtn = $element.find("div.validate-url");
      $validateUrlCB = $element.find("input[name='validate-url']");

      $validateUrlCtn.hide();

      _setUrl(options.url);

      $validateUrlCB.on("click", function () {
        doValidation = $(this).is(":checked");
      });
    }

    _init();

    return {
      setUrl: _setUrl,
      getUrl: _getUrl,
      validateUrl: _validateUrl
    };
  }

  /*
   *  A lightweight plugin wrapper around the constructor that prevents
   *  multiple instantiations.
   */
  $.fn.urlField = function (options) {
    return this.each(function () {
      if (!$.data(this, "plugin_" + _pluginName)) {
        $.data(this, "plugin_" + _pluginName, new Plugin(this, options));
      }
    });
  };
})(jQuery, window, document, TEMPLATES);

/* global WIDGET_SETTINGS_UI_CONFIG: true */
/* exported WIDGET_SETTINGS_UI_CONFIG */
if (typeof WIDGET_SETTINGS_UI_CONFIG === "undefined") {
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
}
