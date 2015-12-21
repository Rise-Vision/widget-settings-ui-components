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
      collectionTimesTimer = setTimeout(function() {
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
          $.each(daysOfWeek, function(j, day) {
            //Check collection day.
            // TODO: Use strict type comparison (===)
            if (day == dayOfWeek) {
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

var RiseVision = RiseVision || {};
RiseVision.Common = RiseVision.Common || {};
RiseVision.Common.Financial = RiseVision.Common.Financial || {};

RiseVision.Common.Financial.Historical = {};
RiseVision.Common.Financial.Historical.CollectionTimes = {};

RiseVision.Common.Financial.Historical = function(displayID, instrument, duration) {
  var self = this;

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
  var self = this;

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
    var numRows, timeZoneOffset, startTime, endTime;

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

  $.each(instruments, function(index, value) {
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

    //Do nothing as instrument is already being requested.
    if (field === "instrument") {
    }
    else {
      //Visualization API doesn't allow requesting the same field more than once.
      $.each(self.dataFields, function(i, dataField) {
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
  var row = 0, signs = [], current, sign;

  for ( row = 0, numRows = this.data.getNumberOfRows(); row < numRows; row++) {
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
  var self = this, current = 0, previous = 0, result = [], matchFound = false;

  if (this.conditions[field]) {
    for ( row = 0, numRows = this.data.getNumberOfRows(); row < numRows; row++) {
      current = this.data.getValue(row, this.dataFields[field]);
      matchFound = false;

      $.each(this.conditions[field], function(index, value) {
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
            if (current != previous) {
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
