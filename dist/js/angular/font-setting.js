/* global WIDGET_SETTINGS_UI_CONFIG */
(function () {
  "use strict";

  angular.module("risevision.widget.common.font-setting", ["angularLoad", "ui.tinymce"])
    .directive("fontSetting", ["$templateCache", "$log", "googleFontLoader", function ($templateCache, $log, googleFontLoader) {
      return {
        restrict: "AE",
        scope: {
          fontData: "=",
          previewText: "@"
        },
        template: $templateCache.get("_angular/font-setting/font-setting.html"),
        transclude: false,
        link: function ($scope) {
          var _fontData = null,
            _googleFontList = "";

          $scope.defaultFont = {
            font: {
              family: "verdana,geneva,sans-serif",
              type: "standard"
            },
            size: "24px",
            align: "left",
            bold: false,
            italic: false,
            underline: false,
            forecolor: "black",
            backcolor: "transparent"
          };

          // Load Google fonts.
          googleFontLoader.getFonts().then(function(fonts) {
            _googleFontList = fonts;
            initTinyMCE(fonts);
          });

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
              editor.execCommand("FontName", false, _fontData.font.family);
              editor.execCommand("FontSize", false, _fontData.size);
            }
          }

          // Determine what type of font this is (standard or google)
          function getFontType(family) {
            if (WIDGET_SETTINGS_UI_CONFIG.families.indexOf(family) !== -1) {
              return "standard";
            }

            if (_googleFontList.indexOf(family) !== -1) {
              return "google";
            }

            return "";
          }

          // Handle toolbar interactions.
          function initCommands(args) {
            switch(args.command) {
              case "FontName":
                _fontData.font.family = args.value;
                _fontData.font.type = getFontType(args.value);
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
              text.style.fontFamily = fontData.font.family;
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

(function () {
  "use strict";

  angular.module("risevision.widget.common.font-setting")
    .factory("googleFontLoader", ["$http", "angularLoad", function($http, angularLoad) {

    var fontsApi = "https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBXxVK_IOV7LNQMuVVo_l7ZvN53ejN86zY",
      fontBaseUrl = "http://fonts.googleapis.com/css?family=",
      exclude = ["Buda", "Coda Caption", "Open Sans Condensed", "UnifrakturCook", "Molle"],
      fallback = ",sans-serif;",
      fonts = "",
      factory = {};

    factory.getFonts = function() {
      return $http.get(fontsApi, { cache: true })
        .then(function(response) {
          var family = "";

          if (response.data && response.data.items) {
            for (var i = 0; i < response.data.items.length; i++) {
              family = response.data.items[i].family;

              if (exclude.indexOf(family) === -1) {
                angularLoad.loadCSS(fontBaseUrl + family).then(function() {
                  // Font loaded.
                });

                fonts += family + "=" + family + fallback;
              }
            }
          }

          return fonts;
        });
    };

    return factory;
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
