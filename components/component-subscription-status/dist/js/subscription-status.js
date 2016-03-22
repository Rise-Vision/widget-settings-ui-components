(function () {
  "use strict";

  try {
  	angular.module("risevision.common.config");
  }
  catch(err) {
  	angular.module("risevision.common.config", []);
  }

  angular.module("risevision.common.config")
    .value("STORE_URL", "https://store.risevision.com/")
    .value("STORE_SERVER_URL", "https://store-dot-rvaserver2.appspot.com/")
  ;

  angular.module("risevision.widget.common.subscription-status.config", [])
    .value("IN_RVA_PATH", "/product/productId/?up_id=iframeId&parent=parentUrl&inRVA=true&cid=companyId")
    .value("ACCOUNT_PATH", "/account?cid=companyId")
    .value("PATH_URL", "v1/company/companyId/product/status?pc=")
  ;

}());

(function () {
  "use strict";

  angular.module("risevision.widget.common.subscription-status",
    ["risevision.common.config",
     "risevision.widget.common.subscription-status.config",
     "risevision.widget.common.subscription-status.service",
     "risevision.widget.common",
     "risevision.common.i18n",
     "ngSanitize",
     "ui.bootstrap"]);
  }());

(function () {
  "use strict";

  angular.module("risevision.widget.common.subscription-status")
    .controller("StoreModalController", ["$scope", "$rootScope", "$timeout", 
      "$modalInstance", "$location", "$sce", "gadgetsApi", 
      "STORE_URL", "IN_RVA_PATH", "productId", "companyId",
      function ($scope, $rootScope, $timeout, $modalInstance, $location, $sce,
        gadgetsApi, STORE_URL, IN_RVA_PATH, productId, companyId) {

        var getStoreUrl = function() {  
          var url = STORE_URL + IN_RVA_PATH
            .replace("productId", productId)
            .replace("companyId", companyId)
            .replace("iframeId", "store-modal-iframe")
            .replace("parentUrl", encodeURIComponent($location.$$absUrl));
                          
          return $sce.trustAsResourceUrl(url);
        };
        $scope.url = getStoreUrl();
        
        var saveSettings = function() {
          $modalInstance.close();
        };

        var closeSettings = function() {
          $modalInstance.dismiss();
        };

        var registerRPC = function() {
          if (gadgetsApi) {
            $timeout(function() {
              gadgetsApi.rpc.register("rscmd_saveSettings", saveSettings);
              gadgetsApi.rpc.register("rscmd_closeSettings", closeSettings);

              gadgetsApi.rpc.setupReceiver("store-modal-iframe");
            });
          }
        };
        registerRPC();
    }]);
}());
  

(function () {
  "use strict";

  angular.module("risevision.widget.common.subscription-status")
    .directive("appSubscriptionStatus", ["$templateCache", "$modal", 
    "subscriptionStatusService",
      function ($templateCache, $modal, subscriptionStatusService) {
      return {
        restrict: "AE",
        require: "?ngModel",
        scope: {
          productId: "@",
          productCode: "@",
          companyId: "@",
          productPrice: "@"
        },
        template: $templateCache.get("app-subscription-status-template.html"),
        link: function($scope, elm, attrs, ctrl) {
          $scope.subscriptionStatus = {"status": "N/A", "statusCode": "na", "subscribed": false, "expiry": null};

          $scope.$watch("companyId", function() {
            checkSubscriptionStatus();
          });

          function checkSubscriptionStatus() {
            if ($scope.productCode && $scope.productId && $scope.companyId) {
              subscriptionStatusService.get($scope.productCode, $scope.companyId).then(function(subscriptionStatus) {
                if (subscriptionStatus) {
                  $scope.subscriptionStatus = subscriptionStatus;
                }
              },
              function () {
                // TODO: catch error here
              });
            }
          }

          if (ctrl) {
            $scope.$watch("subscriptionStatus", function(subscriptionStatus) {
              ctrl.$setViewValue(subscriptionStatus);
            });
          }

          $scope.$watch("showStoreModal", function(show) {
            if (show) {
              var modalInstance = $modal.open({
                templateUrl: "store-iframe-template.html",
                controller: "StoreModalController",
                size: "lg",
                resolve: {
                  productId: function () {
                    return $scope.productId;
                  },
                  companyId: function() {
                    return $scope.companyId;
                  }
                }
              });

              modalInstance.result.then(function () {
                checkSubscriptionStatus();

              }, function () {
                checkSubscriptionStatus();

              })
              .finally(function() {
                $scope.showStoreModal = false;
              });
            }
          });
        }
      };
    }])
    .directive("ngDisableRightClick", function() {
      return function(scope, element) {
        element.bind("contextmenu", function(event) {
          scope.$apply(function() {
            event.preventDefault();
          });
        });
      };
    });
}());

