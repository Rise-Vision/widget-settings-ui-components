angular.module("risevision.widget.common")
  .directive("scrollSetting", ["$log", function ($log) {
    return {
      restrict: "E",
      scope: {
        scroll: "="
      },
      template: VIEWS["scroll-setting/scroll-setting.html"],
      transclude: false,
      link: function($scope, $element) {
        $scope.defaultSetting = {
          by: "none",
          speed: "medium",
          pause: "5"
        };

        $scope.defaults = function(obj) {
          if (obj) {
            for (var i = 1, length = arguments.length; i < length; i++) {
              var source = arguments[i];
              for (var prop in source) {
                if (obj[prop] === void 0) obj[prop] = source[prop];
              }
            }
          }
          return obj;
        };

        $scope.$watch("scroll", function(scroll) {
          $scope.defaults(scroll, $scope.defaultSetting);
        });
      }
    };
  }]);

if(typeof VIEWS === 'undefined') {var VIEWS = {};}
VIEWS['scroll-setting/scroll-setting.html'] = "<div class=\"row\">\n" +
    "  <div class=\"col-md-3\">\n" +
    "    <div class=\"form-group\">\n" +
    "      <label for=\"scroll-enabled\">{{'scroll.by.label' | translate}}</label>\n" +
    "      <div class=\"radio\">\n" +
    "        <label for=\"scroll-by-none\">{{'scroll.by.none' | translate}}</label>\n" +
    "        <input type=\"radio\" id=\"scroll-by-none\" name=\"scroll-by\" ng-model=\"scroll.by\" value=\"none\">\n" +
    "      </div>\n" +
    "      <div class=\"radio\">\n" +
    "        <label for=\"scroll-by-continuous\">{{'scroll.by.continuous' | translate}}</label>\n" +
    "        <input type=\"radio\" id=\"scroll-by-continuous\" name=\"scroll-by\" ng-model=\"scroll.by\" value=\"continuous\">\n" +
    "      </div>\n" +
    "      <div class=\"radio\">\n" +
    "        <label for=\"scroll-by-page\">{{'scroll.by.page' | translate}}</label>\n" +
    "        <input type=\"radio\" id=\"scroll-by-page\" name=\"scroll-by\" ng-model=\"scroll.by\" value=\"page\">\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<div ng-show=\"scroll.by != 'none'\" class=\"more-scroll-options\">\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-xs-6 col-md-4\">\n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"scroll-speed\">{{'scroll.speed.label' | translate}}</label>\n" +
    "        <select id=\"scroll-speed\" ng-model=\"scroll.speed\" class=\"form-control\">\n" +
    "          <option value=\"slowest\">{{'scroll.speed.slowest' | translate}}</option>\n" +
    "          <option value=\"slow\">{{'scroll.speed.slow' | translate}}</option>\n" +
    "          <option value=\"medium\">{{'scroll.speed.medium' | translate}}</option>\n" +
    "          <option value=\"fast\">{{'scroll.speed.fast' | translate}}</option>\n" +
    "          <option value=\"fastest\">{{'scroll.speed.fastest' | translate}}</option>\n" +
    "        </select>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-xs-6 col-md-4\">\n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"scroll-pause\">\n" +
    "          {{'scroll.pause.label' | translate}}\n" +
    "        </label>\n" +
    "        <tooltip data-toggle=\"popover\" data-placement=\"right\"\n" +
    "          data-content=\"{{'scroll.pause.tooltip' | translate}}\">\n" +
    "        </tooltip>\n" +
    "        <input id=\"scroll-pause\" type=\"text\" ng-model=\"scroll.pause\" class=\"form-control\" />\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<hr>\n" +
    ""; 