(function () {
  "use strict";

  angular.module("risevision.widget.common.alignment", [])
    .directive("alignment", function () {
      return {
        restrict: "E",
        scope: {
          align: "="
        },
        transclude: false,
        link: function (scope, element) {
          var $element = $(element);

          scope.$watch("align", function(align) {
            if (align) {
              if ($element.data("plugin_alignment")) {
                $element.data("plugin_alignment").setAlignment(align);
              }
              else {
                $element.alignment({ align: align });
              }
            }
          });

          $element.on("alignmentChanged", function(event, alignment) {
            scope.$apply(function() {
              scope.align = alignment;
            });
          });
        }
      };
    });
}());
