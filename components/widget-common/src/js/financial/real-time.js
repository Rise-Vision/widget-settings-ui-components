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
