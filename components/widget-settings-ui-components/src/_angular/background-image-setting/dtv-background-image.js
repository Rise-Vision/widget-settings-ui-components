(function () {
  "use strict";

  angular.module("risevision.widget.common.background-image", [])
    .directive("backgroundImage", ["$log", function (/*$log*/) {
      return {
        restrict: "A",
        link: function(scope, element) {
          element.bind("load", function() {
            scope.$emit("backgroundImageLoad", true);
          });

          element.bind("error", function () {
            scope.$emit("backgroundImageLoad", false);
          });
        }
      };
    }]);
}());
