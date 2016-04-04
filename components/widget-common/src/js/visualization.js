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
