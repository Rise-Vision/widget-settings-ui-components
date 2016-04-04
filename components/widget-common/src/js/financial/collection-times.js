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