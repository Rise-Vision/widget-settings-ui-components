(function () {
  "use strict";

  angular.module("risevision.widget.common.subscription-status.service")
    // $http service mock responds to subscription-status service requests
    .service("$http", ["$q", "$log", function ($q, $log) {
      this.get = function(url) {
        var deferred = $q.defer();

        var response = {
          "data": [{
            "pc":"b0cba08a4baa0c62b8cdc621b6f6a124f89a03db",
            "status":"",
            "expiry":null
          }]
        };

        $log.debug(url);

        if (url && url.indexOf("/company/abc123/") !== -1) {
          response.data[0].status = "Subscribed";
          response.data[0].statusCode = "subscribed";
          response.data[0].subscribed = true;
        }
        else if (url && url.indexOf("/company/def456/") !== -1) {
          response.data[0].status = "Trial Expired";
          response.data[0].statusCode = "trial-expired";
          response.data[0].subscribed = false;
        }

        deferred.resolve(response);

        return deferred.promise;
      };
    }]);

  try {
    angular.module("pascalprecht.translate");
  }
  catch(err) {
    angular.module("pascalprecht.translate", []);
  }

  angular.module("pascalprecht.translate").factory("$translateStaticFilesLoader", [
    "$q",
    function ($q) {
      return function() {
        var deferred = $q.defer();

        deferred.resolve("{}");

        return deferred.promise;
      };
    }
  ]);

}());
