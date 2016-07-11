(function () {
  "use strict";

  angular.module("risevision.widget.common.scroll-setting",
    ["risevision.common.i18n", "risevision.widget.common.tooltip"])
    .directive("scrollSetting", ["$templateCache", function ($templateCache) {
      return {
        restrict: "E",
        scope: {
          scroll: "=",
          hideDirection: "@"
        },
        template: $templateCache.get("_angular/scroll-setting/scroll-setting.html"),
        transclude: false,
        link: function($scope) {
          $scope.defaultSetting = {
            by: "none",
            direction: "up",
            speed: "medium",
            pause: 5,
            pud: 10
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

          $scope.$watch("scroll", function(scroll) {
            $scope.defaults(scroll, $scope.defaultSetting);
          });
        }
      };
    }]);
}());
