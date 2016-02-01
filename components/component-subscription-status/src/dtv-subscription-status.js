(function () {
  "use strict";

  angular.module("risevision.widget.common.subscription-status")
    .directive("subscriptionStatus", ["$templateCache", "subscriptionStatusService",
    "$document", "$compile", "$rootScope", "STORE_URL", "ACCOUNT_PATH",
      function ($templateCache, subscriptionStatusService, $document, $compile, 
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
          var storeModalInitialized = false;

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

          var watch = $scope.$watch("showStoreModal", function(show) {
            if (show) {
              initStoreModal();

              watch();
            }
          });

          $scope.$on("store-dialog-save", function() {
            checkSubscriptionStatus();
          });

          $scope.$on("store-dialog-close", function() {
            checkSubscriptionStatus();
          });

          function initStoreModal() {
            if (!storeModalInitialized) {
              var body = $document.find("body").eq(0);
              
              var angularDomEl = angular.element("<div store-modal></div>");
              angularDomEl.attr({
                "id": "store-modal",
                "animate": "animate",
                "show-store-modal": "showStoreModal",
                "company-id": "{{companyId}}",
                "product-id": "{{productId}}"
              });
              
              var modalDomEl = $compile(angularDomEl)($scope);
              body.append(modalDomEl);
              
              storeModalInitialized = true;
            }
          }
        }
      };
    }])
    .filter("to_trusted", ["$sce", function($sce) {
      return function(text) {
        return $sce.trustAsHtml(text);
      };
    }]);
}());