(function () {
  "use strict";

  angular.module("risevision.widget.common.subscription-status")
    .directive("subscriptionStatus", ["$templateCache", "$modal", "subscriptionStatusService",
    "$document", "$compile", "$rootScope", "STORE_URL", "ACCOUNT_PATH",
      function ($templateCache, $modal, subscriptionStatusService, $document, $compile, 
        $rootScope, STORE_URL, ACCOUNT_PATH) {
      return {
        restrict: "AE",
        require: "?ngModel",
        scope: {
          productId: "@",
          productCode: "@",
          companyId: "@",
          expandedFormat: "@",
          showStoreModal: "=?"
        },
        template: $templateCache.get("subscription-status-template.html"),
        link: function($scope, elm, attrs, ctrl) {
          $scope.subscriptionStatus = {"status": "N/A", "statusCode": "na", "subscribed": false, "expiry": null};

          var updateStoreAccountUrl = function() {
            $scope.storeAccountUrl = STORE_URL + ACCOUNT_PATH
                              .replace("companyId", $scope.companyId);
          };

          $scope.$watch("companyId", function() {
            checkSubscriptionStatus();
            
            updateStoreAccountUrl();
          });

          $rootScope.$on("refreshSubscriptionStatus", function(event, data) {
            // Only refresh if currentStatus code matches the provided value, or value is null
            if(data === null || $scope.subscriptionStatus.statusCode === data) {
              checkSubscriptionStatus();
            }
          });

          function checkSubscriptionStatus() {
            if ($scope.productCode && $scope.productId && $scope.companyId) {
              subscriptionStatusService.get($scope.productCode, $scope.companyId).then(function(subscriptionStatus) {
                if (subscriptionStatus) {
                  if(!$scope.subscriptionStatus || $scope.subscriptionStatus.status !== subscriptionStatus.status) {
                    $rootScope.$emit("subscription-status:changed", subscriptionStatus);
                  }
                  
                  $scope.subscriptionStatus = subscriptionStatus;
                }
              },
              function () {
                // TODO: catch error here
              });
            }
          }

          if (ctrl) {
            $scope.$watch("subscriptionStatus", function(subscriptionStatus) {
              ctrl.$setViewValue(subscriptionStatus);
            });
          }

          $scope.$watch("showStoreModal", function(show) {
            if (show) {
              var modalInstance = $modal.open({
                templateUrl: "store-iframe-template.html",
                controller: "StoreModalController",
                size: "lg",
                resolve: {
                  productId: function () {
                    return $scope.productId;
                  },
                  companyId: function() {
                    return $scope.companyId;
                  }
                }
              });

              modalInstance.result.then(function () {
                checkSubscriptionStatus();

              }, function () {
                checkSubscriptionStatus();

              })
              .finally(function() {
                $scope.showStoreModal = false;
              });
            }
          });
        }
      };
    }])
    .filter("to_trusted", ["$sce", function($sce) {
      return function(text) {
        return $sce.trustAsHtml(text);
      };
    }]);
}());

"use strict";

angular.module("risevision.widget.common.subscription-status")
  .filter("productTrialDaysToExpiry", ["$interpolate", "$translate", function($interpolate, $translate) {
    var expiresToday = null;
    var expiresIn = null;

    $translate(["subscription-status.expires-today", "subscription-status.expires-in"],
        { days: "{{days}}" }).then(function(values) {
      expiresToday = $interpolate(values["subscription-status.expires-today"]);
      expiresIn = $interpolate(values["subscription-status.expires-in"]);
    });

    return function(subscriptionExpiry) {
      var msg = "";
      try {
        var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
        var timeInMs = new Date(subscriptionExpiry).getTime() - new Date().getTime();
        var days = Math.floor(timeInMs/oneDay);
        var params = { days: days };

        if (days === 0) {
          msg = expiresToday !== null ? expiresToday(params) : "";
        }
        else if (days > 0) {
          msg = expiresIn !== null ? expiresIn(params) : "";
        }
        else {
          msg = expiresToday !== null ? expiresToday(params) : "";
        }
      } catch (e) {
        msg = expiresToday !== null ? expiresToday(params) : "";
      }

      return msg;
    };
  }]);

