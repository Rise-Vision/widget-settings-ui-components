(function () {
  "use strict";

  angular.module("risevision.widget.common")
    .directive("fontStyle", function () {
      function link(scope, element) {
        var $element = $(element);

        $element.fontStyle({});

        scope.$watch("bold", function(bold) {
          if (bold && $element.data("plugin_fontStyle")) {
            $element.data("plugin_fontStyle").setBold(bold);
          }
        });

        scope.$watch("italic", function(italic) {
          if (italic && $element.data("plugin_fontStyle")) {
            $element.data("plugin_fontStyle").setItalic(italic);
          }
        });

        scope.$watch("underline", function(underline) {
          if (underline && $element.data("plugin_fontStyle")) {
            $element.data("plugin_fontStyle").setUnderline(underline);
          }
        });

        scope.$on("collectAdditionalParams", function () {
          scope.bold = $element.data("plugin_fontStyle").isBold();
          scope.italic = $element.data("plugin_fontStyle").isItalic();
          scope.underline = $element.data("plugin_fontStyle").isUnderline();
        });
      }

      return {
        restrict: "E",
        scope: {
          bold: "=",
          italic: "=",
          underline: "=",
        },
        link: link
      };
    });
}());
