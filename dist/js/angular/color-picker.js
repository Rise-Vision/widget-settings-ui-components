(function () {
  "use strict";

  angular.module("risevision.widget.common.color-picker", ["risevision.widget.common.translate"])
    .directive("colorPicker", ["i18nLoader", function (i18nLoader) {
      return {
        restrict: "A",
        scope: {
          color: "="
        },
        transclude: false,
        link: function ($scope, elem) {
          var $elem = $(elem);

          $scope.$watch("color", function(color) {
            if (color) {
              if ($elem.next().hasClass(".sp-replacer.sp-light")) {
                $elem.spectrum("set", color);
              }
              else {
                i18nLoader.get().then(function () {
                  var options = {
                    cancelText: "Cancel",
                    chooseText: "Apply",
                    color: color,
                    preferredFormat: "hex",
                    showAlpha: true,
                    showInput: true,
                    type: "background",
                  };

                  $elem.spectrum(options);
                });
              }
            }
          });

          $scope.$on("collectAdditionalParams", function () {
            $scope.color = $elem.spectrum("get").toHexString();
          });
        }
      };
    }]);
}());
