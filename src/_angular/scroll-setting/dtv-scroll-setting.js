/* global VIEWS */
(function () {
  "use strict";

  angular.module("risevision.widget.common.scroll-setting", ["risevision.widget.common.translate"])
    .directive("scrollSetting", function () {
      return {
        restrict: "E",
        scope: {
          scroll: "="
        },
        template: VIEWS["scroll-setting/scroll-setting.html"],
        transclude: false,
        link: function($scope) {
          $scope.defaultSetting = {
            by: "none",
            speed: "medium",
            pause: "5"
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
    });
}());
