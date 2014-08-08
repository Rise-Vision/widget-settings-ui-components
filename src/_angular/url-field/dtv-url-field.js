(function () {
  "use strict";

  angular.module("risevision.widget.common.url-field", ["risevision.widget.common.translate"])
    .directive("urlField", ["$templateCache", function ($templateCache) {
      return {
        restrict: "E",
        scope: {
          url: "="
        },
        template: $templateCache.get("_angular/url-field/url-field.html"),
        link: function (scope, element) {
          var doValidation = true,
            $el = $(element),
            $urlInp = $el.find("input[name='url']"),
            $validateUrlCtn = $el.find("div.validate-url"),
            $validateUrlCB = $el.find("input[name='validate-url']"),
            urlRegExp;

          /* jshint ignore:start */
          urlRegExp = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i;
          /* jshint ignore:end */

          function getUrl() {
            return $.trim($urlInp.val());
          }

          function testUrl(value) {
            // Add http:// if no protocol parameter exists
            if (value.indexOf("://") === -1) {
              value = "http://" + value;
            }
            /*
             Discussion
             http://stackoverflow.com/questions/37684/how-to-replace-plain-urls-
             with-links#21925491

             Using
             https://gist.github.com/dperini/729294
             Reasoning
             http://mathiasbynens.be/demo/url-regex

             */

            return urlRegExp.test(value);
          }

          function setUrl(value) {
            if (typeof value === "string") {
              $urlInp.val(value);
            }
          }

          function validateUrl() {
            if (!doValidation) {
              return true;
            }

            var valid = testUrl(getUrl());
            if (!valid) {
              if (!$validateUrlCtn.is(":visible")) {
                $validateUrlCtn.show();
              }
            }

            return valid;
          }

          scope.$watch("url", function (url) {
            if (typeof url === "string") {
              setUrl(url);
            }
          });

          scope.$on("collectAdditionalParams", function () {
            if (validateUrl()) {
              scope.url = getUrl();
            }
          });

          $validateUrlCB.on("click", function () {
            doValidation = $(this).is(":checked");
          });

          $validateUrlCtn.hide();
        }
      };
    }]);
}());
