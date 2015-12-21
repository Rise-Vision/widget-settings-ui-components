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
