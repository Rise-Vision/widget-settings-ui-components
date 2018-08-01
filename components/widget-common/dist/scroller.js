/* global TweenLite, Linear */

var RiseVision = RiseVision || {};
RiseVision.Common = RiseVision.Common || {};

RiseVision.Common.Scroller = function (params) {

  "use strict";

  var _scroller = null,
    _scrollerCtx = null,
    _secondary = null,
    _secondaryCtx = null,
    _tween = null,
    _items = [],
    _xpos = 0,
    _originalXpos = 0,
    _oversizedCanvas = false,
    _utils = RiseVision.Common.Utilities,
    MAX_CANVAS_SIZE = 32767;

  /*
   *  Private Methods
   */

  /* Initialize the secondary canvas from which text will be copied to the scroller. */
  function initSecondaryCanvas() {
    drawItems();
    fillScroller();

    if (_xpos > MAX_CANVAS_SIZE) {
      _oversizedCanvas = true;
      _secondary.width = MAX_CANVAS_SIZE;
      throwOversizedCanvesError();
    } else {
      _secondary.width = _xpos;
    }

    // Setting the width again resets the canvas so it needs to be redrawn.
    drawItems();
    fillScroller();
  }

  function throwOversizedCanvesError() {
    var event = new Event("scroller-oversized-canvas");
    _scroller.dispatchEvent(event);
  }

  function drawItems() {
    _xpos = 0;

    for (var i = 0; i < _items.length; i++) {
      if (_items[i].separator) {
        drawSeparator(_items[i]);
      }
      else {
        drawItem(_items[i]);
      }
    }
  }

  /* Draw a separator between items. */
  function drawSeparator(item) {
    var y = _secondary.height / 2,
      radius = item.size / 2;

    _secondaryCtx.save();

    _secondaryCtx.fillStyle = item.color;

    // Draw a circle.
    _secondaryCtx.beginPath();
    _secondaryCtx.arc(_xpos + radius, y, radius, 0, 2 * Math.PI);
    _secondaryCtx.fill();

    _xpos += item.size + 10;

    _secondaryCtx.restore();
  }

  function drawItem(item, isEllipsis) {
    var textObj = {},
      fontStyle;

    if (item) {
      textObj.text = _utils.unescapeHTML(item.text);

      if (item.fontStyle) {
        fontStyle = item.fontStyle;

        if (fontStyle.font && fontStyle.font.family) {
          textObj.font = fontStyle.font.family;
        }

        if (fontStyle.size) {
          textObj.size = fontStyle.size;
        }

        if (fontStyle.forecolor) {
          textObj.foreColor = fontStyle.forecolor;
        }

        if (fontStyle.bold) {
          textObj.bold = fontStyle.bold;
        }

        if (fontStyle.italic) {
          textObj.italic = fontStyle.italic;
        }

        if (fontStyle.backcolor && isEllipsis) {
          textObj.backcolor = fontStyle.backcolor;
        }
      }

      if (isEllipsis) {
        drawEllipsis(textObj);
      } else {
        drawText(textObj);
      }
    }
  }

  function drawText(textObj) {
    var font = "";

    _secondaryCtx.save();

    if (textObj.bold) {
      font = "bold ";
    }

    if (textObj.italic) {
      font += "italic ";
    }

    if (textObj.size) {
      font += textObj.size + " ";
    }

    if (textObj.font) {
      font += textObj.font;
    }

    // Set the text formatting.
    _secondaryCtx.font = font;
    _secondaryCtx.fillStyle = textObj.foreColor;
    _secondaryCtx.textBaseline = "middle";

    // Draw the text onto the canvas.
    _secondaryCtx.translate(0, _secondary.height / 2);
    _secondaryCtx.fillText(textObj.text, _xpos, 0);

    _xpos += _secondaryCtx.measureText(textObj.text).width + 10;

    _secondaryCtx.restore();
  }

  function drawEllipsis(ellipsisObj) {
    var font = "",
      ellipsisWidth,
      rectHeight;

    _secondaryCtx.save();

    if (ellipsisObj.bold) {
      font = "bold ";
    }

    if (ellipsisObj.italic) {
      font += "italic ";
    }

    if (ellipsisObj.size) {
      font += ellipsisObj.size + " ";
    }

    if (ellipsisObj.font) {
      font += ellipsisObj.font;
    }

    // Set the text formatting.
    _secondaryCtx.font = font;
    _secondaryCtx.textBaseline = "middle";

    ellipsisWidth = _secondaryCtx.measureText("  ...  ").width;
    rectHeight = ellipsisObj.size ? ((ellipsisObj.size.indexOf("px") > 0) ? parseInt(ellipsisObj.size.slice(0, ellipsisObj.size.indexOf("px")), 10) : ellipsisObj.size) : 10;

    _secondaryCtx.translate(0, _secondary.height / 2);

    // Default background rect color to white if set to "transparent" so it forces to overlay text
    _secondaryCtx.fillStyle = ellipsisObj.backcolor === "transparent" ? "#FFF" : ellipsisObj.backcolor;
    // Draw the background rect onto the canvas so it overlays the text
    _secondaryCtx.fillRect(MAX_CANVAS_SIZE - ellipsisWidth, -(rectHeight/2), ellipsisWidth, rectHeight);

    // Draw the ellipsis text onto the canvas overlaying background rect
    _secondaryCtx.fillStyle = ellipsisObj.foreColor;
    _secondaryCtx.fillText("  ...  ", MAX_CANVAS_SIZE - ellipsisWidth, 0);

    _secondaryCtx.restore();
  }

  function draw() {
    _scrollerCtx.clearRect(0, 0, _scroller.width, _scroller.height);
    _scrollerCtx.drawImage(_secondary, _scrollerCtx.xpos, 0);
  }

  function fillScroller() {
    var width = 0,
      index = 0;

    _originalXpos = _xpos;

    // Ensure there's enough text to fill the scroller.
    if (_items.length > 0) {
      while (width < _scroller.width) {
        if (_items[index].separator) {
          drawSeparator(_items[index]);
        }
        else {
          drawItem(_items[index]);
        }

        width = _xpos - _originalXpos;
        index = (index === _items.length - 1) ? 0 : index + 1;
      }

      if (_oversizedCanvas) {
        drawItem(_items[index], true);
      }
    }
  }

  /* Get the scroll speed. */
  function getDelay() {
    var factor;

    if (params.transition && params.transition.speed) {
      switch (params.transition.speed) {
        case "slow":
          factor = 100;
          break;
        case "medium":
          factor = 150;
          break;
        case "fast":
          factor = 200;
          break;
        default:
          factor = 150;
      }
    }

    return _originalXpos / factor;
  }

  /* Scroller has completed a cycle. */
  function onComplete() {
    _tween = null;
    _scrollerCtx.xpos = 0;

    _scroller.dispatchEvent(new CustomEvent("done", { "bubbles": true }));
  }

  function createSecondaryCanvas() {
    _secondary = document.createElement("canvas");
    _secondary.id = "secondary";
    _secondary.style.display = "none";
    _secondaryCtx = initCanvas(_secondary);

    document.body.appendChild(_secondary);
  }

  function initCanvas(canvas) {
    var context = canvas.getContext("2d");

    canvas.width = params.width;
    canvas.height = params.height;
    context.xpos = 0;

    return context;
  }

  /*
   *  Public Methods
   */
  function init(items) {
    _items = items;
    _scroller = document.getElementById("scroller");
    _scrollerCtx = initCanvas(_scroller);

    createSecondaryCanvas();
    initSecondaryCanvas();

    TweenLite.ticker.addEventListener("tick", draw);
    _scroller.dispatchEvent(new CustomEvent("ready", { "bubbles": true }));
  }

  function refresh(items) {
    _items = items;
    _oversizedCanvas = false;

    initSecondaryCanvas();
  }

  function play() {
    if (!_tween) {
      _tween = TweenLite.to(_scrollerCtx, getDelay(), { xpos: -_originalXpos, ease: Linear.easeNone, onComplete: onComplete });
    }

    _tween.play();
  }

  function pause() {
    if (_tween) {
      _tween.pause();
    }
  }

  return {
    init: init,
    play: play,
    pause: pause,
    refresh: refresh
  };
};
