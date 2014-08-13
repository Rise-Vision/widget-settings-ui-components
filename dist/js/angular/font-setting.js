(function () {
  "use strict";

  angular.module("risevision.widget.common.font-setting", ["risevision.widget.common.translate"])
    .directive("fontSetting", ["i18nLoader", "$log", "$templateCache", function (i18nLoader, $log, $templateCache) {
      return {
        restrict: "A",
        scope: {
          prefix: "=",
          i18nPrefix: "=",
          fontData: "=",
          fontVisible: "=",
          fontSizeVisible: "=",
          textVisible: "="
        },
        template: $templateCache.get("_angular/font-setting/font-setting.html"),
        transclude: false,
        link: function ($scope, elm, attrs) {
          var stripLast = function (str, strToStrip) {
            var index = str.indexOf(strToStrip);

            if (index >= 0) {
              str = str.substring(0, str.lastIndexOf(strToStrip));
            }
            return str;
          };

          var valOrDefault = function (val, defaultVal) {
            if (angular.isUndefined(val) || val === null) {
              return defaultVal;
            }
            else {
              return val;
            }
          };
          var $elm = $(elm);
          var prefix = $scope.prefix || stripLast(attrs.id, "-font");

          $scope.$watch("fontData", function(fontData) {
            if (fontData) {
              $elm.fontPicker({
                "i18n-prefix": $scope.i18nPrefix || attrs.id,
                "defaults" : {
                  "font" : $scope.fontData.font,
                  "font-url" : $scope.fontData.fontUrl,
                  "font-size" : $scope.fontData.fontSize,
                  "is-bold" : $scope.fontData.isBold,
                  "is-italic" : $scope.fontData.isItalic,
                  "color" : $scope.fontData.color
                },
                "visibility": {
                  "font" : valOrDefault($scope.fontVisible, true),
                  "font-size" : valOrDefault($scope.fontSizeVisible, true),
                  "variants" : valOrDefault($scope.fontSizeVisible, true),
                  "text" : valOrDefault($scope.textVisible, true)
                }
              });

              //load i18n text translations after ensuring i18n has been initialized
              i18nLoader.get().then(function () {$elm.i18n();});
            }
          });

          $scope.$on("collectAdditionalParams", function () {
            var picker = $elm.data("font-picker");

            $log.debug("Collecting params from", prefix, picker);
            $scope.fontData.font = picker.getFont();
            //$scope.fontData.fontStyle = picker.getFontStyle();
            $scope.fontData.fontUrl = picker.getFontURL();
            $scope.fontData.fontSize = picker.getFontSize();
            $scope.fontData.isBold = picker.getBold();
            $scope.fontData.isItalic = picker.getItalic();
            $scope.fontData.color = picker.getColor();
          });
        }
      };
    }]);
}());

(function(module) {
try { app = angular.module("risevision.widget.common.font-setting"); }
catch(err) { app = angular.module("risevision.widget.common.font-setting", []); }
app.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("_angular/font-setting/font-setting.html",
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-3\">\n" +
    "    <div class=\"font-picker-font form-group\"></div>\n" +
    "  </div>\n" +
    "  <div class=\"col-md-3\">\n" +
    "    <div class=\"font-picker-size form-group\"></div>\n" +
    "  </div>\n" +
    "  <div class=\"col-md-3\">\n" +
    "    <div class=\"font-picker-variants form-group\"></div>\n" +
    "  </div>\n" +
    "  <div class=\"col-md-3\">\n" +
    "    <div class=\"font-picker-color form-group\"></div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-6\">\n" +
    "    <div class=\"font-picker-custom-font form-group\"></div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-12\">\n" +
    "    <div class=\"font-picker-text form-group\"></div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<!--\n" +
    "<div class=\"row\">\n" +
    "  <div class=\"col-sm-6 col-lg-3\">\n" +
    "    <div class=\"form-group\">\n" +
    "      <label data-i18n=\"header.font\">{{'col-header-font.font' | translate}}</label>\n" +
    "      <div class=\"font-picker\"></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"col-sm-6 col-lg-3\">\n" +
    "    <div class=\"form-group\">\n" +
    "      <label data-i18n=\"header.font-size\">{{'col-header-font.font-size'}}</label>\n" +
    "      <div class=\"font-size-picker\"></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"clearfix hidden-lg\"></div>\n" +
    "  <div class=\"col-sm-6 col-lg-3\">\n" +
    "    <div class=\"form-group\">\n" +
    "      <label data-i18n=\"common.font-variants.label\"></label>\n" +
    "      <div class=\"checkbox\">\n" +
    "        <label for=\"header-bold\" data-i18n=\"common.font-variants.bold\">{{'common.font-variants.bold' | translate}}</label>\n" +
    "        <input id=\"header-bold\" name=\"header-bold\" type=\"checkbox\" value=\"header-bold\">\n" +
    "      </div>\n" +
    "      <div class=\"checkbox\">\n" +
    "        <label for=\"header-italic\" data-i18n=\"common.font-variants.italic\">{{'common.font-variants.italic' | translate}}</label>\n" +
    "        <input id=\"header-italic\" name=\"header-italic\" type=\"checkbox\" value=\"header-italic\">\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"col-sm-6 col-lg-3\">\n" +
    "    <div class=\"form-group\">\n" +
    "      <label for=\"header-color-picker\" data-i18n=\"header.color\">{{'col-header-font.color'}}</label>\n" +
    "      <div>\n" +
    "        <input id='header-color-picker' type='text'>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<div class=\"row\">\n" +
    "  <div class=\"col-xs-12\">\n" +
    "    <div class=\"font-picker-text form-group\"></div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "-->\n" +
    "");
}]);
})();
