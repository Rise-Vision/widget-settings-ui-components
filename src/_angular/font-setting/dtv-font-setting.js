/* global WIDGET_SETTINGS_UI_CONFIG */
(function () {
  "use strict";

  angular.module("risevision.widget.common.font-setting", [
      "angularLoad",
      "ui.tinymce",
      "risevision.common.i18n",
      "risevision.widget.common.url-field"
    ])
    .directive("fontSetting", ["$templateCache", "$log", "$window", "googleFontLoader",
    function ($templateCache, $log, $window, googleFontLoader) {
      return {
        restrict: "AE",
        scope: {
          fontData: "=",
          previewText: "@",
          verticalAlign: "@"
        },
        template: $templateCache.get("_angular/font-setting/font-setting.html"),
        transclude: false,
        link: function ($scope, element) {
          var $element = $(element),
            $customFont = $element.find(".custom-font"),
            $customFontSize = $element.find(".custom-font-size"),
            _isLoading = true;

          $scope.googleFontList = "";

          $scope.defaultFont = {
            font: {
              family: "verdana,geneva,sans-serif",
              type: "standard",
              url: ""
            },
            size: "24px",
            customSize: "",
            align: "left",
            verticalAlign: "middle",
            bold: false,
            italic: false,
            underline: false,
            forecolor: "black",
            backcolor: "transparent"
          };

          // Load Google fonts.
          googleFontLoader.getFonts().then(function(fonts) {
            $scope.googleFontList = fonts;
          });

          $scope.customFontSize = null;

          // Apply custom font to preview text.
          $scope.applyCustomFont = function() {
            var family = getCustomFontFamily();

            if (family !== null) {
              loadCustomFont(family);

              $scope.fontData.font.family = family;
              $scope.fontData.font.type = "custom";

              updatePreview($scope.fontData);
            }

            $customFont.modal("hide");
          };

          $scope.applyCustomFontSize = function() {
            $customFontSize.modal("hide");

            if ($scope.customFontSize !== null && $scope.customFontSize >= 8) {

              if (($scope.customFontSize + "px") !== $scope.fontData.size) {
                $scope.fontData.size = $scope.customFontSize + "px";

                if (WIDGET_SETTINGS_UI_CONFIG.sizes.indexOf($scope.fontData.size) !== -1 ||
                  $scope.fontData.customSize === $scope.fontData.size) {
                  // tell editor to select this size
                  $window.tinymce.activeEditor.execCommand("FontSize", false, $scope.fontData.size);
                }
                else {
                  // new custom font size to add
                  $scope.fontData.customSize = $scope.customFontSize + "px";

                  // update value of font_formats
                  $scope.tinymceOptions.fontsize_formats = "Custom " +
                    (($scope.fontData.customSize !== "") ? $scope.fontData.customSize + " " : "")  +
                    WIDGET_SETTINGS_UI_CONFIG.sizes;
                }
              }

            }

            // reset modal input size value
            $scope.customFontSize = null;
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

          var watch = $scope.$watchGroup(["fontData","googleFontList"], function(newValues) {
            var family = null;
            var fontData = newValues[0];
            var googleFontList = newValues[1];
            if (fontData && googleFontList) {
              $scope.defaults(fontData, $scope.defaultFont);

              // Load custom font.
              if ($scope.fontData.font.url) {
                family = getCustomFontFamily();

                if (family !== null) {
                  loadCustomFont(family);
                }
              }

              updatePreview(fontData);
              initTinyMCE();
              watch();

              if ($scope.previewText) {
                $scope.$watch("fontData", updatePreview, true);
              }
            }
          });

          $scope.$watch("tinymceOptions.fontsize_formats", function (value) {
            if (typeof value !== "undefined" && !_isLoading) {
              // leverage ui-tinymce workaround of refreshing editor
              $scope.$broadcast("$tinymce:refresh");
            }
          });

          // Initialize TinyMCE.
          function initTinyMCE() {
            $scope.tinymceOptions = {
              font_formats: "Use Custom Font=custom;" + WIDGET_SETTINGS_UI_CONFIG.families + $scope.googleFontList,
              fontsize_formats: "Custom " +
                (($scope.fontData.customSize !== "") ? $scope.fontData.customSize + " " : "")  +
                WIDGET_SETTINGS_UI_CONFIG.sizes,
              menubar: false,
              plugins: "textcolor colorpicker",
              /*
               When testing this via local server, CORS will be required. Handy CORS Chrome extension can be found here
               https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?hl=en
               */
              skin_url: "//s3.amazonaws.com/rise-common/styles/tinymce/rise",
              statusbar: false,
              toolbar: "fontselect fontsizeselect | alignleft aligncenter alignright alignjustify" +
              ($scope.verticalAlign ? " aligntop alignmiddle alignbottom" : "") +
              " | forecolor backcolor | bold italic underline",
              setup: function(editor) {
                if ($scope.verticalAlign) {
                  addVerticalAlignButtons(editor);
                }

                editor.on("init", function() {
                  initToolbar(editor);
                  _isLoading = false;
                });

                editor.on("ExecCommand", function(args) {
                  initCommands(editor, args);
                });
              },
              init_instance_callback: function(editor) {
                var oldApply = editor.formatter.apply,
                  oldRemove = editor.formatter.remove;

                // Reference - http://goo.gl/55IhWI
                editor.formatter.apply = function apply(name, vars, node) {
                  var args = {
                    command: name,
                    value: vars.value
                  };

                  oldApply(name, vars, node);
                  editor.fire("ExecCommand", args);
                };

                editor.formatter.remove = function remove(name, vars, node) {
                  var args = {
                    command: name,
                    value: (vars && vars.value) ? vars.value : null
                  };

                  oldRemove(name, vars, node);
                  editor.fire("ExecCommand", args);
                };
              }
            };
          }

          // Initialize TinyMCE toolbar.
          function initToolbar(editor) {
            if ($scope.fontData) {
              // Font Family
              if (($scope.fontData.font.type === "custom") && $scope.fontData.font.url) {
                editor.execCommand("FontName", false, "custom");
              }
              else {
                editor.execCommand("FontName", false, $scope.fontData.font.family);
              }

              // Font Sizes
              editor.execCommand("FontSize", false, $scope.fontData.size);

              // Alignment
              switch($scope.fontData.align) {
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

              // Vertical Alignment
              if ($scope.verticalAlign) {
                editor.execCommand("mceToggleVertical", false, $scope.fontData.verticalAlign);
              }

              // Colors
              $element.find(".mce-colorbutton[aria-label='Text color'] span").css("background-color", $scope.fontData.forecolor);
              $element.find(".mce-colorbutton[aria-label='Background color'] span").css("background-color", $scope.fontData.backcolor);

              // Font Style
              if ($scope.fontData.bold) {
                toggleButton($element.find(".mce-btn[aria-label='Bold']"));
              }

              if ($scope.fontData.italic) {
                toggleButton($element.find(".mce-btn[aria-label='Italic']"));
              }

              if ($scope.fontData.underline) {
                toggleButton($element.find(".mce-btn[aria-label='Underline']"));
              }
            }
          }

          // Handle toolbar interactions.
          function initCommands(editor, args) {
            switch(args.command) {
              case "FontName":
                if (_isLoading) {
                  return;
                }
                else if (args.value === "custom") {
                  $customFont.modal("show");

                  return;
                }
                else {
                  $scope.fontData.font.family = args.value;
                  $scope.fontData.font.type = getFontType(args.value);
                }

                break;

              case "FontSize":
                if (_isLoading) {
                  return;
                }
                else if (args.value === "Custom") {
                  $customFontSize.modal("show");

                  return;
                }
                else {
                  $scope.fontData.size = args.value;
                }

                break;

              case "JustifyLeft":
                $scope.fontData.align = "left";
                break;

              case "JustifyCenter":
                $scope.fontData.align = "center";
                break;

              case "JustifyRight":
                $scope.fontData.align = "right";
                break;

              case "JustifyFull":
                $scope.fontData.align = "justify";
                break;

              case "mceToggleVertical":
                if (args.value) {
                  toggleVerticalButtons(args.value);
                  if ($scope.fontData.verticalAlign !== args.value) {
                    toggleVerticalButtons($scope.fontData.verticalAlign);
                  }
                } else {
                  toggleVerticalButtons($scope.defaultFont.verticalAlign);
                }

                $scope.fontData.verticalAlign = (args.value) ? args.value : $scope.defaultFont.verticalAlign;

                break;

              case "forecolor":
                $scope.fontData.forecolor = (args.value) ? args.value : $scope.defaultFont.forecolor;
                break;

              case "hilitecolor":
                $scope.fontData.backcolor = (args.value) ? args.value : $scope.defaultFont.backcolor;
                break;

              case "mceToggleFormat":
                if (args.value === "bold") {
                  $scope.fontData.bold = !$scope.fontData.bold;
                  toggleButton($element.find(".mce-btn[aria-label='Bold']"));
                }
                else if (args.value === "italic") {
                  $scope.fontData.italic = !$scope.fontData.italic;
                  toggleButton($element.find(".mce-btn[aria-label='Italic']"));
                }
                else if (args.value === "underline") {
                  $scope.fontData.underline = !$scope.fontData.underline;
                  toggleButton($element.find(".mce-btn[aria-label='Underline']"));
                }

                break;
              default:
                break;
            }

            updatePreview($scope.fontData);
          }

          function toggleButton($btn) {
            $btn.toggleClass("mce-active");
          }

          // Style the preview text.
          function updatePreview(fontData) {
            var $textContainer = $element.find(".text-container"),
              $text = $element.find(".text");

            if ($scope.previewText && fontData) {
              $text.css("fontFamily", fontData.font.family);
              $text.css("fontSize", fontData.size);
              $text.css("fontWeight", fontData.bold ? "bold" : "normal");
              $text.css("fontStyle", fontData.italic ? "italic" : "normal");
              $text.css("textDecoration", fontData.underline ? "underline" : "none");
              $text.css("color", fontData.forecolor);
              $text.css("backgroundColor", fontData.backcolor);
              $textContainer.css("textAlign", fontData.align);
            }
          }

          // Determine what type of font this is (standard or google).
          function getFontType(family) {
            if (WIDGET_SETTINGS_UI_CONFIG.families.indexOf(family) !== -1) {
              return "standard";
            }

            if ($scope.googleFontList.indexOf(family) !== -1) {
              return "google";
            }

            return "custom";
          }

          // Extract font name from font URL.
          function getCustomFontFamily() {
            var family = null;

            if ($scope.fontData.font.url) {
              // decode escape sequences to account for spaces in font name
              family = decodeURI($scope.fontData.font.url.trim());
              return family.split("/").pop().split(".")[0];
            }

            return null;
          }

          // Load a custom font.
          function loadCustomFont(family) {
            var sheet = null,
              url = $.trim($scope.fontData.font.url),
              rule = "font-family: " + family + "; " + "src: url('" + url + "');";

            sheet = document.styleSheets[0];

            if (sheet !== null) {
              sheet.addRule("@font-face", rule);
            }
          }

          function addVerticalAlignButtons(editor) {
            editor.addButton("aligntop", {
              image: "//s3.amazonaws.com/Rise-Images/Icons/align-top.svg",
              tooltip: "Align Top",
              onclick: function () {
                editor.execCommand("mceToggleVertical", false, "top");
              }
            });

            editor.addButton("alignmiddle", {
              image: "//s3.amazonaws.com/Rise-Images/Icons/align-vertical-middle.svg",
              tooltip: "Align Middle",
              onclick: function () {
                editor.execCommand("mceToggleVertical", false, "middle");
              }
            });

            editor.addButton("alignbottom", {
              image: "//s3.amazonaws.com/Rise-Images/Icons/align-bottom.svg",
              tooltip: "Align Bottom",
              onclick: function () {
                editor.execCommand("mceToggleVertical", false, "bottom");
              }
            });

            editor.addCommand("mceToggleVertical", function () {});

          }

          function toggleVerticalButtons(value) {
            switch(value) {
              case "top":
                toggleButton($element.find(".mce-btn[aria-label='Align Top']"));
                break;
              case "middle":
                toggleButton($element.find(".mce-btn[aria-label='Align Middle']"));
                break;
              case "bottom":
                toggleButton($element.find(".mce-btn[aria-label='Align Bottom']"));
                break;
              default:
                break;
            }
          }
        }
      };
    }]);
}());
