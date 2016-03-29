/* global WebFont, TweenLite, Linear */

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
    _utils = RiseVision.Common.Utilities;

  /*
   *  Private Methods
   */

  /* Load custom and Google fonts. */
  function loadFonts() {
    var families = null,
      googleFamilies = [],
      customFamilies = [],
      customUrls = [];

    // Google fonts
    for (var i = 0; i < _items.length; i++) {
      if (_items[i].fontStyle.font.type && (_items[i].fontStyle.font.type === "google")) {
        // Remove fallback font.
        families = _items[i].fontStyle.font.family.split(",");

        googleFamilies.push(families[0]);
      }
    }

    // Custom Fonts
    for (i = 0; i < _items.length; i++) {
      if (_items[i].fontStyle.font.type && (_items[i].fontStyle.font.type === "custom")) {
        customFamilies.push(_items[i].fontStyle.font.family);
        customUrls.push(_items[i].fontStyle.font.url);
      }
    }

    if (customFamilies.length > 0) {
      loadCustomFonts(customFamilies, customUrls, function() {
        if (googleFamilies.length > 0) {
          loadGoogleFonts(googleFamilies, onFontsLoaded);
        }
        else {
          onFontsLoaded();
        }
      });
    }
    else if (googleFamilies.length > 0) {
      loadGoogleFonts(googleFamilies, onFontsLoaded);
    }
    else {
      onFontsLoaded();
    }
  }

  /* Load custom fonts. */
  function loadCustomFonts(families, urls, cb) {
    WebFont.load({
      custom: {
        families: families,
        urls: urls
      },
      active: function() {
        cb();
      },
      inactive: function() {
        cb();
      },
      timeout: 2000
    });
  }

  /* Load Google fonts. */
  function loadGoogleFonts(families, cb) {
    WebFont.load({
      google: {
        families: families
      },
      active: function() {
        cb();
      },
      inactive: function() {
        cb();
      },
      timeout: 2000
    });
  }

  /* Handler for when custom and Google fonts have been loaded. */
  function onFontsLoaded() {
    drawItems();
    fillScroller();

    // Width of the secondary canvas needs to equal the width of all of the text.
    _secondary.width = _xpos;

    // Setting the width again resets the canvas so it needs to be redrawn.
    drawItems();
    fillScroller();

    TweenLite.ticker.addEventListener("tick", draw);

    _scroller.dispatchEvent(new CustomEvent("ready", { "bubbles": true }));
  }

  function drawItems() {
    _xpos = 0;

    for (var i = 0; i < _items.length; i++) {
      drawItem(_items[i]);
    }
  }

  function drawItem(item) {
    var textObj = {},
      fontStyle;

    if (item) {
      textObj.text = _utils.unescapeHTML(item.text) + " ";

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

      drawText(textObj);
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

    // Draw the text onto the canvas.
    _secondaryCtx.translate(0, _secondary.height / 2);
    _secondaryCtx.fillText(textObj.text, _xpos, 0);

    _xpos += _secondaryCtx.measureText(textObj.text).width;

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
        drawItem(_items[index]);

        width = _xpos - _originalXpos;
        index = (index === _items.length - 1) ? 0 : index + 1;
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

    // Fonts need to be loaded before drawing to the canvas.
    loadFonts();
  }

  function play() {
    if (!_tween) {
      _tween = TweenLite.to(_scrollerCtx, getDelay(), { xpos: -_originalXpos, ease: Linear.easeNone, onComplete: onComplete });
    }

    _tween.play();
  }

  function pause() {
    _tween.pause();
  }

  return {
    init: init,
    play: play,
    pause: pause
  };
};
