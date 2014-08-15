(function () {
  "use strict";

  angular.module("risevision.widget.common.font-setting", ["risevision.widget.common.translate",
    "risevision.widget.common.font-style","risevision.widget.common.fontsizepicker",
    "risevision.widget.common.fontpicker"])
    .directive("fontSetting", ["i18nLoader", "$log", "$templateCache", function (i18nLoader, $log, $templateCache) {
      return {
        restrict: "A",
        scope: {
          prefix: "=",
          i18nPrefix: "=",
          fontData: "=",
          fontVisible: "=",
          fontSizeVisible: "=",
          textVisible: "="
        },
        template: $templateCache.get("_angular/font-setting/font-setting.html"),
        transclude: false,
        link: function ($scope, element) {
          var $element = $(element);

          $scope.defaultFont = {
            font: "Verdana",
            size: "20",
            bold: false,
            italic: false,
            underline: false,
            color: "black",
            backgroundColor: "transparent",
            align: "left"
          };

          $scope.defaults = function(obj) {
            if (obj) {
              for (var i = 1, length = arguments.length; i < length; i++) {
                var source = arguments[i];

                for (var prop in source) {
                  if (obj[prop] === void 0) {
                    obj[prop] = source[prop];
                  }
                }
              }
            }
            return obj;
          };

          var watch = $scope.$watch("fontData", function(fontData) {
            if (fontData) {
              $scope.defaults(fontData, $scope.defaultFont);
              updatePreview(fontData);
              watch();

              $scope.$watch("fontData", updatePreview, true);
            }
          });

          function updatePreview(fontData) {
            if (fontData) {
              var previewEl = $element.find(".font-picker-text");
              previewEl.css("font-family", fontData.font);
              previewEl.css("font-size", fontData.size + "pt");
              previewEl.css("font-weight", fontData.bold ? "bold" : "normal");
              previewEl.css("font-style", fontData.italic ? "italic" : "normal");
              previewEl.css("text-decoration", fontData.underline ? "underline" : "none");
              previewEl.css("text-align", fontData.align);
              previewEl.css("color", fontData.color);
              previewEl.css("background-color", fontData.backgroundColor);
            }
          }
        }
      };
    }]);
}());
