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
            font: {
              type: "standard",
              name: "Verdana",
              family: "Verdana"
            },
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
              previewEl.css("font-family", fontData.font.family);
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

(function(module) {
try { app = angular.module("risevision.widget.common.font-setting"); }
catch(err) { app = angular.module("risevision.widget.common.font-setting", []); }
app.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("_angular/font-setting/font-setting.html",
    "<ul class=\"list-inline\">\n" +
    "  <li class=\"pull-left\">\n" +
    "    <font-picker font=\"fontData.font\"></font-picker>\n" +
    "  </li>\n" +
    "  <li class=\"pull-left\">\n" +
    "    <font-size-picker ng-model=\"fontData.size\"></font-size-picker>\n" +
    "  </li>\n" +
    "  <li class=\"pull-left\">\n" +
    "    <font-style bold=\"fontData.bold\" italic=\"fontData.italic\" underline=\"fontData.underline\"></font-style>\n" +
    "  </li>\n" +
    "  <li class=\"pull-left\">\n" +
    "    <input color-picker type=\"text\" color=\"fontData.color\" />\n" +
    "  </li>\n" +
    "  <li class=\"pull-left\">\n" +
    "    <input color-picker type=\"background\" color=\"fontData.backgroundColor\" />\n" +
    "  </li>\n" +
    "  <li class=\"pull-left\">\n" +
    "    <alignment align=\"fontData.align\"></alignment>\n" +
    "  </li>\n" +
    "</ul>\n" +
    "<div class=\"row\" style=\"\">\n" +
    "  <div class=\"col-md-12\">\n" +
    "    <div class=\"font-picker-text form-group\">Font Picker Text</div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);
})();
