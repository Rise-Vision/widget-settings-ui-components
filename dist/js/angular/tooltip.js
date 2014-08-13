(function () {
  "use strict";

  angular.module("risevision.widget.common.tooltip", [])
    .directive("tooltip", ["$templateCache", function ($templateCache) {
      return {
        restrict: "E",
        scope: {
          align: "="
        },
        template: $templateCache.get("_angular/tooltip/tooltip.html"),
        transclude: false,
        link: function ($scope, element) {
          var $element = $(element);

          $element.popover({trigger: "click"});
        }
      };
    }]);
}());

(function(module) {
try { app = angular.module("risevision.widget.common.tooltip"); }
catch(err) { app = angular.module("risevision.widget.common.tooltip", []); }
app.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("_angular/tooltip/tooltip.html",
    "<button type=\"button\"\n" +
    "	class=\"btn btn-link btn-help\">\n" +
    "	<span class=\"glyphicons circle_question_mark\"></span>\n" +
    "</button>\n" +
    "");
}]);
})();
