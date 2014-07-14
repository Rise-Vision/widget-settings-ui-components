angular.module("risevision.widget.common")
  .directive("alignment", function () {
    function link(scope, element, attrs) {
      attrs.align = attrs.align || "left";

      element.alignment({
        "align": attrs.align
      });
    }

    return {
      restrict: "E",
      link: link
    };
  });
