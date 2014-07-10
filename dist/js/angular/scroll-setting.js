angular.module("risevision.widget.common.scrollSetting", [])
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
          enabled: false,
          //direction: "up",
          by: "continuous",
          speed: "medium",
          resumes: "5"
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
VIEWS['scroll-setting/scroll-setting.html'] = "<!--\n" +
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-3\">\n" +
    "    <div class=\"form-group\">\n" +
    "      <label for=\"scroll.direction\">{{'scroll.direction.label' | translate}}</label>\n" +
    "      <select id=\"scroll.direction\" ng-model=\"scroll.direction\" class=\"form-control\">\n" +
    "        <option value=\"none\">{{'scroll.direction.none' | translate}}</option>\n" +
    "        <option value=\"up\">{{'scroll.direction.up' | translate}}</option>\n" +
    "        <!--<option value=\"down\">{{'scroll.direction.down' | translate}}</option>->\n" +
    "      </select>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "-->\n" +
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-3\">\n" +
    "    <div class=\"checkbox\">\n" +
    "      <label for=\"scroll-enabled\">{{'scroll.enabled' | translate}}</label>\n" +
    "      <input id=\"scroll-enabled\" type=\"checkbox\" ng-model=\"scroll.enabled\">\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<div ng-show=\"scroll.enabled\" class=\"more-scroll-options\">\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-xs-6 col-md-4\">\n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"scroll.by\">{{'scroll.by.label' | translate}}</label>\n" +
    "        <select id=\"scroll.by\" ng-model=\"scroll.by\" class=\"form-control\">\n" +
    "          <option value=\"continuous\">{{'scroll.by.continuous' | translate}}</option>\n" +
    "          <!--<option value=\"item\">{{'scroll.by.item' | translate}}Row</option>-->\n" +
    "          <option value=\"page\">{{'scroll.by.page' | translate}}</option>\n" +
    "        </select>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <!--\n" +
    "  <div class=\"row\" ng-show=\"scrollBy != 'continuous'\">\n" +
    "    <div class=\"col-md-3\">\n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"scroll.hold\">{{'scroll.hold' | translate}}</label>\n" +
    "        <input id=\"scroll.hold\" type=\"text\" class=\"form-control\" value=\"10\" />\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "-->\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-xs-6 col-md-4\">\n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"scroll.speed\">{{'scroll.speed.label' | translate}}</label>\n" +
    "        <select id=\"scroll.speed\" ng-model=\"scroll.speed\" class=\"form-control\">\n" +
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
    "        <label for=\"scroll.resumes\">\n" +
    "          {{'scroll.resumes' | translate}}\n" +
    "        </label>\n" +
    "        <input id=\"scroll.resumes\" type=\"text\" ng-model=\"scroll.resumes\" class=\"form-control\" />\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<hr>\n" +
    ""; 