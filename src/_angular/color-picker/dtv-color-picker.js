angular.module("risevision.widget.common")
  .directive("colorPicker", ["i18nLoader", "$log", function (i18nLoader, $log) {
    return {
      restrict: "A",
      scope: {
        color: "="
      },
      transclude: false,
      link: function ($scope, elm) {
        var $elm = $(elm);

        $scope.$watch("color", function(color) {
          if (color) {
            i18nLoader.get().then(function () {
              var options = {
                cancelText: i18n.t("common.buttons.cancel"),
                chooseText: i18n.t("common.buttons.apply"),
                color: color,
                preferredFormat: "hex",
                showAlpha: true,
                showInput: true,
                type: "background",
              };

              $elm.spectrum(options);
            });

            //load i18n text translations after ensuring i18n has been initialized
            // i18nLoader.get().then(function () {$elm.i18n();});
          }
        });

        $scope.$on("collectAdditionalParams", function () {
          $log.debug("Collecting params from", prefix, picker);
          $scope.color = $elm.spectrum("get").toHexString();
        });
      }
    };
  }]);
