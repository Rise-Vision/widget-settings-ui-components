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
