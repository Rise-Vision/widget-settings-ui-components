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
            scaleToFit: true,
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

(function(module) {
try { app = angular.module("risevision.widget.common.video-setting"); }
catch(err) { app = angular.module("risevision.widget.common.video-setting", []); }
app.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("_angular/video-setting/video-setting.html",
    "<div class=\"section\">\n" +
    "  <h5>{{\"video.heading\" | translate}}</h5>\n" +
    "  <div class=\"form-group\">\n" +
    "    <div class=\"checkbox\">\n" +
    "      <label>\n" +
    "        <input name=\"video-autoplay\" type=\"checkbox\" ng-model=\"video.autoplay\"> {{\"video.autoplay.label\" | translate}}\n" +
    "      </label>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"checkbox\">\n" +
    "    <label>\n" +
    "      <input name=\"video-scale\" type=\"checkbox\" ng-model=\"video.scaleToFit\"> {{\"widgets.scale-to-fit\" | translate}}\n" +
    "    </label>\n" +
    "  </div>\n" +
    "  <label>{{\"video.volume.label\" | translate}}</label>\n" +
    "  <div>\n" +
    "    <slider orientation=\"horizontal\" handle=\"round\" ng-model=\"video.volume\" min=\"0\" step=\"1\" max=\"100\"></slider>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);
})();
