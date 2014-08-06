(function () {
  "use strict";

  angular.module("risevision.widget.common.url-field", [])
    .directive("urlField", function () {
      return {
        restrict: "E",
        scope: {
          url: "="
        },
        link: function (scope, element) {
          var $element = $(element),
            urlField;

          scope.$watch("url", function (url) {

            if (!urlField) {
              if (typeof url !== "string" || url === "") {
                $element.urlField();
              } else {
                $element.urlField({ url: url });
              }
              urlField = $element.data("plugin_urlField");
            } else {
              if (typeof url === "string") {
                urlField.setUrl(url);
              }
            }
          });

          scope.$on("collectAdditionalParams", function () {
            if (urlField.validateUrl()) {
              scope.url = urlField.getUrl();
            }
          });
        }
      };
    });
}());
