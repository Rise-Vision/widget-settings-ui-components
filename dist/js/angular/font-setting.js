(function () {
  "use strict";

  angular.module("risevision.widget.common.font-setting", ["ui.tinymce"])
    .directive("fontSetting", ["$templateCache", function ($templateCache) {
      return {
        restrict: "AE",
        scope: {
          fontData: "=",
          previewText: "@",
          hideAlignment: "@"
        },
        template: $templateCache.get("_angular/font-setting/font-setting.html"),
        transclude: false,
        link: function ($scope, element, attrs) {
          var _fontData = null;

          $scope.defaultFont = {
            font: {
              type: "standard",
              name: "Verdana",
              family: "verdana,geneva,sans-serif"
            },
            size: "24px",
            bold: false,
            italic: false,
            underline: false,
            color: "black",
            highlightColor: "transparent"
          };

          // Initialize TinyMCE.
          $scope.tinymceOptions = {
            content_css: "http://fonts.googleapis.com/css?family=Aclonica,http://fonts.googleapis.com/css?family=Rock+Salt",
            selector: "textarea",
            menubar: false,
            statusbar: false,
            plugins: "textcolor",
            toolbar: "fontselect fontsizeselect | alignleft aligncenter alignright alignjustify | forecolor backcolor | bold italic underline",
            // font_formats: tm_fonts,
            fontsize_formats: "8px 9px 10px 11px 12px 14px 18px 24px 30px 36px 48px 60px 72px 96px",
            setup: function(editor) {
              var textContainer = document.querySelector(".text-container"),
                text = document.querySelector(".text"),
                $bold = null,
                $italic = null,
                $underline = null;

              // Initialize toolbar and preview text.
              editor.on("init", function() {
                $bold = $(".mce-btn[aria-label='Bold']");
                $italic = $(".mce-btn[aria-label='Italic']");
                $underline = $(".mce-btn[aria-label='Underline']");

                if (_fontData) {
                  // Alignment
                  switch(_fontData.align) {
                    case "left":
                      editor.execCommand("JustifyLeft", false);
                      break;
                    case "center":
                      editor.execCommand("JustifyCenter", false);
                      break;
                    case "right":
                      editor.execCommand("JustifyRight", false);
                      break;
                    case "justify":
                      editor.execCommand("JustifyFull", false);
                      break;
                    default:
                      break;
                  }

                  // TODO: Colors

                  // Font Style
                  if (_fontData.bold) {
                    toggleButton($bold);
                  }

                  if (_fontData.italic) {
                    toggleButton($italic);
                  }

                  if (_fontData.underline) {
                    toggleButton($underline);
                  }

                  // These 2 must be last for some reason.
                  editor.execCommand("FontName", false, _fontData.font.family);
                  editor.execCommand("FontSize", false, _fontData.size);
                }
              });

              // Save changes to toolbar items.
              editor.on("ExecCommand", function(args) {
                switch(args.command) {
                  case "FontName":
                    _fontData.font.family = args.value;
                    text.style.fontFamily = args.value;

                    break;
                  case "FontSize":
                    _fontData.size = args.value;
                    text.style.fontSize = args.value;

                    break;
                  case "JustifyLeft":
                    _fontData.align = "left";
                    textContainer.style.textAlign = "left";

                    break;
                  case "JustifyCenter":
                    _fontData.align = "center";
                    textContainer.style.textAlign = "center";

                    break;
                  case "JustifyRight":
                    _fontData.align = "right";
                    textContainer.style.textAlign = "right";

                    break;
                  case "JustifyFull":
                    _fontData.align = "justify";
                    textContainer.style.textAlign = "justify";

                    break;
                  case "forecolor":
                    _fontData.color = args.value;
                    text.style.color = args.value;

                    break;
                  case "hilitecolor":
                    _fontData.highlightColor = args.value;
                    text.style.backgroundColor = args.value;

                    break;
                  case "Bold":
                    text.style.fontWeight = _fontData.bold ? "bold" : "normal";

                    break;
                  case "mceToggleFormat":
                    if (args.value === "bold") {
                      _fontData.bold = !_fontData.bold;
                      text.style.fontWeight = _fontData.bold ? "bold" : "normal";

                      toggleButton($bold);
                    }
                    else if (args.value === "italic") {
                      _fontData.italic = !_fontData.italic;
                      text.style.fontStyle = _fontData.italic ? "italic" : "normal";

                      toggleButton($italic);
                    }
                    else if (args.value === "underline") {
                      _fontData.underline = !_fontData.underline;
                      text.style.textDecoration = _fontData.underline ? "underline" : "none";

                      toggleButton($underline);
                    }

                    break;
                  default:
                    break;
                }
              });
            },
            init_instance_callback: function(editor) {
              var oldApply = editor.formatter.apply;

              // Reference - http://goo.gl/55IhWI
              editor.formatter.apply = function apply(name, vars, node) {
                var args = {
                  command: name,
                  value: vars.value
                };

                oldApply(name, vars, node);
                editor.fire("ExecCommand", args);
              };
            }
          };

          if (typeof attrs.hideAlignment === "undefined" || attrs.hideAlignment !== "true") {
            $scope.defaultFont.align = "left";
          }

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

              if ($scope.previewText) {
                $scope.$watch("fontData", updatePreview, true);
              }

              _fontData = fontData;
            }
          });

          function toggleButton($btn) {
            $btn.toggleClass("mce-active");
          }

          function updatePreview(fontData) {
            var textContainer = document.querySelector(".text-container"),
              text = document.querySelector(".text");

            if ($scope.previewText && fontData) {
              text.style.fontFamily = fontData.font.family;
              text.style.fontSize = fontData.size;
              text.style.fontWeight = fontData.bold ? "bold" : "normal";
              text.style.fontStyle = fontData.italic ? "italic" : "normal";
              text.style.textDecoration = fontData.underline ? "underline" : "none";
              text.style.color = fontData.color;
              text.style.backgroundColor = fontData.highlightColor;
              textContainer.style.textAlign = fontData.align;
            }
          }
        }
      };
    }]);
}());

(function(module) {
try { module = angular.module("risevision.widget.common.font-setting"); }
catch(err) { module = angular.module("risevision.widget.common.font-setting", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("_angular/font-setting/font-setting.html",
    "<div class=\"font-setting\">\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <textarea ui-tinymce=\"tinymceOptions\" ng-model=\"tinymceModel\" ng-if=\"tinymceOptions\"></textarea>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"row\" ng-if=\"previewText\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <div class=\"text-container form-group\">\n" +
    "        <span class=\"text\">{{previewText}}</span>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);
})();
