(function () {
  "use strict";

  angular.module("risevision.widget.common.column-setting", ["risevision.widget.common.alignment", "risevision.common.i18n"])
    .directive("columnSetting", ["$templateCache", function ($templateCache) {
      return {
        restrict: "E",
        scope: {
          column: "=",
          expand: "="
        },
        template: $templateCache.get("_angular/column-setting/column-setting.html"),
        transclude: false,
        link: function($scope) {

          var defaultNumberSettings = {
            type: "int",
            align: "left",
            width: 100,
            decimals: 0,
            sign: "none",
            colorCondition: "none"
          };
          var defaultStringSettings = {
            type: "string",
            align: "left",
            width: 100
          };
          var defaultDateSettings = {
            type: "date",
            align: "left",
            width: 100,
            date: "medium"
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

          $scope.$watch("column", function(column) {
            var defaultSetting;

            if (typeof column.type !== "undefined") {
              switch (column.type) {
                case "int":
                case "number":
                  defaultSetting = defaultNumberSettings;
                  break;
                case "string":
                case "text":
                  defaultSetting = defaultStringSettings;
                  break;
                case "date":
                  defaultSetting = defaultDateSettings;
                  break;
                default:
                  defaultSetting = defaultStringSettings;
              }

              $scope.defaults(column, defaultSetting);
            }
            else {
              $scope.defaults(column, defaultStringSettings);
            }
          });

          $scope.remove = function() {
            $scope.$parent.remove($scope.column);
          };
        }
      };
    }]);
}());
