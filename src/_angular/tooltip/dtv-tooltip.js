(function () {
  "use strict";

  angular.module("risevision.widget.common.tooltip", [])
    .directive("tooltip", ["$templateCache", function ($templateCache) {
      return {
        restrict: "E",
        scope: {
          align: "="
        },
        template: $templateCache.get("_angular/tooltip/tooltip.html"),
        transclude: false,
        link: function ($scope, element) {
          var $element = $(element);

          $element.popover({trigger: "click"});
        }
      };
    }]);
}());
