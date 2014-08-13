(function () {
  "use strict";

  angular.module("risevision.widget.common.font-setting", ["risevision.widget.common.translate",
    "risevision.widget.common.font-style","risevision.widget.common.fontsizepicker",
    "risevision.widget.common.fontpicker"])
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
        link: function ($scope) {
          $scope.defaultFont = {
            font: "Verdana",
            size: "20",
            bold: "false",
            italic: "false",
            color: "black",
            align: "left"
          };

          $scope.defaults = function(obj) {
            if (obj) {
              for (var i = 1, length = arguments.length; i < length; i++) {
                var source = arguments[i];

                for (var prop in source) {
                  if (obj[prop] === void 0) {
                    obj[prop] = source[prop];
                  }
                }
              }
            }
            return obj;
          };

          $scope.$watch("fontData", function(fontData) {
            $scope.defaults(fontData, $scope.defaultFont);
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
    "  <div class=\"col-md-2\">\n" +
    "    <font-style bold=\"fontData.bold\" italic=\"fontData.italic\" underline=\"fontData.underline\"></font-style>\n" +
    "  </div>\n" +
    "  <div class=\"col-md-2\">\n" +
    "    <alignment align=\"fontData.align\"></alignment>\n" +
    "  </div>\n" +
    "  <div class=\"col-md-2\">\n" +
    "    <font-picker ng-model=\"fontData.font\"></font-picker>\n" +
    "  </div>\n" +
    "  <div class=\"col-md-2\">\n" +
    "    <font-size-picker ng-model=\"fontData.size\"></font-size-picker>\n" +
    "  </div>\n" +
    "  <div class=\"col-md-2\">\n" +
    "    <input color-picker color=\"fontData.color\" type=\"text\" />\n" +
    "  </div>\n" +
    "</div>\n" +
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-12\">\n" +
    "    <div class=\"font-picker-text form-group\"></div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);
})();
