(function () {
  "use strict";

  angular.module("risevision.widget.common.file-selector", [
      "risevision.common.i18n",
      "risevision.widget.common.storage-selector",
      "risevision.widget.common.url-field"
    ])
    .directive("fileSelector", ["$templateCache", "$log", "$window", function ($templateCache, $log, $window) {
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
                extensions = [".jpg", ".jpeg", ".png", ".bmp", ".svg", ".gif"];
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

          scope.defaultSetting = {
            selection: "", // "single-file", "single-folder", or "custom"
            storageName: "", // name of file or folder path
            url: ""
          };

          // set default button states
          toggleButtons();

          // default to false so it will set validity on parent to false initially
          scope.selectorValid = false;

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
            scope.selectorValid = true;
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

              if (selection === "single-folder") {
                // validity is fine when choosing a single-folder from storage
                scope.selectorValid = true;
              }
            }
          });

          scope.$watch("selector.url", function (url) {
            if (typeof url !== "undefined" && url !== null) {
              if (scope.selector.selection === "single-file" && typeof scope.fileType !== "undefined") {
                // set validity from the single-file storage selection
                scope.selectorValid = hasValidExtension(url, scope.fileType);
              }
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
    "<div class=\"form-group\">\n" +
    "  <label class=\"control-label remove-bottom\">{{ title }}</label>\n" +
    "\n" +
    "  <div class=\"row half-top half-bottom\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <!-- Storage Single File - Button -->\n" +
    "      <storage-selector selected=\"fileBtnSelected\"\n" +
    "                        company-id=\"{{companyId}}\"\n" +
    "                        type=\"single-file\"\n" +
    "                        label=\"{{ fileLabel }}\"></storage-selector>\n" +
    "      <!-- Storage Single Folder - Button -->\n" +
    "      <storage-selector selected=\"folderBtnSelected\"\n" +
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
    "  </div>\n" +
    "\n" +
    "  <!-- Custom File - Input -->\n" +
    "  <div ng-if=\"selector.selection === 'custom'\">\n" +
    "    <url-field id=\"customUrl\" name=\"customUrl\" url=\"selector.url\"\n" +
    "               file-type=\"{{fileType}}\"\n" +
    "               hide-label=\"true\"\n" +
    "               ng-model=\"customurlentry\" valid></url-field>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);
})();
