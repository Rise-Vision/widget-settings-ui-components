/* global TweenLite, Linear */

var RiseVision = RiseVision || {};
RiseVision.Common = RiseVision.Common || {};

RiseVision.Common.Scroller = function (params) {

  "use strict";

  var _scroller = null,
    _scrollerCtx = null,
    _tween = null,
    _items = [],
    _itemsLength = [],
    _itemsIdx = 0,
    _xpos = 0, // xpos is changed within each frame
    _originalXpos = 0, // originalXpos is saved across frames
    _utils = RiseVision.Common.Utilities;

  /*
   *  Private Methods
   */
  function setupItemsLength() {
    _xpos = 0;

    for (var i = 0; i < _items.length; i++) {
      _itemsIdx = i;
      if (_items[i].separator) {
        drawSeparator(_items[i], true);
      }
      else {
        drawItem(_items[i], true);
      }
    }
  }

  /* Draw a separator between items. */
  function drawSeparator(item, saveLength) {
    var y = _scroller.height / 2,
      radius = item.size / 2;

    _scrollerCtx.save();

    _scrollerCtx.fillStyle = item.color;

    // Draw a circle.
    _scrollerCtx.beginPath();
    _scrollerCtx.arc(_xpos + radius, y, radius, 0, 2 * Math.PI);
    _scrollerCtx.fill();

    var size = item.size + 10;

    _xpos += size;

    if (saveLength) {
      var start = _itemsIdx === 0 ? 0 : _itemsLength[_itemsIdx - 1].end;
      var end = start + size;
      _itemsLength[_itemsIdx] = {start: start, end: end, length: end - start };
    }

    _scrollerCtx.restore();
  }

  function drawItemIdx(idx) {
    if (_items[idx].separator) {
      drawSeparator(_items[idx], false);
    }
    else {
      drawItem(_items[idx], false);
    }
  }

  function drawItem(item, saveLength) {
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
      }

      drawText(textObj, saveLength);
    }
  }

  function drawText(textObj, saveLength) {
    var font = "";

    _scrollerCtx.save();

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
    _scrollerCtx.font = font;
    _scrollerCtx.fillStyle = textObj.foreColor;
    _scrollerCtx.textBaseline = "middle";

    // Draw the text onto the canvas.
    _scrollerCtx.translate(0, _scroller.height / 2);
    _scrollerCtx.fillText(textObj.text, _xpos, 0);

    var size = _scrollerCtx.measureText(textObj.text).width + 10;
    _xpos += size;

    if (saveLength) {
      var start = _itemsIdx === 0 ? 0 : _itemsLength[_itemsIdx - 1].end;
      var end = start + size;
      _itemsLength[_itemsIdx] = {start: start, end: end, length: end - start };
    }

    _scrollerCtx.restore();
  }

  function draw() {
    // nothing to do here. The x position didn't move, so we don't need to redraw this frame
    if (_originalXpos === _scrollerCtx.xpos) {
      return;
    }

    _scrollerCtx.clearRect(0, 0, _scroller.width, _scroller.height);

    // scroller xpos is animated by Tween. We use this x position to select which items to draw
    _xpos = _scrollerCtx.xpos;

    // saving the original x position to avoid redraw on the next frame if possible
    _originalXpos = _xpos;

    // find the index of the first item visible on the canvas
    var index = 0;
    while (_xpos < _itemsLength[index].start && index < _itemsLength.length) {
      index++;
    }

    // xpos should move backwards because we want to scroll to the left
    _xpos = _itemsLength[index].start - _xpos;

    // draw every item until xpos is outside the canvas width
    while (_xpos < _scroller.width) {
      drawItemIdx(index);
      index++;
      if (index >= _items.length) {
        index = 0;
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

    return _xpos / factor;
  }

  /* Scroller has completed a cycle. */
  function onComplete() {
    _tween = null;
    _scrollerCtx.xpos = 0;

    _scroller.dispatchEvent(new CustomEvent("done", { "bubbles": true }));
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

    setupItemsLength();

    TweenLite.ticker.addEventListener("tick", draw);
    _scroller.dispatchEvent(new CustomEvent("ready", { "bubbles": true }));
  }

  function refresh(items) {
    _items = items;

    setupItemsLength();
  }

  function play() {
    if (!_tween) {
      _tween = TweenLite.to(_scrollerCtx, getDelay(), { xpos: _xpos , ease: Linear.easeNone, onComplete: onComplete });
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
