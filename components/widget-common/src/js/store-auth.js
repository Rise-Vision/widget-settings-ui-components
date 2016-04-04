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
