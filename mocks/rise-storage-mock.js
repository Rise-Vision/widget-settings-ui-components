(function (window) {
  "use strict";

  var storageItems = document.querySelectorAll("rise-storage"),
    dispatched = [],
    singleImage = "https://www.googleapis.com/storage/v1/b/risemedialibrary-b428b4e8-c8b9-41d5-8a10-b4193c789443/o/Widgets%2Fmoon.jpg",
    images = {
      "items": [
        {
          "name": "Widgets/moon.jpg",
          "contentType": "image/jpeg",
          "updated": "2015-02-04T17:45:25.945Z",
          "selfLink": "https://www.googleapis.com/storage/v1/b/risemedialibrary-b428b4e8-c8b9-41d5-8a10-b4193c789443/o/Widgets%2Fmoon.jpg"
        },
        {
          "name": "Widgets/apple_raw.png",
          "contentType": "image/png",
          "updated": "2015-02-06T14:25:11.312Z",
          "selfLink": "https://www.googleapis.com/storage/v1/b/risemedialibrary-b428b4e8-c8b9-41d5-8a10-b4193c789443/o/Widgets%2Fapple.png"
        },
        {
          "name": "Widgets/duck.bmp",
          "contentType": "image/bmp",
          "updated": "2015-02-06T11:24:13.313Z",
          "selfLink": "https://www.googleapis.com/storage/v1/b/risemedialibrary-b428b4e8-c8b9-41d5-8a10-b4193c789443/o/Widgets%2Fduck.bmp"
        }
      ]
    },
    singleVideo = "https://www.googleapis.com/storage/v1/b/risemedialibrary-b428b4e8-c8b9-41d5-8a10-b4193c789443/o/Widgets%2Fa_food_show.webm",
    videos = {
      "items": [
        {
          "name": "Widgets/big_buck_bunny.webm",
          "contentType": "video/webm",
          "updated": "2015-02-02T10:03:11.263Z",
          "selfLink": "https://www.googleapis.com/storage/v1/b/risemedialibrary-b428b4e8-c8b9-41d5-8a10-b4193c789443/o/Widgets%2Fbig_buck_bunny.webm"
        },
        {
          "name": "Widgets/big_buck_bunny.mp4",
          "contentType": "video/mp4",
          "updated": "2015-02-02T10:03:11.263Z",
          "selfLink": "https://www.googleapis.com/storage/v1/b/risemedialibrary-b428b4e8-c8b9-41d5-8a10-b4193c789443/o/Widgets%2Fbig_buck_bunny.mp4"
        },
        {
          "name": "Widgets/big_buck_bunny.ogv",
          "contentType": "video/ogg",
          "updated": "2015-02-02T10:03:11.263Z",
          "selfLink": "https://www.googleapis.com/storage/v1/b/risemedialibrary-b428b4e8-c8b9-41d5-8a10-b4193c789443/o/Widgets%2Fbig_buck_bunny.ogv"
        }
      ]
    },
    isRefreshing = false;

  function handleStorageResponse(storage) {
    var companyId = storage.getAttribute("companyId"),
      folder = storage.getAttribute("folder"),
      fileName = storage.getAttribute("fileName"),
      fileType = storage.getAttribute("fileType"),
      contentType = storage.getAttribute("contentType"),
      sort = storage.getAttribute("sort"),
      sortDirection = storage.getAttribute("sortDirection"),
      storageId = storage.getAttribute("id"),
      suffix = "?alt=media",
      contentTypes = null,
      files = [],
      file = {},
      response = {};

    response.files = [];

    if (companyId) {
      if (folder) {
        // Single file in folder.
        if (fileName) {
          // Requiring "video" in the id value of <rise-storage> to differentiate between image or video.
          file.url = (storageId && storageId.indexOf("video") !== -1) ? (singleVideo + suffix) :
            (singleImage + suffix);

          if (isRefreshing) {
            file.url += "&cb=0";
          }

          response.files.push(file);

          return response;
        }
      }
      // Single file in bucket.
      else if (fileName) {
        file.url = (storageId && storageId.indexOf("video") !== -1) ? (singleVideo + suffix) :
          (singleImage + suffix);

        if (isRefreshing) {
          file.url += "&cb=0";
        }

        response.files.push(file);

        return response;
      }

      // File type filtering
      if (fileType) {
        if (fileType === "image") {
          images.items.forEach(function(image) {
            files.push(image);
          });
        }
        else if (fileType === "video") {
          videos.items.forEach(function(video) {
            files.push(video);
          });
        }
      }
      // Content type filtering
      else if (contentType) {
        contentTypes = contentType.split(" ");

        images.items.forEach(function(image) {
          for (var i = 0; i < contentTypes.length; i++) {
            if (image.contentType === contentTypes[i]) {
              files.push(image);
              break;
            }
          }
        });

        videos.items.forEach(function(video) {
          for (var i = 0; i < contentTypes.length; i++) {
            if (video.contentType === contentTypes[i]) {
              files.push(video);
              break;
            }
          }
        });
      }
      // Multiple files in folder or bucket.
      else {
        images.items.forEach(function(image) {
          files.push(image);
        });
      }

      // Sorting
      if (sort) {
        if (sort === "name") {
          files.sort(function(a, b) {
            if (a.name > b.name) {
              return 1;
            }
            else if (a.name < b.name) {
              return -1;
            }

            return 0;
          });
        }
        else if (sort === "date") {
          files.sort(function(a, b) {
            a.updated = new Date(a.updated).getTime();
            b.updated = new Date(b.updated).getTime();

            if (a.updated > b.updated) {
              return 1;
            }
            else if (a.updated < b.updated) {
              return -1;
            }

            return 0;
          });
        }
      }

      if (sortDirection && sortDirection === "desc") {
        files.reverse();
      }

      files.forEach(function(item) {
        file = {};
        file.url = item.selfLink + suffix;

        response.files.push(file);
      });

      return response;
    }
  }

  function getFiles() {
    var evt = document.createEvent("CustomEvent"),
      response = {},
      storageItem;

    for (var i = 0; i < storageItems.length; ++i) {
      storageItem = storageItems[i];

      if (dispatched.indexOf(storageItem) === -1) {
        response = handleStorageResponse(storageItem);

        evt.initCustomEvent("rise-storage-response", false, false, response);
        storageItem.dispatchEvent(evt);
        dispatched.push(storageItem);
      }
    }
  }

  function startTimer() {
    setTimeout(function() {
      dispatched = [];
      isRefreshing = true;
      getFiles();
    }, 2000);
  }

  HTMLElement.prototype.go = function() {
    getFiles();
    startTimer();
  }
})(window);