(function () {
  "use strict";

  angular.module("risevision.widget.common.video-setting", ["risevision.widget.common.translate"])
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
            volume: 50,
            loop: true,
            autohide: true
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
    "  <div class=\"checkbox\">\n" +
    "    <label>\n" +
    "      <input name=\"video-autoplay\" type=\"checkbox\" ng-model=\"video.autoplay\"> {{\"video.autoplay.label\" | translate}}\n" +
    "    </label>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label>{{\"video.volume.label\" | translate}}</label>\n" +
    "    <div>\n" +
    "      <slider orientation=\"horizontal\" handle=\"round\" ng-model=\"video.volume\" min=\"0\" step=\"1\" max=\"100\"></slider>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"checkbox\">\n" +
    "    <label>\n" +
    "      <input name=\"video-loop\" type=\"checkbox\" ng-model=\"video.loop\"> {{\"video.loop.label\" | translate}}\n" +
    "    </label>\n" +
    "  </div>\n" +
    "  <div class=\"checkbox\">\n" +
    "    <label>\n" +
    "      <input name=\"video-autohide\" type=\"checkbox\" ng-model=\"video.autohide\"> {{\"video.autohide.label\" | translate}}\n" +
    "    </label>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);
})();
