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
