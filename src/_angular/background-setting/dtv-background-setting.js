(function () {
  "use strict";

  angular.module("risevision.widget.common.background-setting",
    ["risevision.widget.common.translate", "risevision.widget.common.color-picker"])
    .directive("backgroundSetting", ["$templateCache", function ($templateCache) {
      return {
        restrict: "E",
        scope: {
          background: "="
        },
        template: $templateCache.get("_angular/background-setting/background-setting.html"),
        link: function ($scope) {
          $scope.defaultSetting = {
            color: "transparent"
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

          $scope.$watch("background", function(background) {
            $scope.defaults(background, $scope.defaultSetting);
          });
        }
      };
    }]);
}());
