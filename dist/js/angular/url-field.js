(function () {
  "use strict";

  angular.module("risevision.widget.common.url-field", [
    "risevision.common.i18n",
    "risevision.widget.common.tooltip"
  ])
    .directive("urlField", ["$templateCache", "$log", "$http", function ($templateCache, $log, $http) {
      return {
        restrict: "E",
        require: "?ngModel",
        scope: {
          url: "=",
          hideLabel: "@",
          fileType: "@"
        },
        template: $templateCache.get("_angular/url-field/url-field.html"),
        link: function (scope, element, attrs, ctrl) {

          function isSecureUrl( url ) {
            return !!( url && url.startsWith( "https://" ) );
          }

          function hasValidExtension(url, fileType) {
            var testUrl = url.toLowerCase(),
              extensions;

            switch(fileType) {
              case "image":
                extensions = [".jpg", ".jpeg", ".png", ".bmp", ".svg", ".gif", ".webp"];
                break;
              case "video":
                extensions = [".webm", ".mp4", ".ogv", ".ogg"];
                break;
              default:
                extensions = [];
            }

            for (var i = 0, len = extensions.length; i < len; i++) {
              if (testUrl.indexOf(extensions[i]) !== -1) {
                return true;
              }
            }

            return false;
          }

          // Check that the URL points to a valid image file.
          function testImage() {
            if ((scope.fileType !== "undefined") && (scope.url !== "undefined")) {
              if (scope.fileType === "image") {
                var image = new Image();

                image.onload = function() {
                  scope.valid = true;
                  scope.$apply();
                };

                image.onerror = function() {
                  scope.valid = false;
                  scope.invalidType = "load-fail";
                  scope.$apply();
                };

                image.src = scope.url;
              }
            }
          }

          function testVideo() {
            $http({
              method: "HEAD",
              url: "https://proxy.risevision.com/" + scope.url
            }).then(function successCallback() {
              scope.valid = true;
            }, function errorCallback() {
              scope.valid = false;
              scope.invalidType = "load-fail";
            });
          }

          function testUrl(value) {
            var urlRegExp,
              isValid;

            /*
             Discussion
             http://stackoverflow.com/questions/37684/how-to-replace-plain-urls-with-links#21925491

             Using
             https://gist.github.com/dperini/729294
             Reasoning
             http://mathiasbynens.be/demo/url-regex */

            urlRegExp = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i; // jshint ignore:line

            // Add https:// if no protocol parameter exists
            if (value.indexOf("://") === -1) {
              value = "https://" + value;
            }

            isValid = urlRegExp.test(value);

            if (isValid && typeof scope.fileType !== "undefined") {
              isValid = hasValidExtension(value, scope.fileType);
              if (!isValid) {
                scope.invalidType = scope.fileType;
              }
            } else {
              scope.invalidType = "url";
            }

            if (isValid) {
              if (isSecureUrl(value)) {
                if (scope.fileType === "image") {
                  testImage();
                } else if (scope.fileType === "video") {
                  testVideo();
                }
              } else {
                isValid = false;
                scope.invalidType = "insecure";
              }
            }

            return isValid;
          }

          // By default enforce validation
          scope.doValidation = true;
          // A flag to set if the user turned off validation
          scope.forcedValid = false;
          // Validation state
          scope.valid = true;

          scope.invalidType = "url";

          scope.allowInitEmpty = (typeof attrs.initEmpty !== "undefined");

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
try { module = angular.module("risevision.widget.common.url-field"); }
catch(err) { module = angular.module("risevision.widget.common.url-field", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("_angular/url-field/url-field.html",
    "<div class=\"form-group\" >\n" +
    "  <label ng-if=\"!hideLabel\">{{ \"url.label\" | translate }}</label>\n" +
    "  <div>\n" +
    "    <input name=\"url\" type=\"text\" ng-model=\"url\" ng-blur=\"blur()\" class=\"form-control\" placeholder=\"https://\">\n" +
    "  </div>\n" +
    "  <p ng-if=\"!valid && invalidType === 'url'\" class=\"text-danger\">{{ \"url.errors.url\" | translate }}</p>\n" +
    "  <p ng-if=\"!valid && invalidType === 'image'\" class=\"text-danger\">{{ \"url.errors.image\" | translate }}</p>\n" +
    "  <p ng-if=\"!valid && invalidType === 'video'\" class=\"text-danger\">{{ \"url.errors.video\" | translate }}</p>\n" +
    "  <p ng-if=\"!valid && invalidType === 'insecure'\" class=\"text-danger\">We can't show this content because the URL is insecure. Make sure the URL begins with \"HTTPS\". If you need assistance, please email <a target=\"_blank\" href=\"mailto:support@risevision.com\">support@risevision.com</a>.</p>\n" +
    "  <p ng-if=\"!valid && invalidType === 'load-fail'\" class=\"text-danger\">The file could not be found using the URL provided. Please enter a different one. If you need help email <a href=\"mailto:support@risevision.com\">support@risevision.com</a>.</p>\n" +
    "  <div class=\"checkbox\" ng-show=\"forcedValid || !valid\">\n" +
    "    <label>\n" +
    "      <input name=\"validate-url\" ng-click=\"doValidation = !doValidation\" type=\"checkbox\"\n" +
    "             value=\"validate-url\"> {{\"url.validate.label\" | translate}}\n" +
    "    </label>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);
})();
