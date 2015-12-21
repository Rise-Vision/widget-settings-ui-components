(function () {
  "use strict";

  angular.module("risevision.widget.common.font-style", [])
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

        $element.on("styleChanged", function(event, type, value) {
          scope.$apply(function() {
            if (type === "bold") {
              scope.bold = value;
            }
            else if (type === "italic") {
              scope.italic = value;
            }
            else if (type === "underline") {
              scope.underline = value;
            }
          });
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
