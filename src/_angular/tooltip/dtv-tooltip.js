angular.module("risevision.widget.common")
  .directive("tooltip", function () {
    return {
      restrict: "E",
      scope: {
        align: "="
      },
      template: VIEWS["tooltip/tooltip.html"],
      transclude: false,
      link: function ($scope, element, attrs) {
        var $element = $(element);

        $element.popover({trigger: 'click'});
      }
    };
  });
