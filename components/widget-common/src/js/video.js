var RiseVision = RiseVision || {};
RiseVision.Common = RiseVision.Common || {};

RiseVision.Common.Video = RiseVision.Common.Video || {};

RiseVision.Common.Video.FrameController = function () {
  "use strict";

  var PREFIX = "if_";

  function getFrameContainer(index) {
    return document.getElementById(PREFIX + index);
  }

  function getFrameObject(index) {
    var frameContainer = getFrameContainer(index),
      iframe;

    iframe = frameContainer.querySelector("iframe");

    if (iframe) {
      return (iframe.contentWindow) ? iframe.contentWindow :
        (iframe.contentDocument.document) ? iframe.contentDocument.document : iframe.contentDocument;
    }

    return null;
  }

  function _clear(index) {
    var frameContainer = getFrameContainer(index),
      frameObj = getFrameObject(index),
      iframe;

    if (frameObj) {
      iframe = frameContainer.querySelector("iframe");
      frameObj.remove();
      iframe.setAttribute("src", "about:blank");
    }
  }

  function add(index) {
    var frameContainer = getFrameContainer(index),
      iframe = document.createElement("iframe");

    iframe.setAttribute("allowTransparency", true);
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("scrolling", "no");

    frameContainer.appendChild(iframe);
  }

  function createFramePlayer(index, params, files, skin, src) {
    var frameContainer = getFrameContainer(index),
      frameObj = getFrameObject(index),
      iframe;

    if (frameObj) {
      iframe = frameContainer.querySelector("iframe");

      iframe.onload = function () {
        iframe.onload = null;

        // initialize and load the player inside the iframe
        frameObj.init(params, files, skin);
        frameObj.load();
      };

      iframe.setAttribute("src", src);
    }

  }

  function hide(index) {
    var frameContainer = getFrameContainer(index);

    frameContainer.style.visibility = "hidden";
  }

  function remove(index, callback) {
    var frameContainer = document.getElementById(PREFIX + index);

    _clear(index);

    setTimeout(function () {
      // remove the iframe by clearing all elements inside div container
      while (frameContainer.firstChild) {
        frameContainer.removeChild(frameContainer.firstChild);
      }

      if (callback && typeof callback === "function") {
        callback();
      }
    }, 200);
  }

  function show(index) {
    var frameContainer = getFrameContainer(index);

    frameContainer.style.visibility = "visible";
  }

  return {
    add: add,
    createFramePlayer: createFramePlayer,
    getFrameContainer: getFrameContainer,
    getFrameObject: getFrameObject,
    hide: hide,
    remove: remove,
    show: show
  };
};
