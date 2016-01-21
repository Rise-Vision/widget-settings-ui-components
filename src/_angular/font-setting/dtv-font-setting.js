/* global WIDGET_SETTINGS_UI_CONFIG */
(function () {
  "use strict";

  angular.module("risevision.widget.common.font-setting", ["angularLoad", "ui.tinymce"])
    .directive("fontSetting", ["$templateCache", "$log", "googleFontLoader", function ($templateCache, $log, googleFontLoader) {
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
            family: "verdana,geneva,sans-serif",
            size: "24px",
            bold: false,
            italic: false,
            underline: false,
            forecolor: "black",
            backcolor: "transparent"
          };

          // Load Google fonts.
          googleFontLoader.getFonts().then(function(fonts) {
            initTinyMCE(fonts);
          });

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

          // Initialize TinyMCE.
          function initTinyMCE(families) {
            $scope.tinymceOptions = {
              font_formats: WIDGET_SETTINGS_UI_CONFIG.families + families,
              fontsize_formats: WIDGET_SETTINGS_UI_CONFIG.sizes,
              menubar: false,
              plugins: "textcolor",
              statusbar: false,
              toolbar: "fontselect fontsizeselect | alignleft aligncenter alignright alignjustify | forecolor backcolor | bold italic underline",
              setup: function(editor) {
                editor.on("init", function() {
                  initToolbar(editor);
                });

                editor.on("ExecCommand", function(args) {
                  initCommands(args);
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
          }

          // Initialize TinyMCE toolbar.
          function initToolbar(editor) {
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

              // Colors
              $(".mce-colorbutton[aria-label='Text color'] span").css("background-color", _fontData.forecolor);
              $(".mce-colorbutton[aria-label='Background color'] span").css("background-color", _fontData.backcolor);

              // Font Style
              if (_fontData.bold) {
                toggleButton($(".mce-btn[aria-label='Bold']"));
              }

              if (_fontData.italic) {
                toggleButton($(".mce-btn[aria-label='Italic']"));
              }

              if (_fontData.underline) {
                toggleButton($(".mce-btn[aria-label='Underline']"));
              }

              // These 2 must be last for some reason.
              editor.execCommand("FontName", false, _fontData.family);
              editor.execCommand("FontSize", false, _fontData.size);
            }
          }

          // Handle toolbar interactions.
          function initCommands(args) {
            switch(args.command) {
              case "FontName":
                _fontData.family = args.value;
                break;

              case "FontSize":
                _fontData.size = args.value;
                break;

              case "JustifyLeft":
                _fontData.align = "left";
                break;

              case "JustifyCenter":
                _fontData.align = "center";
                break;

              case "JustifyRight":
                _fontData.align = "right";
                break;

              case "JustifyFull":
                _fontData.align = "justify";
                break;

              case "forecolor":
                _fontData.forecolor = args.value;
                break;

              case "hilitecolor":
                _fontData.backcolor = args.value;
                break;

              case "mceToggleFormat":
                if (args.value === "bold") {
                  _fontData.bold = !_fontData.bold;
                  toggleButton($(".mce-btn[aria-label='Bold']"));
                }
                else if (args.value === "italic") {
                  _fontData.italic = !_fontData.italic;
                  toggleButton($(".mce-btn[aria-label='Italic']"));
                }
                else if (args.value === "underline") {
                  _fontData.underline = !_fontData.underline;
                  toggleButton($(".mce-btn[aria-label='Underline']"));
                }

                break;

              default:
                break;
            }

            updatePreview(_fontData);
          }

          function toggleButton($btn) {
            $btn.toggleClass("mce-active");
          }

          // Style the preview text.
          function updatePreview(fontData) {
            var textContainer = document.querySelector(".text-container"),
              text = document.querySelector(".text");

            if ($scope.previewText && fontData) {
              text.style.fontFamily = fontData.family;
              text.style.fontSize = fontData.size;
              text.style.fontWeight = fontData.bold ? "bold" : "normal";
              text.style.fontStyle = fontData.italic ? "italic" : "normal";
              text.style.textDecoration = fontData.underline ? "underline" : "none";
              text.style.color = fontData.forecolor;
              text.style.backgroundColor = fontData.backcolor;
              textContainer.style.textAlign = fontData.align;
            }
          }
        }
      };
    }]);
}());
