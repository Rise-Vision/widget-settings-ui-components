(function () {
  "use strict";

  angular.module("risevision.widget.common.color-picker", ["risevision.widget.common.translate"])
    .directive("colorPicker", ["i18nLoader", function (i18nLoader) {
      return {
        restrict: "A",
        scope: {
          color: "=",
          type: "@"
        },
        transclude: false,
        link: function ($scope, elem) {
          var $elem = $(elem);

          $scope.type = $scope.type ? $scope.type : "background";

          function onChange(color) {
            $scope.$apply(function() {
              $scope.color = color.toRgbString();
            });
          }

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
                    preferredFormat: "rgb",
                    showAlpha: true,
                    showInput: true,
                    type: $scope.type,
                    change: onChange
                  };

                  $elem.spectrum(options);
                });
              }
            }
          });
        }
      };
    }]);
}());
