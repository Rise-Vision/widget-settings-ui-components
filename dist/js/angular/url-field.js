(function () {
  "use strict";

  angular.module("risevision.widget.common.url-field", [
    "risevision.common.i18n",
    "risevision.widget.common.tooltip",
    "risevision.widget.common.storage-selector"
  ])
    .directive("urlField", ["$templateCache", "$log", function ($templateCache, $log) {
      return {
        restrict: "E",
        require: "?ngModel",
        scope: {
          url: "=",
          hideLabel: "@",
          hideStorage: "@",
          companyId: "@"
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
          // A flag to set if the user turned off validation
          scope.forcedValid = false;
          // Validation state
          scope.valid = true;

          scope.allowInitEmpty = (typeof attrs.initEmpty !== "undefined") ? true : false;

          if (!scope.hideStorage) {
            scope.$on("picked", function (event, data) {
              scope.url = data[0];
            });
          }

          scope.blur = function() {
            scope.$emit("urlFieldBlur");
          };

          scope.$watch("url", function (url) {
            if (typeof url !== "undefined" && url !== null) {

              if (url !== "" && scope.allowInitEmpty) {
                // ensure an empty "" value now gets validated
                scope.allowInitEmpty = false;
              }

              if (scope.doValidation && !scope.allowInitEmpty) {
                scope.valid = testUrl(scope.url);
              }
            }
          });

          scope.$watch("valid", function (valid) {
            if (ctrl) {
              $log.info("Calling $setValidity() on parent controller");
              ctrl.$setValidity("valid", valid);
            }
          });

          scope.$watch("doValidation", function (doValidation) {
            if(typeof scope.url !== "undefined") {
              if (doValidation) {
                scope.forcedValid = false;

                if (!scope.allowInitEmpty) {
                  scope.valid = testUrl(scope.url);
                }
              } else {
                scope.forcedValid = true;
                scope.valid = true;
              }
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
    "<div class=\"form-group\" >\n" +
    "  <label ng-if=\"!hideLabel\">{{ \"url.label\" | translate }}</label>\n" +
    "  <div ng-class=\"{'input-group':!hideStorage}\">\n" +
    "    <input name=\"url\" type=\"text\" ng-model=\"url\" ng-blur=\"blur()\" class=\"form-control\" placeholder=\"http://\">\n" +
    "    <span class=\"input-url-addon\" ng-if=\"!hideStorage\"><storage-selector company-id=\"{{companyId}}\"></storage-selector></span>\n" +
    "  </div>\n" +
    "  <p ng-if=\"!valid\" class=\"help-block\">{{ \"url.invalid\" | translate }}</p>\n" +
    "  <div class=\"checkbox\" ng-show=\"forcedValid || !valid\">\n" +
    "    <label>\n" +
    "      <input name=\"validate-url\" ng-click=\"doValidation = !doValidation\" type=\"checkbox\"\n" +
    "             value=\"validate-url\" checked=\"checked\"> {{\"url.validate.label\" | translate}}\n" +
    "    </label>\n" +
    "    <span popover=\"{{'url.validate.tooltip' | translate}}\" popover-trigger=\"click\"\n" +
    "          popover-placement=\"top\" rv-tooltip></span>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);
})();
