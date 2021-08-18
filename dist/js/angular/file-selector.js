(function () {
  "use strict";

  angular.module("risevision.widget.common.file-selector", [
      "risevision.common.i18n",
      "risevision.widget.common.storage-selector",
      "risevision.widget.common.url-field",
      "risevision.common.components.subscription-status"
    ])
    .directive("fileSelector", ["$templateCache", "$log", "$window", "$rootScope", function ($templateCache, $log, $window, $rootScope) {
      return {
        restrict: "E",
        require: "?ngModel",
        scope: {
          title: "@",
          fileLabel: "@",
          folderLabel: "@",
          companyId: "@",
          fileType: "@",
          selector: "="
        },
        template: $templateCache.get("_angular/file-selector/file-selector.html"),
        link: function (scope, element, attrs, ctrl) {

          function hasValidExtension(url, fileType) {
            var testUrl = url.toLowerCase(),
              extensions;

            switch(fileType) {
              case "image":
                extensions = [".jpg", ".jpeg", ".png", ".bmp", ".svg", ".gif", ".webp"];
                break;
              case "video":
                extensions = [".webm", ".mp4", ".ogv", ".ogg"];
                break;
              default:
                extensions = [];
            }

            for (var i = 0, len = extensions.length; i < len; i++) {
              if (testUrl.indexOf(extensions[i]) !== -1) {
                return true;
              }
            }

            return false;
          }

          function toggleButtons(selectedType) {

            switch (selectedType) {
              case "single-file":
                scope.fileBtnSelected = true;
                scope.folderBtnSelected = false;
                scope.customBtnSelected = false;
                break;
              case "single-folder":
                scope.fileBtnSelected = false;
                scope.folderBtnSelected = true;
                scope.customBtnSelected = false;
                break;
              case "custom":
                scope.fileBtnSelected = false;
                scope.folderBtnSelected = false;
                scope.customBtnSelected = true;
                break;
              default:
                scope.fileBtnSelected = false;
                scope.folderBtnSelected = false;
                scope.customBtnSelected = false;
                break;
            }

          }

          function getStorageName(url, type) {
            var str, arr, params, pair, fileName, folder, name;

            if (type === "single-file") {
              // example single storage file url
              // https://storage.googleapis.com/risemedialibrary-abc123/test%2Fvideos%2Ftest.webm

              // get the second part of the split
              str = url.split("storage.googleapis.com/risemedialibrary-")[1];
              // extract everything starting after the company id
              str = decodeURIComponent(str.slice(str.indexOf("/") + 1));
              // split up based on folder separator
              arr = str.split("/");

              // assign the last index of array split as the file name
              fileName = arr.pop();
              // join the remaining array to form the folder name/path
              folder = arr.length > 0 ? arr.join("/") : "";

              if (folder !== "") {
                // add ending "/" to the folder path
                folder += "/";
              }

              name = folder + fileName;
            }
            else if (type === "single-folder") {
              // example single storage folder url
              // https://www.googleapis.com/storage/v1/b/risemedialibrary-abc123/o?prefix=test%2Fvideos%2F

              // everything after "?" will involve the folder name/path
              params = url.split("?");

              for (var i = 0; i < params.length; i++) {
                // "prefix" will be the param name and the folder name/path will be the value
                pair = params[i].split("=");

                if (pair[0] === "prefix" && typeof pair[1] !== "undefined" && pair[1] !== "") {
                  name = decodeURIComponent(pair[1]);
                  break;
                }
              }

            }

            return name;
          }

          function showWarnings(type) {
            scope.folderIsEmpty = false;
            if (type === "single-folder") {
              fetch("https://storage-dot-rvaserver2.appspot.com/_ah/api/storage/v0.01/files?companyId=" + scope.companyId + "&folder=" + encodeURI(scope.selector.storageName))
              .then(function(response) {
                return response.json();
              })
              .then(function(data) {
                  scope.folderIsEmpty = isEmptyFolder(data);
                  $rootScope.$apply();
              });
            }
          }

          function isEmptyFolder( resp ) {
            return ( resp.files !== undefined ) && ( resp.files.length === 1 ) &&
              ( resp.files[ 0 ].name.slice( -1 ) === "/" );
          }

          scope.defaultSetting = {
            selection: "", // "single-file", "single-folder", or "custom"
            storageName: "", // name of file or folder path
            url: ""
          };

          // set default button states
          toggleButtons();

          // default to false so it will set validity on parent to false initially
          scope.selectorValid = false;
          // a flag to check if custom url is in an initial empty state
          scope.customInit = false;
          // default to false so the subscription-status component doesn't show itself until it receives its status
          scope.isSubscribed = true;
          // will hide subscription status permanently if attr was used
          scope.hideSubscription = (typeof attrs.hideSubscription !== "undefined");
          // a flag to toggle subscription status visibility (depends on selection type)
          scope.subscriptionOff = true;
          // a flag to toggle "folder is empty" warning
          scope.folderIsEmpty = false;

          scope.defaults = function(obj) {
            if (obj) {
              for (var i = 1, length = arguments.length; i < length; i++) {
                var source = arguments[i];

                for (var prop in source) {
                  if (obj[prop] === void 0) {
                    obj[prop] = source[prop];
                  }
                }
              }
            }
            return obj;
          };

          scope.onCustomBtnHandler = function() {
            scope.selector.selection = "custom";
            scope.selector.url = "";
            scope.selector.storageName = "";
          };

          scope.previewFile = function () {
            $window.open(scope.selector.url, "_blank");
          };

          scope.$on("picked", function (event, data, type) {
            scope.selector.selection = type;
            scope.selector.storageName = getStorageName(data[0], scope.selector.selection);
            scope.selector.url = data[0];
            showWarnings(scope.selector.selection);
          });

          scope.$watch("selectorValid", function (valid) {
            if (ctrl) {
              ctrl.$setValidity("selectorValid", valid);
            }
          });

          scope.$watch("selector", function(selector) {
            scope.defaults(selector, scope.defaultSetting);
          });

          scope.$watch("selector.selection", function (selection) {
            if (typeof selection !== "undefined") {
              toggleButtons(selection);
              showWarnings(selection);

              scope.subscriptionOff = (selection === "" || selection === "custom");

              if (selection === "single-folder") {
                // validity is fine when choosing a single-folder from storage
                scope.selectorValid = true;
              }
              else if (selection === "custom") {
                scope.customInit = true;
                // set selector validity to false to account for allowing an initial empty value for url-field
                scope.selectorValid = false;
              }

              if (!scope.subscriptionOff && !scope.hideSubscription) {
                // ensure subscription-status component does a refresh in case user subscribed from in-app storage
                scope.isSubscribed = false;
                $rootScope.$broadcast("refreshSubscriptionStatus", null);
              }

              $rootScope.$broadcast("fileSelectorClick", selection);
            }
          });

          scope.$watch("selector.url", function (url) {
            if (typeof url !== "undefined" && url !== null) {
              if (scope.selector.selection === "single-file" && typeof scope.fileType !== "undefined") {
                // set validity from the single-file storage selection
                scope.selectorValid = hasValidExtension(url, scope.fileType);
              }
              else if (scope.selector.selection === "custom" && scope.customInit && url !== "") {
                // an entry was made in url-field
                scope.customInit = false;
                scope.selectorValid = true;
              }
            }
          });

          scope.$watch("subscribed", function (subscription) {
            if (typeof subscription !== "undefined" && subscription.statusCode !== "na") {
              scope.isSubscribed = subscription.subscribed;
            }
          });

        }
      };
    }]);
}());

