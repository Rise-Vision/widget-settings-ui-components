(function () {
  "use strict";

  angular.module("risevision.widget.common.table-setting", ["risevision.widget.common.translate"])
    .directive("tableSetting", ["$templateCache", function ($templateCache) {
      return {
        restrict: "E",
        scope: {
          table: "="
        },
        template: $templateCache.get("_angular/table-setting/table-setting.html"),
        transclude: false,
        link: function($scope) {
          $scope.defaultSetting = {
            colHeaderFont: {
              font: {
                family: "Verdana"
              },
              fontSize: "20",
              isBold: "false",
              isItalic: "false"
            },
            dataFont: {
              font: {
                family: "Verdana"
              },
              fontSize: "20",
              isBold: "false",
              isItalic: "false"
            },
            rowColor: "transparent",
            altRowColor: "transparent",
            rowPadding:"0",
            colPadding:"0"
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

          $scope.$watch("table", function(table) {
            $scope.defaults(table, $scope.defaultSetting);
          });
        }
      };
    }]);
}());
