(function () {
  "use strict";

  angular.module("risevision.widget.common.order", ["risevision.common.i18n"])
    .directive("order", ["$templateCache", "$log", function ($templateCache/*, $log*/) {
      return {
        restrict: "E",
        scope: {
          order: "="
        },
        template: $templateCache.get("_angular/order/order.html"),
        link: function ($scope) {
          $scope.$watch("order", function(position) {
            if (typeof position === "undefined") {
              // set a default
              $scope.order = "alpha-asc";
            }
          });
        }
      };
    }]);
}());