(function(module) {
try { module = angular.module("risevision.widget.common.file-selector"); }
catch(err) { module = angular.module("risevision.widget.common.file-selector", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("_angular/file-selector/file-selector.html",
    "<div class=\"form-group file-selector\">\n" +
    "  <label ng-if=\"title\" class=\"control-label remove-bottom\">{{ title }}</label>\n" +
    "\n" +
    "  <div class=\"row u_margin-sm-top u_margin-sm-bottom half-top half-bottom\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <!-- Storage Single File - Button -->\n" +
    "      <storage-selector selected=\"fileBtnSelected\"\n" +
    "                        company-id=\"{{companyId}}\"\n" +
    "                        type=\"single-file\"\n" +
    "                        label=\"{{ fileLabel }}\"></storage-selector>\n" +
    "      <!-- Storage Single Folder - Button -->\n" +
    "      <storage-selector ng-if=\"folderLabel\"\n" +
    "                        selected=\"folderBtnSelected\"\n" +
    "                        company-id=\"{{companyId}}\"\n" +
    "                        type=\"single-folder\"\n" +
    "                        label=\"{{ folderLabel }}\"></storage-selector>\n" +
    "      <!-- Custom File - Button -->\n" +
    "      <button name=\"customBtn\" type=\"button\" class=\"btn btn-default\"\n" +
    "              ng-class=\"{active: customBtnSelected}\"\n" +
    "              ng-click=\"onCustomBtnHandler()\">{{ 'file-selector.buttons.custom' | translate }}\n" +
    "        <i class=\"fa fa-link fa-large\"></i></button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <!-- Storage Single File - Input -->\n" +
    "  <div class=\"form-group\" ng-if=\"selector.selection === 'single-file'\">\n" +
    "    <div class=\"input-group custom-addon\">\n" +
    "      <input name=\"storage-file-name\" type=\"text\" class=\"form-control\" ng-model=\"selector.storageName\" readonly>\n" +
    "      <span class=\"input-group-addon\">\n" +
    "        <button name=\"previewBtn\" class=\"btn btn-default\" ng-click=\"previewFile()\">{{ 'file-selector.buttons.preview' | translate }}\n" +
    "          <img src=\"http://s3.amazonaws.com/Rise-Images/Icons/newtab-icon.png\" class=\"storage-selector-icon icon-right\">\n" +
    "        </button>\n" +
    "      </span>\n" +
    "    </div>\n" +
    "    <p ng-if=\"!selectorValid && fileType === 'image'\" class=\"text-danger\">{{ \"file-selector.errors.storage.image\" | translate }}</p>\n" +
    "    <p ng-if=\"!selectorValid && fileType === 'video'\" class=\"text-danger\">{{ \"file-selector.errors.storage.video\" | translate }}</p>\n" +
    "  </div>\n" +
    "\n" +
    "  <!-- Storage Single Folder - Input -->\n" +
    "  <div ng-if=\"selector.selection === 'single-folder'\">\n" +
    "    <input name=\"storage-folder-name\" type=\"text\" class=\"form-control\" ng-model=\"selector.storageName\" readonly>\n" +
    "    <p ng-if=\"folderIsEmpty\" class=\"text-danger\">The selected folder is empty</p>\n" +
    "  </div>\n" +
    "\n" +
    "  <!-- Custom File - Input -->\n" +
    "  <div ng-if=\"selector.selection === 'custom'\">\n" +
    "    <url-field id=\"customUrl\" name=\"customUrl\" url=\"selector.url\"\n" +
    "               file-type=\"{{fileType}}\"\n" +
    "               hide-label=\"true\"\n" +
    "               ng-model=\"customurlentry\" valid init-empty></url-field>\n" +
    "  </div>\n" +
    "\n" +
    "  <!-- Storage Subscription Status -->\n" +
    "  <div ng-if=\"!isSubscribed && !hideSubscription && !subscriptionOff\" subscription-status expanded-format=\"true\"\n" +
    "       product-id=\"24\" product-code=\"b0cba08a4baa0c62b8cdc621b6f6a124f89a03db\" company-id=\"{{companyId}}\"\n" +
    "       ng-model=\"$parent.subscribed\">\n" +
    "  </div>\n" +
    "\n" +
    "</div>\n" +
    "");
}]);
})();
