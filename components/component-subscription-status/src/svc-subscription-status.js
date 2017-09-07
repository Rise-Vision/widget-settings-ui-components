(function () {
  "use strict";

  angular.module("risevision.widget.common.subscription-status.service",
    ["risevision.common.config",
     "risevision.widget.common.subscription-status.config"])
    .service("subscriptionStatusService", ["$http", "$q", "STORE_SERVER_URL", 
    "PATH_URL", "AUTH_PATH_URL", "PATH_URL_BY_DISPLAY_ID",
    function ($http, $q, STORE_SERVER_URL, PATH_URL, AUTH_PATH_URL, PATH_URL_BY_DISPLAY_ID) {
      var responseType = ["On Trial", "Trial Expired", "Subscribed", "Suspended", "Cancelled", "Free", "Not Subscribed", "Product Not Found", "Company Not Found", "Error"];
      var responseCode = ["on-trial", "trial-expired", "subscribed", "suspended", "cancelled", "free", "not-subscribed", "product-not-found", "company-not-found", "error"];
      var _MS_PER_DAY = 1000 * 60 * 60 * 24;

      // a and b are javascript Date objects
      function dateDiffInDays(a, b) {
        return Math.floor((b.getTime() - a.getTime()) / _MS_PER_DAY);
      }
      
      var checkAuthorizedStatus = function(productCode, companyId) {
        var deferred = $q.defer();

        var url = STORE_SERVER_URL +
          AUTH_PATH_URL.replace("companyId", companyId) +
          productCode;

        $http.get(url).then(function (response) {
          if (response && response.data) {
            deferred.resolve(response.data.authorized);
          }
          else {
            deferred.resolve(false);
          }
        });

        return deferred.promise;
      };
      
      var checkSubscriptionStatus = function(productCode, companyId, displayId) {
        var deferred = $q.defer();

        var url = STORE_SERVER_URL +
          PATH_URL.replace("companyId", companyId) +
          productCode;

        if (displayId) {
          url = STORE_SERVER_URL +
          PATH_URL_BY_DISPLAY_ID.replace("productCode", productCode) +
          displayId;
        }

        $http.get(url).then(function (response) {
          if (response && response.data && response.data.length) {
            var subscriptionStatus = response.data[0];

            subscriptionStatus.plural = "";

            var statusIndex = responseType.indexOf(subscriptionStatus.status);
            
            if(statusIndex >= 0) {
              subscriptionStatus.statusCode = responseCode[statusIndex];
            }
            
            if (subscriptionStatus.status === "") {
              subscriptionStatus.status = "N/A";
              subscriptionStatus.statusCode = "na";
              subscriptionStatus.subscribed = false;
            }
            else if (subscriptionStatus.status === responseType[0] ||
              subscriptionStatus.status === responseType[2] ||
              subscriptionStatus.status === responseType[5]) {
              subscriptionStatus.subscribed = true;
            }
            else {
              subscriptionStatus.subscribed = false;
            }

            if(subscriptionStatus.statusCode === "not-subscribed" && 
              subscriptionStatus.trialPeriod && subscriptionStatus.trialPeriod > 0) {
              subscriptionStatus.statusCode = "trial-available";
              subscriptionStatus.subscribed = true;
            }

            if(subscriptionStatus.expiry && subscriptionStatus.statusCode === "on-trial") {
              subscriptionStatus.expiry = new Date(subscriptionStatus.expiry);

              if(subscriptionStatus.expiry instanceof Date && !isNaN(subscriptionStatus.expiry.valueOf())) {
                subscriptionStatus.expiry = dateDiffInDays(new Date(), subscriptionStatus.expiry);
              }

              if(subscriptionStatus.expiry === 0) {
                subscriptionStatus.plural = "-zero";
              }
              else if(subscriptionStatus.expiry > 1) {
                subscriptionStatus.plural = "-many";
              }
            }
            deferred.resolve(subscriptionStatus);
          }
          else {
            deferred.reject("No response");
          }
        });
        
        return deferred.promise;
      };

      this.get = function (productCode, companyId, displayId) {
        return checkSubscriptionStatus(productCode, companyId, displayId)
          .then(function(subscriptionStatus) {
            if (subscriptionStatus.subscribed === false) {
              // double check store authorization in case they're authorized
              return checkAuthorizedStatus(productCode, companyId)
                .then(function(authorized) {
                  subscriptionStatus.subscribed = authorized;

                  return subscriptionStatus;
                });
            }
            else {
              return subscriptionStatus;
            }
        });
      };

    }]);
}());
