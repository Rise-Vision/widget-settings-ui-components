/* global WIDGET_SETTINGS_UI_CONFIG */
(function () {
  "use strict";

  angular.module("risevision.widget.common.font-setting", [
      "angularLoad",
      "ui.tinymce",
      "risevision.common.i18n",
      "risevision.widget.common.url-field"
    ])
    .directive("fontSetting", ["$templateCache", "$log", "googleFontLoader",
    function ($templateCache, $log, googleFontLoader) {
      return {
        restrict: "AE",
        scope: {
          fontData: "=",
          previewText: "@"
        },
        template: $templateCache.get("_angular/font-setting/font-setting.html"),
        transclude: false,
        link: function ($scope, element) {
          var $element = $(element),
            $customFont = $element.find(".custom-font"),
            _isLoading = true,
            _googleFontList = "";

          $scope.defaultFont = {
            font: {
              family: "verdana,geneva,sans-serif",
              type: "standard",
              url: ""
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

            initTinyMCE();
          });

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
            var family = null;

            if (fontData) {
              $scope.defaults(fontData, $scope.defaultFont);

              // Load custom font.
              if ($scope.fontData.font.url) {
                family = getCustomFontFamily();

                if (family !== null) {
                  loadCustomFont(family);
                }
              }

              updatePreview(fontData);
              watch();

              if ($scope.previewText) {
                $scope.$watch("fontData", updatePreview, true);
              }
            }
          });

          // Initialize TinyMCE.
          function initTinyMCE() {
            $scope.tinymceOptions = {
              font_formats: WIDGET_SETTINGS_UI_CONFIG.families + _googleFontList + "Custom=custom;",
              fontsize_formats: WIDGET_SETTINGS_UI_CONFIG.sizes,
              menubar: false,
              plugins: "textcolor colorpicker",
              /*
               When testing this via local server, CORS will be required. Handy CORS Chrome extension can be found here
               https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?hl=en
               */
              skin_url: "//s3.amazonaws.com/rise-common/styles/tinymce/rise",
              statusbar: false,
              toolbar: "fontselect fontsizeselect | alignleft aligncenter alignright alignjustify | forecolor backcolor | bold italic underline",
              setup: function(editor) {
                editor.on("init", function() {
                  initToolbar(editor);
                  _isLoading = false;
                });

                editor.on("ExecCommand", function(args) {
                  initCommands(editor, args);
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
            if ($scope.fontData) {
              // Font Family
              if ($scope.fontData.font.url) {
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

              // Colors
              $(".mce-colorbutton[aria-label='Text color'] span").css("background-color", $scope.fontData.forecolor);
              $(".mce-colorbutton[aria-label='Background color'] span").css("background-color", $scope.fontData.backcolor);

              // Font Style
              if ($scope.fontData.bold) {
                toggleButton($(".mce-btn[aria-label='Bold']"));
              }

              if ($scope.fontData.italic) {
                toggleButton($(".mce-btn[aria-label='Italic']"));
              }

              if ($scope.fontData.underline) {
                toggleButton($(".mce-btn[aria-label='Underline']"));
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
                $scope.fontData.size = args.value;
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

              case "forecolor":
                $scope.fontData.forecolor = args.value;
                break;

              case "hilitecolor":
                $scope.fontData.backcolor = args.value;
                break;

              case "mceToggleFormat":
                if (args.value === "bold") {
                  $scope.fontData.bold = !$scope.fontData.bold;
                  toggleButton($(".mce-btn[aria-label='Bold']"));
                }
                else if (args.value === "italic") {
                  $scope.fontData.italic = !$scope.fontData.italic;
                  toggleButton($(".mce-btn[aria-label='Italic']"));
                }
                else if (args.value === "underline") {
                  $scope.fontData.underline = !$scope.fontData.underline;
                  toggleButton($(".mce-btn[aria-label='Underline']"));
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

          // Determine what type of font this is (standard or google).
          function getFontType(family) {
            if (WIDGET_SETTINGS_UI_CONFIG.families.indexOf(family) !== -1) {
              return "standard";
            }

            if (_googleFontList.indexOf(family) !== -1) {
              return "google";
            }

            return "custom";
          }

          // Extract font name from font URL.
          function getCustomFontFamily() {
            if ($scope.fontData.font.url) {
              return $scope.fontData.font.url.split("/").pop().split(".")[0];
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
        }
      };
    }]);
}());

(function () {
  "use strict";

  angular.module("risevision.widget.common.font-setting")
    .factory("googleFontLoader", ["$http", "angularLoad", function($http, angularLoad) {

    var fontsApi = "https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBXxVK_IOV7LNQMuVVo_l7ZvN53ejN86zY",
      fontBaseUrl = "//fonts.googleapis.com/css?family=",
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
    "\n" +
    "  <!-- Custom Font -->\n" +
    "  <div class=\"custom-font modal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\" data-backdrop=\"false\">\n" +
    "    <div class=\"modal-dialog\">\n" +
    "      <div class=\"modal-content\">\n" +
    "\n" +
    "        <div class=\"modal-header\">\n" +
    "          <button type=\"button\" class=\"close\" data-dismiss=\"modal\">\n" +
    "            <i class=\"fa fa-times half-top\"></i>\n" +
    "          </button>\n" +
    "          <h2 class=\"modal-title\">{{\"font-setting.custom-font\" | translate}}</h2>\n" +
    "        </div>\n" +
    "\n" +
    "        <form role=\"form\" name=\"customFontForm\">\n" +
    "          <div class=\"modal-body\">\n" +
    "            <url-field url=\"fontData.font.url\" ng-model=\"customFont\"></url-field>\n" +
    "          </div>\n" +
    "\n" +
    "          <div class=\"modal-footer\">\n" +
    "            <button type=\"button\" class=\"select btn btn-primary btn-fixed-width\" ng-click=\"applyCustomFont()\" ng-disabled=\"customFontForm.$invalid\">\n" +
    "              <span>{{\"common.select\" | translate}}</span>\n" +
    "              <i class=\"fa fa-white fa-check icon-right\"></i>\n" +
    "            </button>\n" +
    "            <button type=\"button\" class=\"cancel btn btn-default btn-fixed-width\" data-dismiss=\"modal\">\n" +
    "              <span>{{\"common.cancel\" | translate}}</span>\n" +
    "              <i class=\"fa fa-white fa-times icon-right\"></i>\n" +
    "            </button>\n" +
    "          </div>\n" +
    "        </form>\n" +
    "\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);
})();
