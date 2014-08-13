(function () {
  "use strict";

  angular.module("risevision.widget.common.column-setting", ["risevision.widget.common.alignment",
      "risevision.widget.common.translate"])
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
          $scope.defaultSetting = {
            type: "int",
            alignment: "left",
            width: "100px",
            decimals: 0,
            sign: "arrow",
            colorCondition: "none"
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
            $scope.defaults(column, $scope.defaultSetting);
          });

          $scope.remove = function() {
            $scope.$parent.remove($scope.column);
          };
        }
      };
    }]);
}());
