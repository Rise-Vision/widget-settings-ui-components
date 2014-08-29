(function () {
  "use strict";

  angular.module("risevision.widget.common.url-field",
    ["risevision.widget.common.translate", "risevision.widget.common.tooltip"])

    .directive("urlField", ["$templateCache", "$log", function ($templateCache, $log) {
      return {
        restrict: "E",
        require: "?ngModel",
        scope: {
          url: "="
        },
        template: $templateCache.get("_angular/url-field/url-field.html"),
        link: function (scope, element, attrs, ctrl) {

          function testUrl(value) {
            var urlRegExp;

            /*
             Discussion
             http://stackoverflow.com/questions/37684/how-to-replace-plain-urls-with-links#21925491

             Using
             https://gist.github.com/dperini/729294
             Reasoning
             http://mathiasbynens.be/demo/url-regex */

            /* jshint ignore:start */
            urlRegExp = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i;
            /* jshint ignore:end */

            // Add http:// if no protocol parameter exists
            if (value.indexOf("://") === -1) {
              value = "http://" + value;
            }

            return urlRegExp.test(value);
          }

          // By default enforce validation
          scope.doValidation = true;
          // A count of fails to correspond with template on showing validate checkbox
          scope.failCount = 0;
          // Validation state
          scope.valid = true;

          scope.$watch("url", function (url) {
            if (url && scope.doValidation) {
              scope.valid = testUrl(scope.url);
            }
          });

          scope.$watch("valid", function (valid) {
            if (!valid) {
              scope.failCount += 1;
            }

            if (ctrl) {
              $log.info("Calling $setValidity() on parent controller");
              ctrl.$setValidity("valid", valid);
            }
          });

          scope.$watch("doValidation", function (doValidation) {
            if (doValidation && typeof scope.url !== "undefined" ) {
              scope.valid = testUrl(scope.url);
            } else {
              scope.valid = true;
            }
          });
        }
      };
    }]);
}());

(function(module) {
try { app = angular.module("risevision.widget.common.url-field"); }
catch(err) { app = angular.module("risevision.widget.common.url-field", []); }
app.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("_angular/url-field/url-field.html",
    "<div class=\"form-group\" ng-show=\"failCount > 0\">\n" +
    "  <div class=\"checkbox\">\n" +
    "    <label>\n" +
    "      <input name=\"validate-url\" ng-click=\"doValidation = !doValidation\" type=\"checkbox\"\n" +
    "             value=\"validate-url\" checked=\"checked\"> {{\"url.validate\" | translate}}\n" +
    "    </label>\n" +
    "    <span popover=\"{{'url.validate.tooltip' | translate}}\" popover-trigger=\"click\"\n" +
    "          popover-placement=\"top\" rv-tooltip></span>\n" +
    "  </div>\n" +
    "  <div ng-if=\"!valid\">\n" +
    "    <span class=\"text-danger\">{{ \"url.invalid\" | translate }}</span>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "  <label>{{ \"url.label\" | translate }}</label>\n" +
    "  <input name=\"url\" type=\"text\" ng-model=\"url\" class=\"form-control\" placeholder=\"http://\">\n" +
    "</div>\n" +
    "");
}]);
})();
