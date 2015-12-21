(function () {
  "use strict";

  angular.module("risevision.widget.common.position-setting", ["risevision.common.i18n"])
    .directive("positionSetting", ["$templateCache", "$log", function ($templateCache/*, $log*/) {
      return {
        restrict: "E",
        scope: {
          position: "=",
          hideLabel: "@",
          parentContainerClass: "=",
          containerClass: "="
        },
        template: $templateCache.get("_angular/position-setting/position-setting.html"),
        link: function ($scope) {
          $scope.$watch("position", function(position) {
            if (typeof position === "undefined") {
              // set a default
              $scope.position = "top-left";
            }
          });
        }
      };
    }]);
}());
