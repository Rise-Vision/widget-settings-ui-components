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
                  scope.testingFile = false;
                  scope.$apply();
                };

                image.onerror = function() {
                  scope.valid = false;
                  scope.testingFile = false;
                  scope.invalidType = "load-fail";
                  scope.$apply();
                };

                scope.testingFile = true;
                image.src = scope.url;
              }
            }
          }

          function testVideo() {
            scope.testingFile = true;

            $http({
              method: "HEAD",
              url: "https://proxy.risevision.com/" + scope.url
            }).then(function successCallback() {
              scope.valid = true;
              scope.testingFile = false;
            }, function errorCallback() {
              scope.valid = false;
              scope.testingFile = false;
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

            if (!isSecureUrl(value)) {
              isValid = false;
              scope.invalidType = "insecure";
            } else {
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
                if (scope.fileType === "image") {
                  testImage();
                } else if (scope.fileType === "video") {
                  testVideo();
                }
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

          scope.testingFile = false;

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
              } else if (!scope.doValidation && !scope.allowInitEmpty) {
                // enforce https protocol validity no matter if "Remove Validation" checked
                scope.valid = isSecureUrl(scope.url);
                scope.invalidType = !scope.valid ? "insecure" : "url"; // "url" is just a default
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