(function () {
  "use strict";

  angular.module("risevision.widget.common.subscription-status.service",
    ["risevision.common.config",
     "risevision.widget.common.subscription-status.config"])
    .service("subscriptionStatusService", ["$http", "$q", "STORE_SERVER_URL", "PATH_URL",
    function ($http, $q, STORE_SERVER_URL, PATH_URL) {
      var responseType = ["On Trial", "Trial Expired", "Subscribed", "Suspended", "Cancelled", "Free", "Not Subscribed", "Product Not Found", "Company Not Found", "Error"];
      var responseCode = ["on-trial", "trial-expired", "subscribed", "suspended", "cancelled", "free", "not-subscribed", "product-not-found", "company-not-found", "error"];
      var _MS_PER_DAY = 1000 * 60 * 60 * 24;

      // a and b are javascript Date objects
      function dateDiffInDays(a, b) {
        return Math.floor((b.getTime() - a.getTime()) / _MS_PER_DAY);
      }

      this.get = function (productCode, companyId) {
        var deferred = $q.defer();

        var url = STORE_SERVER_URL +
          PATH_URL.replace("companyId", companyId) +
          productCode;

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

    }]);
}());

(function(module) {
try { module = angular.module("risevision.widget.common.subscription-status"); }
catch(err) { module = angular.module("risevision.widget.common.subscription-status", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app-subscription-status-template.html",
    "<a id=\"app-subscription-status\" href=\"\"\n" +
    "  ng-click=\"showStoreModal = true\" class=\"store-link\">\n" +
    "    <div class=\"rate\">\n" +
    "      <strong>${{productPrice}}</strong>\n" +
    "    </div>\n" +
    "    <div class=\"subscribe\">\n" +
    "      <strong ng-if=\"!subscriptionStatus.subscribed\"><span translate=\"subscription-status.get-subscription\"></span></strong>\n" +
    "      <strong ng-if=\"subscriptionStatus.subscribed\"><span translate=\"subscription-status.continue-to-app\"></span></strong>\n" +
    "    </div>\n" +
    "</a>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("risevision.widget.common.subscription-status"); }
catch(err) { module = angular.module("risevision.widget.common.subscription-status", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("store-iframe-template.html",
    "<iframe id=\"store-modal-iframe\" name=\"store-modal-iframe\" class=\"modal-dialog\" scrolling=\"no\" marginwidth=\"0\" src=\"{{ url }}\"></iframe>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("risevision.widget.common.subscription-status"); }
catch(err) { module = angular.module("risevision.widget.common.subscription-status", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("subscription-status-template.html",
    "<div ng-show=\"!expandedFormat\">\n" +
    "  <h3 ng-disable-right-click>\n" +
    "    <span ng-show=\"subscriptionStatus.statusCode !== 'not-subscribed'\" ng-bind-html=\"'subscription-status.' + subscriptionStatus.statusCode + subscriptionStatus.plural | translate:subscriptionStatus | to_trusted\"></span>\n" +
    "  </h3>\n" +
    "  \n" +
    "  <span ng-show=\"subscriptionStatus.statusCode === 'trial-available'\">\n" +
    "    <button class=\"btn btn-primary btn-xs\" ng-click=\"showStoreModal = true;\">\n" +
    "      <span translate=\"subscription-status.start-trial\"></span>\n" +
    "    </button>\n" +
    "  </span>\n" +
    "  <span ng-show=\"['on-trial', 'trial-expired', 'cancelled', 'not-subscribed'].indexOf(subscriptionStatus.statusCode) >= 0\">\n" +
    "    <button class=\"btn btn-primary btn-xs\" ng-click=\"showStoreModal = true;\">\n" +
    "      <span translate=\"subscription-status.subscribe\"></span>\n" +
    "    </button>\n" +
    "  </span>\n" +
    "  <span ng-show=\"['suspended'].indexOf(subscriptionStatus.statusCode) >= 0\">\n" +
    "    <a type=\"button\" class=\"btn btn-primary btn-xs\" ng-href=\"{{storeAccountUrl}}\" target=\"_blank\">\n" +
    "      <span translate=\"subscription-status.view-account\"></span>\n" +
    "    </a>\n" +
    "  </span>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-show=\"expandedFormat\">\n" +
    "  <div class=\"subscription-status trial\" ng-show=\"subscriptionStatus.statusCode === 'on-trial'\">\n" +
    "    <span ng-bind-html=\"'subscription-status.expanded-' + subscriptionStatus.statusCode + subscriptionStatus.plural | translate:subscriptionStatus | to_trusted\"></span>\n" +
    "    <button type=\"button\" class=\"btn btn-primary add-left\" ng-click=\"showStoreModal = true;\">\n" +
    "      <span translate=\"subscription-status.subscribe-now\"></span>\n" +
    "    </button>\n" +
    "  </div>\n" +
    "  <div class=\"subscription-status expired\" ng-show=\"subscriptionStatus.statusCode === 'trial-expired'\">\n" +
    "    <span translate=\"subscription-status.expanded-expired\"></span>\n" +
    "    <button type=\"button\" class=\"btn btn-primary add-left\" ng-click=\"showStoreModal = true;\">\n" +
    "      <span translate=\"subscription-status.subscribe-now\"></span>\n" +
    "    </button>\n" +
    "  </div>\n" +
    "  <div class=\"subscription-status cancelled\" ng-show=\"subscriptionStatus.statusCode === 'cancelled'\">\n" +
    "   <span translate=\"subscription-status.expanded-cancelled\"></span>\n" +
    "    <button type=\"button\" class=\"btn btn-primary add-left\" ng-click=\"showStoreModal = true;\">\n" +
    "      <span translate=\"subscription-status.subscribe-now\"></span>\n" +
    "    </button>\n" +
    "  </div>\n" +
    "  <div class=\"subscription-status suspended\" ng-show=\"subscriptionStatus.statusCode === 'suspended'\">\n" +
    "    <span translate=\"subscription-status.expanded-suspended\"></span>\n" +
    "    <a type=\"button\" class=\"btn btn-primary add-left\" ng-href=\"{{storeAccountUrl}}\" target=\"_blank\">\n" +
    "      <span translate=\"subscription-status.view-invoices\"></span>\n" +
    "    </a>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);
})();
