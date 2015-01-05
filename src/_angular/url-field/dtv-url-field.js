(function () {
  "use strict";

  angular.module("risevision.widget.common.url-field",
    ["risevision.common.i18n",
    "risevision.widget.common.tooltip",
    "risevision.widget.common.storage-selector"])

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

          function configureStorageUrl(url) {
            /*
             Storage URL is received like so:
             https://www.googleapis.com/download/storage/v1/b/risemedialibrary-[companyid]/o/[file]?&alt=media

             Need it to be:
             https://storage-download.googleapis.com/storage/v1/b/risemedialibrary-[companyid]/o/[file]

             Documentation: https://cloud.google.com/storage/docs/reference-uris
             */

            var base = "https://storage-download.googleapis.com/storage/v1/b/risemedialibrary-",
              file = url.substring(url.indexOf("/o/"), (url.indexOf(".html") + 5));

            return base + scope.companyId + file;
          }

          // By default enforce validation
          scope.doValidation = true;
          // A flag to set if the user turned off validation
          scope.forcedValid = false;
          // Validation state
          scope.valid = true;

          if (!scope.hideStorage) {
            scope.$on("picked", function (event, data) {
              var storageUrl = data[0];

              // if this is an HTML file, the URL needs refactoring to work for an iframe
              if (data[0].indexOf(".html") !== -1) {
                storageUrl = configureStorageUrl(data[0]);
              }

              scope.url = storageUrl;

            });
          }

          scope.$watch("url", function (url) {
            if (url && scope.doValidation) {
              scope.valid = testUrl(scope.url);
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
                scope.valid = testUrl(scope.url);
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
