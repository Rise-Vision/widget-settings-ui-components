if(typeof TEMPLATES === 'undefined') {var TEMPLATES = {};}
TEMPLATES['alignment.html'] = "<div class=\"btn-group alignment\">\n" +
    "  <button type=\"button\" class=\"btn btn-default btn-sm btn-alignment dropdown-toggle\"\n" +
    "    data-toggle=\"dropdown\" data-wysihtml5-command-value=\"left\">\n" +
    "    <i class=\"glyphicon glyphicon-align-left\"></i>\n" +
    "    <span class=\"caret\"></span>\n" +
    "  </button>\n" +
    "  <div class=\"dropdown-menu\" role=\"menu\">\n" +
    "    <div class=\"btn-group\">\n" +
    "      <button type=\"button\" class=\"btn btn-default btn-sm\" data-wysihtml5-command=\"alignment\"\n" +
    "        data-wysihtml5-command-value=\"left\" tabindex=\"-1\">\n" +
    "        <i class=\"glyphicon glyphicon-align-left\"></i>\n" +
    "      </button>\n" +
    "      <button type=\"button\" class=\"btn btn-default btn-sm\" data-wysihtml5-command=\"alignment\"\n" +
    "        data-wysihtml5-command-value=\"center\" tabindex=\"-1\">\n" +
    "        <i class=\"glyphicon glyphicon-align-center\"></i>\n" +
    "      </button>\n" +
    "      <button type=\"button\" class=\"btn btn-default btn-sm\" data-wysihtml5-command=\"alignment\"\n" +
    "        data-wysihtml5-command-value=\"right\" tabindex=\"-1\">\n" +
    "        <i class=\"glyphicon glyphicon-align-right\"></i>\n" +
    "      </button>\n" +
    "      <button type=\"button\" class=\"btn btn-default btn-sm\" data-wysihtml5-command=\"alignment\"\n" +
    "        data-wysihtml5-command-value=\"justify\" tabindex=\"-1\">\n" +
    "        <i class=\"glyphicon glyphicon-align-justify\"></i>\n" +
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

    options = $.extend({}, { "align": "left" }, options);

    /*
     *  Private Methods
     */
    function _init() {
      // Get the HTML markup from the template.
      $element.append(TEMPLATES["alignment.html"]);
      $btnAlignment = $element.find(".btn-alignment");

      setAlignment(options.align);

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
      var $primaryIcon = $element.find(".btn-alignment .glyphicon");
      var currentClass = $primaryIcon.attr("class").match(/glyphicon-align-[a-z]+/g);
      var newClass = "glyphicon-align-" + alignment;

      // Remove current alignment icon.
      if (currentClass && currentClass.length > 0) {
        $primaryIcon.removeClass(currentClass[0]);
      }

      // Add new alignment icon.
      $primaryIcon.addClass(newClass);
      $btnAlignment.data("wysihtml5-command-value", alignment);

      $element.trigger("alignmentChanged", alignment);
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
})(jQuery, window, document, TEMPLATES);

/* global WIDGET_SETTINGS_UI_CONFIG: true */
/* exported WIDGET_SETTINGS_UI_CONFIG */
if (typeof WIDGET_SETTINGS_UI_CONFIG === "undefined") {
  var WIDGET_SETTINGS_UI_CONFIG = {
    //put variables here
  };
}

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
      setStyles({
        "bold": options.bold,
        "italic": options.italic,
        "underline": options.underline,
      });

      // Handle clicking on any of the style buttons.
      $(".btn").on("click", function() {
        _setStyle($(this), !$(this).hasClass("active"));
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

      $element.trigger("styleChanged",
        [$styleElem.attr("data-wysihtml5-command"), value]);
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

/* global WIDGET_SETTINGS_UI_CONFIG: true */
/* exported WIDGET_SETTINGS_UI_CONFIG */
if (typeof WIDGET_SETTINGS_UI_CONFIG === "undefined") {
  var WIDGET_SETTINGS_UI_CONFIG = {
    //put variables here
  };
}

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
    //put variables here
  };
}
