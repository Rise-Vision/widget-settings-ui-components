angular.module("risevision.widget.common")
  .directive("urlField", ["$log", function ($log) {
    return {
      restrict: "E",
      scope: {
        url: "="
      },
      link: function (scope, $element, attrs) {
        var urlField;

        //initialize only if not yet initialized
        if(!$element.data("plugin_urlField")) {
          $element.urlField({
            url : attrs.url || "http://"
          });

          urlField = $element.data("plugin_urlField");
        }

        scope.$watch("url", function (url) {
          if (url) {
            urlField.setUrl(url);
          }
        });

        scope.$on("collectAdditionalParams", function () {
          $log.debug("Collecting params from", attrs.id);
          if (urlField.validateUrl()) {
            scope.url = urlField.getUrl();
          }
        });
      }
    };
  }]);
