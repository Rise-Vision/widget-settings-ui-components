/* global VIEWS */
(function () {
  "use strict";

  angular.module("risevision.widget.common.tooltip", [])
    .directive("tooltip", function () {
      return {
        restrict: "E",
        scope: {
          align: "="
        },
        template: VIEWS["tooltip/tooltip.html"],
        transclude: false,
        link: function ($scope, element) {
          var $element = $(element);

          $element.popover({trigger: "click"});
        }
      };
    });
}());

if(typeof VIEWS === 'undefined') {var VIEWS = {};}
VIEWS['tooltip/tooltip.html'] = "<button type=\"button\"\n" +
    "	class=\"btn btn-link btn-help\">\n" +
    "	<span class=\"glyphicons circle_question_mark\"></span>\n" +
    "</button>\n" +
    ""; 