/* global WebFont */

var RiseVision = RiseVision || {};

RiseVision.Common = RiseVision.Common || {};

RiseVision.Common.Utilities = (function() {

  function getFontCssStyle(className, fontObj) {
    var family = "font-family: " + decodeURIComponent(fontObj.font.family).replace(/'/g, "") + "; ";
    var color = "color: " + (fontObj.color ? fontObj.color : fontObj.forecolor) + "; ";
    var size = "font-size: " + (fontObj.size.indexOf("px") === -1 ? fontObj.size + "px; " : fontObj.size + "; ");
    var weight = "font-weight: " + (fontObj.bold ? "bold" : "normal") + "; ";
    var italic = "font-style: " + (fontObj.italic ? "italic" : "normal") + "; ";
    var underline = "text-decoration: " + (fontObj.underline ? "underline" : "none") + "; ";
    var highlight = "background-color: " + (fontObj.highlightColor ? fontObj.highlightColor : fontObj.backcolor) + ";";

    return "." + className + " {" + family + color + size + weight + italic + underline + highlight + "}";
  }

  function addCSSRules(rules) {
    var style = document.createElement("style");

    for (var i = 0, length = rules.length; i < length; i++) {
      style.appendChild(document.createTextNode(rules[i]));
    }

    document.head.appendChild(style);
  }

  /*
   * Loads Google or custom fonts, if applicable, and injects CSS styles
   * into the head of the document.
   *
   * @param    array    settings    Array of objects with the following form:
 *                                   [{
 *                                     "class": "date",
 *                                     "fontSetting": {
 *                                         bold: true,
 *                                         color: "black",
 *                                         font: {
 *                                           family: "Akronim",
 *                                           font: "Akronim",
 *                                           name: "Verdana",
 *                                           type: "google",
 *                                           url: "http://custom-font-url"
 *                                         },
 *                                         highlightColor: "transparent",
 *                                         italic: false,
 *                                         size: "20",
 *                                         underline: false
 *                                     }
 *                                   }]
   *
   *           object   contentDoc    Document object into which to inject styles
   *                                  and load fonts (optional).
   */
  function loadFonts(settings, cb) {
    var families = null,
      googleFamilies = [],
      customFamilies = [],
      customUrls = [];

    function callback() {
      if (cb && typeof cb === "function") {
        cb();
      }
    }

    function onGoogleFontsLoaded() {
      callback();
    }

    if (!settings || settings.length === 0) {
      callback();
      return;
    }

    // Check for custom css class names and add rules if so
    settings.forEach(function(item) {
      if (item.class && item.fontStyle) {
        addCSSRules([ getFontCssStyle(item.class, item.fontStyle) ]);
      }
    });

    // Google fonts
    for (var i = 0; i < settings.length; i++) {
      if (settings[i].fontStyle && settings[i].fontStyle.font.type &&
        (settings[i].fontStyle.font.type === "google")) {
        // Remove fallback font.
        families = settings[i].fontStyle.font.family.split(",")[0];

        // strip possible single quotes
        families = families.replace(/'/g, "");

        googleFamilies.push(families);
      }
    }

    // Custom fonts
    for (i = 0; i < settings.length; i++) {
      if (settings[i].fontStyle && settings[i].fontStyle.font.type &&
        (settings[i].fontStyle.font.type === "custom")) {
        // decode value and strip single quotes
        customFamilies.push(decodeURIComponent(settings[i].fontStyle.font.family).replace(/'/g, ""));
        // strip single quotes
        customUrls.push(settings[i].fontStyle.font.url.replace(/'/g, "\\'"));
      }
    }

    if (googleFamilies.length === 0 && customFamilies.length === 0) {
      callback();
    }
    else {
      // Load the fonts
      for (var j = 0; j < customFamilies.length; j += 1) {
        loadCustomFont(customFamilies[j], customUrls[j]);
      }

      if (googleFamilies.length > 0) {
        loadGoogleFonts(googleFamilies, onGoogleFontsLoaded);
      }
      else {
        callback();
      }
    }
  }

  function loadCustomFont(family, url, contentDoc) {
    var sheet = null;
    var rule = "font-family: " + family + "; " + "src: url('" + url + "');";

    contentDoc = contentDoc || document;

    sheet = contentDoc.styleSheets[0];

    if (sheet !== null) {
      sheet.addRule("@font-face", rule);
    }
  }

  function loadGoogleFonts(families, cb) {
    WebFont.load({
      google: {
        families: families
      },
      active: function() {
        if (cb && typeof cb === "function") {
          cb();
        }
      },
      inactive: function() {
        if (cb && typeof cb === "function") {
          cb();
        }
      },
      timeout: 5000
    });
  }

  function loadScript( src ) {
    var script = document.createElement( "script" );

    script.src = src;
    document.body.appendChild( script );
  }

  function preloadImages(urls) {
    var length = urls.length,
      images = [];

    for (var i = 0; i < length; i++) {
      images[i] = new Image();
      images[i].src = urls[i];
    }
  }

  /**
   * Get the current URI query param
   */
  function getQueryParameter(param) {
    return getQueryStringParameter(param, window.location.search.substring(1));
  }

  /**
   * Get the query parameter from a query string
   */
  function getQueryStringParameter(param, query) {
    var vars = query.split("&"),
      pair;

    for (var i = 0; i < vars.length; i++) {
      pair = vars[i].split("=");

      if (pair[0] == param) { // jshint ignore:line
        return decodeURIComponent(pair[1]);
      }
    }

    return "";
  }

  /**
   * Get date object from player version string
   */
  function getDateObjectFromPlayerVersionString(playerVersion) {
    var reggie = /(\d{4})\.(\d{2})\.(\d{2})\.(\d{2})\.(\d{2})/;
    var dateArray = reggie.exec(playerVersion);
    if (dateArray) {
      return new Date(
        (+dateArray[1]),
          (+dateArray[2])-1, // Careful, month starts at 0!
        (+dateArray[3]),
        (+dateArray[4]),
        (+dateArray[5])
      );
    } else {
      return;
    }
  }

  function getRiseCacheErrorMessage(statusCode) {
    var errorMessage = "";
    switch (statusCode) {
      case 404:
        errorMessage = "The file does not exist or cannot be accessed.";
        break;
      case 507:
        errorMessage = "There is not enough disk space to save the file on Rise Cache.";
        break;
      default:
        errorMessage = "There was a problem retrieving the file from Rise Cache.";
    }

    return errorMessage;
  }

  function unescapeHTML(html) {
    var div = document.createElement("div");

    div.innerHTML = html;

    return div.textContent;
  }

  function hasInternetConnection(filePath, callback) {
    var xhr = new XMLHttpRequest();

    if (!filePath || !callback || typeof callback !== "function") {
      return;
    }

    xhr.open("HEAD", filePath + "?cb=" + new Date().getTime(), false);

    try {
      xhr.send();

      callback((xhr.status >= 200 && xhr.status < 304));

    } catch (e) {
      callback(false);
    }
  }

  /**
   * Check if chrome version is under a certain version
   */
  function isLegacy() {
    var legacyVersion = 25;

    var match = navigator.userAgent.match(/Chrome\/(\S+)/);
    var version = match ? match[1] : 0;

    if (version) {
      version = parseInt(version.substring(0,version.indexOf(".")));

      if (version <= legacyVersion) {
        return true;
      }
    }

    return false;
  }

  /**
   * Adds http:// or https:// protocol to url if the protocol is missing
   */
  function addProtocol(url, secure) {
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
      url = ((secure) ? "https://" : "http://") + url;
    }
    return url;
  }

  return {
    addProtocol:              addProtocol,
    getQueryParameter:        getQueryParameter,
    getQueryStringParameter:  getQueryStringParameter,
    getFontCssStyle:          getFontCssStyle,
    addCSSRules:              addCSSRules,
    loadFonts:                loadFonts,
    loadCustomFont:           loadCustomFont,
    loadGoogleFonts:          loadGoogleFonts,
    loadScript:               loadScript,
    preloadImages:            preloadImages,
    getRiseCacheErrorMessage: getRiseCacheErrorMessage,
    unescapeHTML:             unescapeHTML,
    hasInternetConnection:    hasInternetConnection,
    isLegacy:                 isLegacy,
    getDateObjectFromPlayerVersionString: getDateObjectFromPlayerVersionString
  };
})();

/* exported WIDGET_COMMON_CONFIG */
var WIDGET_COMMON_CONFIG = {
  AUTH_PATH_URL: "v1/widget/auth",
  LOGGER_CLIENT_ID: "1088527147109-6q1o2vtihn34292pjt4ckhmhck0rk0o7.apps.googleusercontent.com",
  LOGGER_CLIENT_SECRET: "nlZyrcPLg6oEwO9f9Wfn29Wh",
  LOGGER_REFRESH_TOKEN: "1/xzt4kwzE1H7W9VnKB8cAaCx6zb4Es4nKEoqaYHdTD15IgOrJDtdun6zK6XiATCKT",
  STORE_URL: "https://store-dot-rvaserver2.appspot.com/"
};
/* global RiseVision */
/* exported CollectionTimes */

/*
 * Singleton object to handle retrieving collection times for a historical instrument.
 */
var CollectionTimes = (function() {
  //Private variables and functions.
  var instantiated = false, instruments = [];

  function init() {
    //Issue 903 Start
    function loadCollectionTimes(instrument, callback) {
      var updateInterval = 60000, viz = new RiseVision.Common.Visualization(), options;

      //Start a timer in case there is a problem loading the data (i.e. Internet has been disconnected).
      var collectionTimesTimer = setTimeout(function() {
        loadCollectionTimes(instrument, callback);
      }, updateInterval);

      options = {
        //Change me for Production.
        url : "http://contentfinancial2.appspot.com/info?codes=" + instrument,
        refreshInterval : 0,
        queryString : "select startTime, endTime, daysOfWeek, timeZoneOffset, updateInterval",
        callback : function(result, timer) {
          viz = null;

          if (result !== null) {
            clearTimeout(timer);
            saveCollectionTimes(instrument, result);
            callback();
          }
          //Timeout or some other error occurred.
          else {
            console.log("Error encountered loading collection times for: " + instrument);
          }
        },
        params : collectionTimesTimer
      };

      viz.getData(options);
    }

    //Issue 903 End

    function saveCollectionTimes(instrument, data) {
      var numRows, startTime, endTime, timeZoneOffset;

      if (data !== null) {
        numRows = data.getNumberOfRows();

        for (var i = 0; i < instruments.length; i++) {
          if (instruments[i].instrument === instrument) {
            timeZoneOffset = data.getValue(0, 3);
            startTime = data.getValue(0, 0);
            endTime = data.getValue(0, 1);

            instruments[i].collectionTimes = {
              "instrument" : instrument,
              "startTime" : startTime.setTimezoneOffset(timeZoneOffset),
              "endTime" : endTime.setTimezoneOffset(timeZoneOffset),
              "daysOfWeek" : data.getFormattedValue(0, 2).split(","),
              "timeZoneOffset" : timeZoneOffset,
              "isUpdated" : true
            };

            break;
          }
        }
      }
    }

    return {
      setIsUpdated : function(instrument, isUpdated) {
        for (var i = 0; i < instruments.length; i++) {
          if (instruments[i].instrument === instrument) {
            if (instruments[i].collectionTimes !== null) {
              instruments[i].collectionTimes.isUpdated = isUpdated;
            }
          }
        }
      },
      addInstrument : function(instrument, now, callback) {
        var i = 0, instrumentFound = false, collectionTimesFound = false;

        //Check if there is already collection data for this instrument.
        for (; i < instruments.length; i++) {
          if (instruments[i].instrument === instrument) {
            //Issue 922 Start
            if (instruments[i].collectionTimes !== null) {
              if ((!Date.equals(Date.today(), now)) && (!instruments[i].collectionTimes.isUpdated)) {
                now = Date.today();
                instruments[i].collectionTimes.startTime.addDays(1);
                instruments[i].collectionTimes.endTime.addDays(1);
                instruments[i].collectionTimes.isUpdated = true;
              }

              collectionTimesFound = true;
            }
            //Issue 922 End

            instrumentFound = true;
            break;
          }
        }

        if (collectionTimesFound) {
          callback(instruments[i].collectionTimes, now);
        }
        else {
          if (!instrumentFound) {
            instruments.push({
              instrument : instrument,
              collectionTimes : null
            });
          }

          loadCollectionTimes(instrument, function() {
            callback(instruments[i].collectionTimes, now);
          });
        }
      }
    };
  }

  //Public functions.
  return {
    getInstance : function() {
      if (!instantiated) {
        instantiated = init();
      }

      return instantiated;
    }
  };
})();
var RiseVision = RiseVision || {};
RiseVision.Common = RiseVision.Common || {};
RiseVision.Common.Financial = RiseVision.Common.Financial || {};

RiseVision.Common.Financial.Helper = {};

RiseVision.Common.Financial.Helper = function(instruments) {
  this.instruments = instruments;
};

RiseVision.Common.Financial.Helper.prototype.setInstruments = function(instruments) {
  this.instruments = instruments;
};

RiseVision.Common.Financial.Helper.prototype.getInstruments = function(isLoading, collectionTimes) {
  var self = this;

  if (isLoading) {
    return this.instruments.join("|");
  }
  else {
    var dayOfWeek = new Date().getDay(), len = collectionTimes.length, instruments = [];

    $.each(this.instruments, function(i, instrument) {
      for (var j = 0; j < len; j++) {
        if (instrument === collectionTimes[j].instrument) {
          var startTime = collectionTimes[j].startTime, endTime = collectionTimes[j].endTime, daysOfWeek = collectionTimes[j].daysOfWeek;

          //Check if the instrument should be requested again based on its collection data.
          $.each(daysOfWeek, function(j, day) { // jshint ignore:line
            //Check collection day.
            // TODO: Use strict type comparison (===)
            if (day == dayOfWeek) { // jshint ignore:line
              //Check collection time.
              if (new Date().between(startTime, endTime)) {
                instruments.push(self.instruments[i]);
              }

              return false;
            }
          });
        }
      }
    });

    return instruments.join("|");
  }
};

/* global CollectionTimes */

var RiseVision = RiseVision || {};
RiseVision.Common = RiseVision.Common || {};
RiseVision.Common.Financial = RiseVision.Common.Financial || {};

RiseVision.Common.Financial.Historical = {};
RiseVision.Common.Financial.Historical.CollectionTimes = {};

RiseVision.Common.Financial.Historical = function(displayID, instrument, duration) {
  if (displayID) {
    this.displayID = displayID;
  }
  else {
    this.displayID = "preview";
  }

  this.instrument = instrument;
  this.duration = duration;
  this.isLoading = true;
  this.updateInterval = 60000;
  this.now = Date.today();
  //Issue 922
  this.url = "https://contentfinancial2.appspot.com/data/historical?";
  this.historicalViz = new RiseVision.Common.Visualization();
  this.helper = new RiseVision.Common.Financial.Helper([this.instrument]);
};

RiseVision.Common.Financial.Historical.prototype.setInstrument = function(instrument) {
  this.isLoading = true;
  this.instrument = instrument;
  this.helper.setInstruments([this.instrument]);
};

RiseVision.Common.Financial.Historical.prototype.setDuration = function(duration) {
  this.duration = duration;
};

RiseVision.Common.Financial.Historical.prototype.setIsUpdated = function(isUpdated) {
  CollectionTimes.getInstance().setIsUpdated(this.instrument, isUpdated);
};
/* Historical Financial data - Only one stock can be requested at a time. */
RiseVision.Common.Financial.Historical.prototype.getHistoricalData = function(fields, callback, options) {
  var self = this, queryString = "select " + fields.join() + " ORDER BY tradeTime", codes = "";

  //Customize the query string.
  if (options) {
    if (options.sortOrder) {
      if (options.sortOrder === "desc") {
        queryString += " desc";
      }
    }

    if (options.limit) {
      queryString += " LIMIT " + options.limit;
    }
  }

  CollectionTimes.getInstance().addInstrument(this.instrument, this.now, function(times, now) {
    self.now = now;
    codes = self.helper.getInstruments(self.isLoading, [times]);

    //Perform a search for the instrument.
    if (codes) {
      options = {
        url : self.url + "id=" + self.displayID + "&code=" + self.instrument + "&kind=" + self.duration,
        refreshInterval : 0,
        queryString : queryString,
        callback : function histCallback(data) {
          self.onHistoricalDataLoaded(data, times, callback);
        }
      };

      //Start a timer in case there is a problem loading the data (i.e. Internet has been disconnected).
      self.getHistoricalDataTimer = setTimeout(function() {
        self.getHistoricalData(fields, callback, options);
      }, self.updateInterval);

      self.historicalViz.getData(options);
    }
    //Request has been made outside of collection times.
    else {
      callback(null);
    }
  });
};

RiseVision.Common.Financial.Historical.prototype.onHistoricalDataLoaded = function(data, times, callback) {
  var numDataRows = 0;

  if (data !== null) {
    clearTimeout(this.getHistoricalDataTimer);

    this.historicalData = data;
    numDataRows = data.getNumberOfRows();

    if ((numDataRows === 0) || ((numDataRows === 1) && (data.getFormattedValue(0, 0) === "0"))) {
      this.isLoading = true;
    }
    else {
      this.isLoading = false;
    }

    if (this.historicalData !== null) {
      callback({
        "data" : this.historicalData,
        "collectionData" : times
      });
    }
    else {
      callback({
        "collectionData" : times
      });
    }
  }
  //Timeout or some other error occurred.
  else {
    console.log("Error encountered loading historical data for: ");
    console.log(this);
  }
};

var RiseVision = RiseVision || {};
RiseVision.Common = RiseVision.Common || {};
RiseVision.Common.Financial = RiseVision.Common.Financial || {};

RiseVision.Common.Financial.RealTime = {};

RiseVision.Common.Financial.RealTime = function(displayID, instruments, store_auth) {
  this.instruments = instruments;
  this.isLoading = true;
  this.conditions = {};
  this.collectionTimes = [];
  this.updateInterval = 60000;
  this.now = Date.today();
  //Issue 922
  this.url = "https://contentfinancial2.appspot.com/data?";
  this.logosURL = "https://s3.amazonaws.com/risecontentlogos/financial/";
  this.viz = new RiseVision.Common.Visualization();
  this.helper = new RiseVision.Common.Financial.Helper(this.instruments);

  this._getDisplayId = function() {
    if (displayID && store_auth.isAuthorized()) {
      return displayID;
    }
    else {
      return "preview";
    }
  };

  this._saveCollectionTimes = function() {
    var numRows;

    numRows = this.data.getNumberOfRows();

    //Only need to save collection time once for the entire chain.
    //Use the collection data from the first stock since the rest should all be the same.
    //Data is for a chain if there is only one instrument being requested, but multiple rows of data are returned.
    if ((this.instruments.length === 1) && (this.data.getNumberOfRows() > 1)) {
      this._saveCollectionTime(0);
    }
    //Save collection data for each stock.
    else {
      for (var row = 0; row < numRows; row++) {
        this._saveCollectionTime(row);
      }

      if (this.collectionTimes.length === 0) {
        console.log(this.collectionTimes);
      }
    }
  };

  this._saveCollectionTime = function(row) {
    var timeZoneOffset, startTime, endTime;

    if (this.data.getValue(row, 0) !== "INVALID_SYMBOL") {
      // If the data is stale, then force collection times to be saved again later.
      if (this.data.getValue(row, 0) === "...") {
        this.isLoading = true;
      }
      else {
        timeZoneOffset = this.data.getValue(row, this.startTimeIndex + 3);
        startTime = this.data.getValue(row, this.startTimeIndex);
        endTime = this.data.getValue(row, this.startTimeIndex + 1);

        if (startTime && endTime && timeZoneOffset !== "N/P") {
          this.collectionTimes.push({
            "instrument" : this.instruments[row],
            "startTime" : startTime.setTimezoneOffset(timeZoneOffset),
            "endTime" : endTime.setTimezoneOffset(timeZoneOffset),
            "daysOfWeek" : this.data.getFormattedValue(row, this.startTimeIndex + 2).split(",")
          });
        }
      }
    }
  };
};

RiseVision.Common.Financial.RealTime.prototype.setInstruments = function(instruments) {
  //Trim any whitespace from instruments.
  instruments = instruments.split(",");

  $.each(instruments, function(index) {
    instruments[index] = $.trim(instruments[index]);
  });

  this.isLoading = true;
  this.collectionTimes = [];
  this.instruments = instruments;
  this.helper.setInstruments(this.instruments);
};

/* fields is an array of fields to request from data server. Note: instrument column is always requested. */
/* Financial Data */
RiseVision.Common.Financial.RealTime.prototype.getData = function(fields, loadLogos, isChain, callback) {
  var self = this, duplicateFound = false, fieldCount = 0, queryString = "select instrument", codes = "";

  this.dataFields = {};
  this.dataFields.instrument = 0;

  //TODO: Get rid of startTimeIndex and append instruments as last column?
  this.startTimeIndex = 1;
  //Used to determine where collection data columns are.

  if (this.isLoading) {
    this.callback = callback;
  }

  //Build the query string.
  $.each(fields, function(index, field) {
    duplicateFound = false;

    if (field !== "instrument") {
      //Visualization API doesn't allow requesting the same field more than once.
      $.each(self.dataFields, function(i) {
        if (i === field) {
          duplicateFound = true;
          return false;
        }
      });

      if (!duplicateFound) {
        queryString += ", " + field;
        //Create a mapping between field names and column indices.
        self.dataFields[field] = fieldCount + 1;
        fieldCount++;
        self.startTimeIndex++;
      }
    }
  });

  this.logoCount = 0;
  queryString += ", startTime, endTime, daysOfWeek, timeZoneOffset";

  //Issue 922 Start
  if (!Date.equals(Date.today(), this.now)) {
    this.now = Date.today();

    for (var i = 0; i < this.collectionTimes.length; i++) {
      this.collectionTimes[i].startTime.addDays(1);
      this.collectionTimes[i].endTime.addDays(1);
    }
  }
  //Issue 922 End

  codes = this.helper.getInstruments(this.isLoading, this.collectionTimes);

  //Perform a search for the instruments.
  if (codes) {
    var options = {
      url : this.url + "id=" + this._getDisplayId() + "&codes=" + codes,
      refreshInterval : 0,
      queryString : queryString,
      callback : function rtCallback(data) {
        self.onRealTimeDataLoaded(data, loadLogos, isChain);
      }
    };

    //Start a timer in case there is a problem loading the data (i.e. Internet has been disconnected).
    this.getDataTimer = setTimeout(function() {
      self.getData(fields, loadLogos, isChain, callback);
    }, this.updateInterval);

    this.viz.getData(options);
  }
  else {
    callback(null);
  }
};

RiseVision.Common.Financial.RealTime.prototype.onRealTimeDataLoaded = function(data, loadLogos, isChain) {
  if (data !== null) {
    clearTimeout(this.getDataTimer);

    this.data = data;

    if (this.isLoading) {
      this.isLoading = false;

      if (this.collectionTimes.length === 0) {
        this._saveCollectionTimes();
      }

      if (loadLogos) {
        this.loadLogos();
      }
      else {
        if (this.callback) {
          this.callback(this.data, this.logoURLs);
        }
      }
    }
    else {
      if (loadLogos && isChain) {
        this.loadLogos();
      }
      else {
        if (this.callback) {
          this.callback(this.data, this.logoURLs);
        }
      }
    }
  }
  //Timeout or some other error occurred.
  else {
    console.log("Error encountered loading real-time data for: ");
    console.log(this.instruments[0]);
  }
};

//Preload the logos.
RiseVision.Common.Financial.RealTime.prototype.loadLogos = function() {
  var numRows = this.data.getNumberOfRows();

  this.logoCount = 0;
  this.urls = [];
  this.logoURLs = [];

  for (var row = 0; row < numRows; row++) {
    this.urls.push(this.logosURL + this.data.getFormattedValue(row, 0) + ".svg");
  }

  this.loadLogo(this.urls.length);
};

//Load each logo.
RiseVision.Common.Financial.RealTime.prototype.loadLogo = function(toLoad) {
  var logo, self = this;

  logo = new Image();
  logo.onload = function() {
    self.logoURLs.push(logo.src);
    self.onLogoLoaded(toLoad);
  };

  logo.onerror = function() {
    self.logoURLs.push(null);
    self.onLogoLoaded(toLoad);
  };

  logo.src = this.urls[this.logoCount];
};

RiseVision.Common.Financial.RealTime.prototype.onLogoLoaded = function(toLoad) {
  this.logoCount++;
  toLoad--;

  if (toLoad === 0) {
    if (this.callback) {
      this.callback(this.data, this.logoURLs);
    }
  }
  else {
    this.loadLogo(toLoad);
  }
};

/* Conditions */
RiseVision.Common.Financial.RealTime.prototype.checkSigns = function(field) {
  var row = 0, numRows = 0, signs = [], current, sign;

  for (row = 0, numRows = this.data.getNumberOfRows(); row < numRows; row++) {
    current = this.data.getValue(row, this.dataFields[field]);

    if (isNaN(current)) {
      current = current.replace(/[^0-9\.-]+/g, "");
      current = parseFloat(current);
    }

    if (!isNaN(current)) {
      if (current >= 0) {
        sign = 1;
      }
      else {
        sign = -1;
      }

      signs.push(sign);
    }
  }

  return signs;
};

/* Return 1 if current value is greater than the previous value.
 Return 0 if both values are equal.
 Return -1 if current value is less than the previous value. */
RiseVision.Common.Financial.RealTime.prototype.compare = function(field) {
  var self = this, row = 0, numRows = 0, current = 0, previous = 0, result = [], matchFound = false;

  if (this.conditions[field]) {
    for ( row = 0, numRows = this.data.getNumberOfRows(); row < numRows; row++) {
      current = this.data.getValue(row, this.dataFields[field]);
      matchFound = false;

      $.each(this.conditions[field], function(index, value) { // jshint ignore:line
        //Instrument is used to ensure that the rows that are being compared are for the same stock.
        //In chains, rows may be added or deleted.
        if (value.instrument === self.data.getValue(row, 0)) {
          previous = value.value;

          if (isNaN(current)) {
            current = current.replace(/[^0-9\.-]+/g, "");
            current = parseFloat(current);
          }

          if (isNaN(previous)) {
            previous = previous.replace(/[^0-9\.-]+/g, "");
            previous = parseFloat(previous);
          }

          //The data type of a column can still be a number even if there is string data in it.
          //To be sure, let's check that the values we are comparing are numbers.
          if (!isNaN(current) && !isNaN(previous)) {
            if (current != previous) {  // jshint ignore:line
              if (current > previous) {
                result.push(1);
              }
              else {
                result.push(-1);
              }
            }
            //They are equal.
            else {
              result.push(0);
            }
          }

          matchFound = true;

          return false;
        }
      });

      //No match found for this instrument (ie it's new).
      if (!matchFound) {
        result.push(0);
      }
    }
  }

  this.saveBeforeValues([field]);

  return result;
};

RiseVision.Common.Financial.RealTime.prototype.saveBeforeValues = function(fields) {
  var self = this;

  $.each(fields, function(index, value) {
    self.conditions[value] = [];
    self.saveBeforeValue(value, self.dataFields[value]);
  });
};

/* Store the current values so they can be compared to new values on a refresh. */
RiseVision.Common.Financial.RealTime.prototype.saveBeforeValue = function(field, colIndex) {
  for (var row = 0, numRows = this.data.getNumberOfRows(); row < numRows; row++) {
    this.conditions[field].push({
      "instrument" : this.data.getValue(row, 0),
      "value" : this.data.getValue(row, colIndex)
    });
  }
};

/* global WIDGET_COMMON_CONFIG */

var RiseVision = RiseVision || {};
RiseVision.Common = RiseVision.Common || {};

RiseVision.Common.LoggerUtils = (function() {
  "use strict";

   var displayId = "",
     companyId = "",
     version = null;

  /*
   *  Private Methods
   */

  /* Retrieve parameters to pass to the event logger. */
  function getEventParams(params, cb) {
    var json = null;

    // event is required.
    if (params.event) {
      json = params;

      if (json.file_url) {
        json.file_format = params.file_format || getFileFormat(json.file_url);
      }

      json.company_id = companyId;
      json.display_id = displayId;

      if (version) {
        json.version = version;
      }

      cb(json);
    }
    else {
      cb(json);
    }
  }

  // Get suffix for BQ table name.
  function getSuffix() {
    var date = new Date(),
      year = date.getUTCFullYear(),
      month = date.getUTCMonth() + 1,
      day = date.getUTCDate();

    if (month < 10) {
      month = "0" + month;
    }

    if (day < 10) {
      day = "0" + day;
    }

    return "" + year + month + day;
  }

  /*
   *  Public Methods
   */
  function getFileFormat(url) {
    var hasParams = /[?#&]/,
      str;

    if (!url || typeof url !== "string") {
      return null;
    }

    str = url.substr(url.lastIndexOf(".") + 1);

    // don't include any params after the filename
    if (hasParams.test(str)) {
      str = str.substr(0 ,(str.indexOf("?") !== -1) ? str.indexOf("?") : str.length);

      str = str.substr(0, (str.indexOf("#") !== -1) ? str.indexOf("#") : str.length);

      str = str.substr(0, (str.indexOf("&") !== -1) ? str.indexOf("&") : str.length);
    }

    return str.toLowerCase();
  }

  function getInsertData(params) {
    var BASE_INSERT_SCHEMA = {
      "kind": "bigquery#tableDataInsertAllRequest",
      "skipInvalidRows": false,
      "ignoreUnknownValues": false,
      "templateSuffix": getSuffix(),
      "rows": [{
        "insertId": ""
      }]
    },
    data = JSON.parse(JSON.stringify(BASE_INSERT_SCHEMA));

    data.rows[0].insertId = Math.random().toString(36).substr(2).toUpperCase();
    data.rows[0].json = JSON.parse(JSON.stringify(params));
    data.rows[0].json.ts = new Date().toISOString();

    return data;
  }

  function logEvent(table, params) {
    getEventParams(params, function(json) {
      if (json !== null) {
        RiseVision.Common.Logger.log(table, json);
      }
    });
  }

  function logEventToPlayer(table, params) {
    try {
      top.postToPlayer( {
        message: "widget-log",
        table: table,
        params: JSON.stringify(params),
        suffix: getSuffix()
      } );
    } catch (err) {
      console.log("widget-common.logEventToPlayer", err);
    }
  }

  /* Set the Company and Display IDs. */
  function setIds(company, display) {
    companyId = company;
    displayId = display;
  }

  function setVersion(value) {
    version = value;
  }

  return {
    "getInsertData": getInsertData,
    "getFileFormat": getFileFormat,
    "logEvent": logEvent,
    "logEventToPlayer": logEventToPlayer,
    "setIds": setIds,
    "setVersion": setVersion
  };
})();

RiseVision.Common.Logger = (function(utils) {
  "use strict";

  var REFRESH_URL = "https://www.googleapis.com/oauth2/v3/token?client_id=" + WIDGET_COMMON_CONFIG.LOGGER_CLIENT_ID +
      "&client_secret=" + WIDGET_COMMON_CONFIG.LOGGER_CLIENT_SECRET +
      "&refresh_token=" + WIDGET_COMMON_CONFIG.LOGGER_REFRESH_TOKEN +
      "&grant_type=refresh_token";

  var serviceUrl = "https://www.googleapis.com/bigquery/v2/projects/client-side-events/datasets/Widget_Events/tables/TABLE_ID/insertAll",
    throttle = false,
    throttleDelay = 1000,
    lastEvent = "",
    refreshDate = 0,
    token = "";

  /*
   *  Private Methods
   */
  function refreshToken(cb) {
    var xhr = new XMLHttpRequest();

    if (new Date() - refreshDate < 3580000) {
      return cb({});
    }

    xhr.open("POST", REFRESH_URL, true);
    xhr.onloadend = function() {
      var resp = {};
      try {
        resp = JSON.parse(xhr.response);
      } catch(e) {
        console.warn("Can't refresh logger token - ", e.message);
      }
      cb({ token: resp.access_token, refreshedAt: new Date() });
    };

    xhr.send();
  }

  function isThrottled(event) {
    return throttle && (lastEvent === event);
  }

  /*
   *  Public Methods
   */
  function log(tableName, params) {
    if (!tableName || !params || (params.hasOwnProperty("event") && !params.event) ||
      (params.hasOwnProperty("event") && isThrottled(params.event))) {
      return;
    }

    // don't log if display id is invalid or preview/local
    if (!params.display_id || params.display_id === "preview" || params.display_id === "display_id" ||
      params.display_id === "displayId") {
      return;
    }

    try {
      if ( top.postToPlayer && top.enableWidgetLogging ) {
        // send log data to player instead of BQ
        return utils.logEventToPlayer( tableName, params );
      }
    } catch ( e ) {
      console.log( "widget-common: logger", e );
    }

    throttle = true;
    lastEvent = params.event;

    setTimeout(function () {
      throttle = false;
    }, throttleDelay);

    function insertWithToken(refreshData) {
      var xhr = new XMLHttpRequest(),
        insertData, url;

      url = serviceUrl.replace("TABLE_ID", tableName);
      refreshDate = refreshData.refreshedAt || refreshDate;
      token = refreshData.token || token;
      insertData = utils.getInsertData(params);

      // Insert the data.
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("Authorization", "Bearer " + token);

      if (params.cb && typeof params.cb === "function") {
        xhr.onloadend = function() {
          params.cb(xhr.response);
        };
      }

      xhr.send(JSON.stringify(insertData));
    }

    return refreshToken(insertWithToken);
  }

  return {
    "log": log
  };
})(RiseVision.Common.LoggerUtils);

var RiseVision = RiseVision || {};
RiseVision.Common = RiseVision.Common || {};

RiseVision.Common.Message = function (mainContainer, messageContainer) {
  "use strict";

  var _active = false;

  function _init() {
    try {
      messageContainer.style.height = mainContainer.style.height;
    } catch (e) {
      console.warn("Can't initialize Message - ", e.message);
    }
  }

  /*
   *  Public Methods
   */
  function hide() {
    if (_active) {
      // clear content of message container
      while (messageContainer.firstChild) {
        messageContainer.removeChild(messageContainer.firstChild);
      }

      // hide message container
      messageContainer.style.display = "none";

      // show main container
      mainContainer.style.display = "block";

      _active = false;
    }
  }

  function show(message) {
    var fragment = document.createDocumentFragment(),
      p;

    if (!_active) {
      // hide main container
      mainContainer.style.display = "none";

      messageContainer.style.display = "block";

      // create message element
      p = document.createElement("p");
      p.innerHTML = message;
      p.setAttribute("class", "message");

      fragment.appendChild(p);
      messageContainer.appendChild(fragment);

      _active = true;
    } else {
      // message already being shown, update message text
      p = messageContainer.querySelector(".message");
      p.innerHTML = message;
    }
  }

  _init();

  return {
    "hide": hide,
    "show": show
  };
};

var RiseVision = RiseVision || {};
RiseVision.Common = RiseVision.Common || {};

RiseVision.Common.RiseCache = (function () {
  "use strict";

  var BASE_CACHE_URL = "http://localhost:9494/";

  var _pingReceived = false,
    _isCacheRunning = false,
    _isV2Running = false,
    _isHttps = true,
    _utils = RiseVision.Common.Utilities,
    _RC_VERSION_WITH_ENCODE = "1.7.3",
    _RC_VERSION = "";

  function ping(callback) {
    var r = new XMLHttpRequest(),
      /* jshint validthis: true */
      self = this;

    if (!callback || typeof callback !== "function") {
      return;
    }

    if (!_isV2Running) {
      r.open("GET", BASE_CACHE_URL + "ping?callback=_", true);
    }
    else {
      r.open("GET", BASE_CACHE_URL, true);
    }

    r.onreadystatechange = function () {
      try {
        if (r.readyState === 4 ) {
          // save this result for use in getFile()
          _pingReceived = true;

          if(r.status === 200) {
            _isCacheRunning = true;

            try {
              var responseObject = (r.responseText) ? JSON.parse(r.responseText) : "";
              if (responseObject) {
                _RC_VERSION = responseObject.version;
              }
            }
            catch(e) {
              console.log(e);
            }

            callback(true, r.responseText);
          } else if (r.status === 404) {
            // Rise Cache V2 is running
            _isV2Running = true;

            BASE_CACHE_URL = "https://localhost:9495/";

            // call ping again so correct ping URL is used for Rise Cache V2
            return self.ping(callback);
          } else {

            if ( _isHttps ) {
              _isV2Running = true;
              _isHttps = false;
              BASE_CACHE_URL = "http://localhost:9494/";

              // call ping again so correct ping URL is used for Rise Cache V2 HTTPs
              return self.ping(callback);
            } else {
              console.debug("Rise Cache is not running");
              _isV2Running = false;
              _isCacheRunning = false;

              callback(false, null);
            }
          }
        }
      }
      catch (e) {
        console.debug("Caught exception: ", e.description);
      }

    };
    r.send();
  }

  function getFile(fileUrl, callback, nocachebuster) {
    if (!fileUrl || !callback || typeof callback !== "function") {
      return;
    }

    var totalCacheRequests = 0;

    function fileRequest() {
      var url, str, separator;

      if (_isCacheRunning) {
        if (_isV2Running) {
          if ( _compareVersionNumbers( _RC_VERSION, _RC_VERSION_WITH_ENCODE ) > 0 ) {
            url = BASE_CACHE_URL + "files?url=" + fileUrl;
          } else {
            url = BASE_CACHE_URL + "files?url=" + encodeURIComponent(fileUrl);
          }
        } else {
          // configure url with cachebuster or not
          url = (nocachebuster) ? BASE_CACHE_URL + "?url=" + encodeURIComponent(fileUrl) :
          BASE_CACHE_URL + "cb=" + new Date().getTime() + "?url=" + encodeURIComponent(fileUrl);
        }
      } else {
        if (nocachebuster) {
          url = fileUrl;
        } else {
          str = fileUrl.split("?");
          separator = (str.length === 1) ? "?" : "&";
          url = fileUrl + separator + "cb=" + new Date().getTime();
        }
      }

      makeRequest("HEAD", url);
    }

    function _compareVersionNumbers( v1, v2 ) {
      var v1parts = v1.split( "." ),
        v2parts = v2.split( "." ),
        i = 0;

      function isPositiveInteger( x ) {
        return /^\d+$/.test( x );
      }

      // First, validate both numbers are true version numbers
      function validateParts( parts ) {
        for ( i = 0; i < parts.length; i++ ) {
          if ( !isPositiveInteger( parts[ i ] ) ) {
            return false;
          }
        }
        return true;
      }
      if ( !validateParts( v1parts ) || !validateParts( v2parts ) ) {
        return NaN;
      }

      for ( i = 0; i < v1parts.length; ++i ) {
        if ( v2parts.length === i ) {
          return 1;
        }

        if ( v1parts[ i ] === v2parts[ i ] ) {
          continue;
        }
        if ( v1parts[ i ] > v2parts[ i ] ) {
          return 1;
        }
        return -1;
      }

      if ( v1parts.length !== v2parts.length ) {
        return -1;
      }

      return 0;
    }

    function makeRequest(method, url) {
      var xhr = new XMLHttpRequest(),
        request = {
          xhr: xhr,
          url: url
        };

      if (_isCacheRunning) {
        xhr.open(method, url, true);

        xhr.addEventListener("loadend", function () {
          var status = xhr.status || 0;
          if (status === 202) {
              totalCacheRequests++;
              if (totalCacheRequests < 3) {
                setTimeout(function(){ makeRequest(method, url); }, 3000);
              } else {
                  callback(request, new Error("File is downloading"));
              }
          } else if (status >= 200 && status < 300) {
            callback(request);
          } else {
            // Server may not support HEAD request. Fallback to a GET request.
            if (method === "HEAD") {
              makeRequest("GET", url);
            } else {
              callback(request, new Error("The request failed with status code: " + status));
            }
          }
        });

        xhr.send();
      }
      else {
        // Rise Cache is not running (preview), skip HEAD request and execute callback immediately
        callback(request);
      }

    }

    if (!_pingReceived) {
      /* jshint validthis: true */
      return this.ping(fileRequest);
    } else {
      return fileRequest();
    }

  }

  function getErrorMessage(statusCode) {
    var errorMessage = "";
    switch (statusCode) {
      case 502:
        errorMessage = "There was a problem retrieving the file.";
        break;
      case 504:
        errorMessage = "Unable to download the file. The server is not responding.";
        break;
      case 507:
        errorMessage = "There is not enough disk space to save the file on Rise Cache.";
        break;
      case 534:
        errorMessage = "The file does not exist or cannot be accessed.";
        break;
      default:
        errorMessage = "";
    }

    return errorMessage;
  }

  function isRiseCacheRunning(callback) {
    if (!callback || typeof callback !== "function") {
      return;
    }

    if (!_pingReceived) {
      /* jshint validthis: true */
      return this.ping(function () {
        callback(_isCacheRunning);
      });
    } else {
      callback(_isCacheRunning);
    }
  }

  function isV2Running(callback) {
    if (!callback || typeof callback !== "function") {
      return;
    }

    if (!_pingReceived) {
      /* jshint validthis: true */
      return this.ping(function () {
        callback(_isV2Running);
      });
    }
    else {
      callback(_isV2Running);
    }
  }

  function isRCV2Player(callback) {
    if (!callback || typeof callback !== "function") {
      return;
    }
    /* jshint validthis: true */
    return this.isV2Running(function (isV2Running) {
      if (isV2Running) {
        callback(isV2Running);
      } else {
        callback(isV3PlayerVersionWithRCV2());
      }
    });
  }

  function isV3PlayerVersionWithRCV2() {
    var RC_V2_FIRST_PLAYER_VERSION_DATE = _utils.getDateObjectFromPlayerVersionString("2016.10.10.00.00");

    var sysInfoViewerParameter = _utils.getQueryParameter("sysInfo");
    if (!sysInfoViewerParameter) {
      // when the widget is loaded into an iframe the search has a parameter called parent which represents the parent url
      var parentParameter = _utils.getQueryParameter("parent");
      sysInfoViewerParameter = _utils.getQueryStringParameter("sysInfo", parentParameter);
    }
    if (sysInfoViewerParameter) {
      var playerVersionString = _utils.getQueryStringParameter("pv", sysInfoViewerParameter);
      var playerVersionDate = _utils.getDateObjectFromPlayerVersionString(playerVersionString);
      return playerVersionDate >= RC_V2_FIRST_PLAYER_VERSION_DATE;
    } else {
      return false;
    }
  }

  function reset() {
    _pingReceived = false;
     _isCacheRunning = false;
     _isV2Running = false;
     _isHttps = true;
    BASE_CACHE_URL = "http://localhost:9494/";
  }

  return {
    getErrorMessage: getErrorMessage,
    getFile: getFile,
    isRiseCacheRunning: isRiseCacheRunning,
    isV2Running: isV2Running,
    isRCV2Player: isRCV2Player,
    ping: ping,
    reset: reset
  };

})();

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

// Implements http://www.risevision.com/help/developers/store-authorization/
/* global WIDGET_COMMON_CONFIG */

var RiseVision = RiseVision || {};
RiseVision.Common = RiseVision.Common || {};

RiseVision.Common.Store = RiseVision.Common.Store || {};
RiseVision.Common.Store.Auth = {};

RiseVision.Common.Store.Auth = function() {
  var HOUR_IN_MILLIS = 60 * 60 * 1000;
  var backDrop, warningDialog;
  this.callback = null;
  this.authorized = false;

  this.isAuthorized = function() {
    return this.authorized;
  };

  this.checkForDisplay = function(displayId, productCode, callback) {
    this.callback = callback;
    this.url = WIDGET_COMMON_CONFIG.STORE_URL +
              WIDGET_COMMON_CONFIG.AUTH_PATH_URL +
              "?id=" + displayId + "&pc=" + productCode + "";

    this.callApi();
  };

  this.checkForCompany = function(companyId, productCode, callback) {
    this.callback = callback;
    this.url = WIDGET_COMMON_CONFIG.STORE_URL +
              WIDGET_COMMON_CONFIG.AUTH_PATH_URL +
              "?cid=" + companyId + "&pc=" + productCode + "";

    this.callApi();
  };

  this.callApi = function() {
    var self = this;

    $.ajax({
      dataType: "json",
      url: this.url,
      success: function(data, textStatus) {
        self.onSuccess(data, textStatus);
      },
      error: function() {
        self.onError();
      }
    });
  };

  this.onSuccess = function(data) {
    if (data && data.authorized) {
      this.authorized = true;

      hideNotification();

      // check again for authorization one hour before it expires
      var milliSeconds = new Date(data.expiry).getTime() - new Date().getTime() - HOUR_IN_MILLIS;
      setTimeout(this.callApi, milliSeconds);
    }
    else if (data && !data.authorized) {
      this.authorized = false;

      showNotification("Product not authorized.");

      // check authoriztation every hour if failed
      setTimeout(this.callApi, HOUR_IN_MILLIS);
    }
    else {
      // API failed, try again in an hour
      setTimeout(this.callApi, HOUR_IN_MILLIS);
    }

    if (this.callback) {
      this.callback(this.authorized);
    }
  };

  this.onError = function() {
    this.authorized = false;

    showNotification("Cannot connect to Store for authorization.");

    // check authoriztation every hour if failed
    setTimeout(this.callApi, HOUR_IN_MILLIS);

    if (this.callback) {
      this.callback(this.authorized);
    }
  };

  function showNotification(message) {
    backDrop = document.createElement("div");
    backDrop.className = "overlay";
    document.body.appendChild(backDrop);

    warningDialog = document.createElement("div");
    warningDialog.className = "auth-warning";
    warningDialog.innerHTML = message;
    warningDialog = document.body.appendChild(warningDialog);
  }

  function hideNotification() {
    if (backDrop && warningDialog) {
      warningDialog.parentNode.removeChild(warningDialog);
      backDrop.parentNode.removeChild(backDrop);
    }
  }
};

/* global google */

var RiseVision = RiseVision || {};
RiseVision.Common = RiseVision.Common || {};

RiseVision.Common.Visualization = {};

/*
 * Use the Google Visualization API to read data from a Google spreadsheet or other visualization data source.
 */
RiseVision.Common.Visualization = function() {
  this.query = null;
  this.isVisualizationLoaded = false;
};

RiseVision.Common.Visualization.prototype.getData = function(opts) {
  this.url = opts.url;
  this.refreshInterval = opts.refreshInterval;
  this.timeout = opts.timeout || 30;
  this.callback = opts.callback;
  this.params = opts.params;
  //Issue 903

  if (opts.queryString) {
    this.queryString = opts.queryString;
  }

  //For some reason, trying to load the Visualization API more than once does not execute the callback function.
  if (!this.isVisualizationLoaded) {
    this.loadVisualizationAPI();
  }
  else {
    this.sendQuery();
  }
};

RiseVision.Common.Visualization.prototype.loadVisualizationAPI = function() {
  var self = this;

  google.load("visualization", "1", {
    "callback" : function() {
      self.isVisualizationLoaded = true;
      self.sendQuery();
    }
  });
};

RiseVision.Common.Visualization.prototype.sendQuery = function() {
  var self = this;

  if (this.query !== null) {
    this.query.abort();
  }

  this.query = new google.visualization.Query(this.url);
  this.query.setRefreshInterval(this.refreshInterval);

  //Sets the number of seconds to wait for the data source to respond before raising a timeout error.
  this.query.setTimeout(this.timeout);

  if (this.queryString) {
    this.query.setQuery(this.queryString);
  }

  this.query.send(function onQueryExecuted(response) {
    self.onQueryExecuted(response);
  });
};

RiseVision.Common.Visualization.prototype.onQueryExecuted = function(response) {
  if (response === null) {
    this.callback(response, this.params);
  }
  else {
    if (response.isError()) {
      console.log("Message: " + response.getMessage());
      console.log("Detailed message: " + response.getDetailedMessage());
      console.log("Reasons: " + response.getReasons());
      this.callback(null, this.params);
    }
    else {
      this.callback(response.getDataTable(), this.params);
    }
  }
};

var RiseVision = RiseVision || {};
RiseVision.Common = RiseVision.Common || {};

RiseVision.Common.WSClient = (function() {

  function broadcastMessage(message) {
    safeWrite(message);
  }

  function canConnect() {
    try {
      if (top.RiseVision.Viewer.LocalMessaging) {
        return top.RiseVision.Viewer.LocalMessaging.canConnect();
      }
    } catch (err) {
      console.log( "widget-common: ws-client", err );
    }
  }

  function getModuleClientList() {
    safeWrite({topic: "client-list-request"});
  }

  function receiveMessages(handler) {
    if (!handler || typeof handler !== "function") {return;}

    try {
      if (top.RiseVision.Viewer.LocalMessaging) {
        top.RiseVision.Viewer.LocalMessaging.receiveMessages(handler);
      }
    } catch (err) {
      console.log( "widget-common: ws-client", err );
    }
  }

  function safeWrite(message) {
    try {
      if (top.RiseVision.Viewer.LocalMessaging) {
        top.RiseVision.Viewer.LocalMessaging.write(message);
      }
    } catch (err) {
      console.log( "widget-common: ws-client", err );
    }
  }

  return {
    broadcastMessage: broadcastMessage,
    canConnect: canConnect,
    getModuleClientList: getModuleClientList,
    receiveMessages: receiveMessages
  };
})();