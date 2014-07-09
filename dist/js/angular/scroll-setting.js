angular.module("risevision.widget.common")
  .directive("scrollSetting", ["i18nLoader", "$log", function (i18nLoader, $log) {
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
    "      <label for=\"scroll.direction\" data-i18n=\"scroll.direction.label\">\n" +
    "        {{'scroll.direction.label' | translate}}\n" +
    "      </label>\n" +
    "      <select id=\"scroll.direction\" name=\"scroll.direction\" ng-model=\"scroll.direction\" class=\"form-control\">\n" +
    "        <option value=\"none\" data-i18n=\"scroll.direction.none\">{{'scroll.direction.none' | translate}}</option>\n" +
    "        <option value=\"up\" data-i18n=\"scroll.direction.up\">{{'scroll.direction.up' | translate}}</option>\n" +
    "        <!--<option value=\"down\" data-i18n=\"scroll.direction.down\">{{'scroll.direction.down' | translate}}</option>->\n" +
    "      </select>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "-->\n" +
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-3\">\n" +
    "    <div class=\"checkbox\">\n" +
    "      <label for=\"scroll-enabled\" data-i18n=\"scroll.enabled\">{{'scroll.enabled' | translate}}</label>\n" +
    "      <input id=\"scroll-enabled\" name=\"scroll-enabled\" type=\"checkbox\" ng-model=\"scroll.enabled\">\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<div ng-show=\"scroll.enabled\">\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-xs-6 col-md-4\">\n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"scroll.by\" data-i18n=\"scroll.by.label\">\n" +
    "          {{'scroll.by.label' | translate}}\n" +
    "        </label>\n" +
    "        <select id=\"scroll.by\" name=\"scroll.by\" ng-model=\"scroll.by\" class=\"form-control\">\n" +
    "          <option value=\"continuous\" data-i18n=\"scroll.by.continuous\">{{'scroll.by.continuous' | translate}}</option>\n" +
    "          <!--<option value=\"item\" data-i18n=\"scroll.by.item\">{{'scroll.by.item' | translate}}Row</option>-->\n" +
    "          <option value=\"page\" data-i18n=\"scroll.by.page\">{{'scroll.by.page' | translate}}</option>\n" +
    "        </select>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <!--\n" +
    "  <div class=\"row\" ng-show=\"scrollBy != 'continuous'\">\n" +
    "    <div class=\"col-md-3\">\n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"scroll.hold\" data-i18n=\"scroll.hold\">\n" +
    "          {{'scroll.hold' | translate}}\n" +
    "        </label>\n" +
    "        <input id=\"scroll.hold\" name=\"scroll.hold\" type=\"text\" class=\"text-field form-control\" value=\"10\" />\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "-->\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-xs-6 col-md-4\">\n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"scroll.speed\" data-i18n=\"scroll.speed\">\n" +
    "          {{'scroll.speed.label' | translate}}\n" +
    "        </label>\n" +
    "        <select id=\"scroll.speed\" name=\"scroll.speed\" ng-model=\"scroll.speed\" class=\"form-control\">\n" +
    "          <option value=\"slowest\" data-i18n=\"scroll.speed.slowest\">{{'scroll.speed.slowest' | translate}}</option>\n" +
    "          <option value=\"slow\" data-i18n=\"scroll.speed.slow\">{{'scroll.speed.slow' | translate}}</option>\n" +
    "          <option value=\"medium\" data-i18n=\"scroll.speed.medium\">{{'scroll.speed.medium' | translate}}</option>\n" +
    "          <option value=\"fast\" data-i18n=\"scroll.speed.fast\">{{'scroll.speed.fast' | translate}}</option>\n" +
    "          <option value=\"fastest\" data-i18n=\"scroll.speed.fastest\">{{'scroll.speed.fastest' | translate}}</option>\n" +
    "        </select>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-xs-6 col-md-4\">\n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"scroll.resumes\" data-i18n=\"scroll.resumes\">\n" +
    "          {{'scroll.resumes' | translate}}\n" +
    "        </label>\n" +
    "        <input id=\"scroll.resumes\" name=\"scroll.resumes\" type=\"text\" ng-model=\"scroll.resumes\" class=\"form-control\" />\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<hr>\n" +
    ""; 