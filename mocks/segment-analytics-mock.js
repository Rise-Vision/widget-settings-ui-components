(function (angular) {

  "use strict";

  // This mock disables the segment.io tracking script by
  // resetting the API key
  angular.module("risevision.common.components.analytics")
    .value("SEGMENT_API_KEY", null);
})(angular);
