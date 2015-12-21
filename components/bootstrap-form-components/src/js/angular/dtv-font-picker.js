angular.module("risevision.widget.common.fontpicker", [])
  .directive("fontPicker", ["$log", function ($log) {
    return {
      restrict: "E",
      scope: {
        font: "="
      },
      template: "<div class='font-picker'></div>",
      link: function ($scope, elm, attrs) {
        var $selectbox, picker;
        var $elm = $(elm).find("div.font-picker");

        //initialize only if not yet initialized
        if(!$elm.data("plugin_fontPicker")) {
          $elm.fontPicker({
            font : attrs.defaultFont || "Verdana",
            blank: false,
            showCustom: true,
            showMore: true
          });

          picker = $elm.data("plugin_fontPicker");
        }

        $scope.$watch("font", function(font) {
          if (font) {
            picker.setFont(font.family);

            if (font.hasOwnProperty("type") && font.type === "custom") {
              picker.addCustomFont(font.family, font.url);
            }
          }
        });

        $selectbox = $elm.find("div.bfh-selectbox");
        $selectbox.bfhselectbox($selectbox.data());

        //load i18n text translations after ensuring i18n has been initialized
        // i18nLoader.get().then(function () {$elm.i18n();});

        $elm.on("standardFontSelected", function(event, font, family) {
          $scope.$apply(function() {
            $scope.font.type = "standard";
            $scope.font.font = font;
            $scope.font.family = family;
            delete $scope.font.url;
          });
        });

        $elm.on("customFontSelected", function(event, family, url) {
          $scope.$apply(function() {
            $scope.font.type = "custom";
            $scope.font.font = family;
            $scope.font.family = family;
            $scope.font.url = url;
          });
        });

        $elm.on("googleFontSelected", function(event, family) {
          $scope.$apply(function() {
            $scope.font.type = "google";
            $scope.font.font = family;
            $scope.font.family = family;
            delete $scope.font.url;
          });
        });
      }
    };
  }]);
