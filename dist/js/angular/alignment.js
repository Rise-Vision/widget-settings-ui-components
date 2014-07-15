angular.module("risevision.widget.common")
  .directive("alignment", function () {
    return {
      restrict: "E",
      scope: {
        align: "="
      },
      transclude: false,
      link: function ($scope, element, attrs) {
        var $element = $(element);

        $scope.$watch("align", function(align) {
          if (align) {
            $element.alignment({
              "align": $scope.align
            });
          }
        });

        $scope.$on("collectAdditionalParams", function () {
          $scope.align = $element.getAlignment();
        });
      }
    };
  });
