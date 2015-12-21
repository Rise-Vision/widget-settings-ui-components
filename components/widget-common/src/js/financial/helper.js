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
