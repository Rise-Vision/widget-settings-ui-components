(function () {
  "use strict";

  angular.module("risevision.widget.common.video-setting", [
    "risevision.common.i18n",
    "ui.bootstrap-slider"
  ])
    .directive("videoSetting", ["$templateCache", "$log", function ($templateCache/*, $log*/) {
      return {
        restrict: "E",
        scope: {
          video: "="
        },
        template: $templateCache.get("_angular/video-setting/video-setting.html"),
        link: function ($scope) {
          $scope.defaultSetting = {
            autoplay: true,
            volume: 50
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

          $scope.$watch("video", function(video) {
            $scope.defaults(video, $scope.defaultSetting);
          });

        }
      };
    }]);
}());
