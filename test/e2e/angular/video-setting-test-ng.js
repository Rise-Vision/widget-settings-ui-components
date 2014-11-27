/* jshint expr: true */

(function() {

  "use strict";

  var chai = require("chai");
  var chaiAsPromised = require("chai-as-promised");

  chai.use(chaiAsPromised);
  var expect = chai.expect;

  var fs = require("fs");

  browser.driver.manage().window().setSize(1024, 768);

  describe("Video Setting Component", function() {
    beforeEach(function (){
      browser.get("/test/e2e/angular/video-setting-test-ng.html");
    });

    it("Should correctly load defaults", function () {
      // ensure autoplay checkbox is displayed
      expect(element(by.css("input[name=video-autoplay]")).isDisplayed()).to.eventually.be.true;
      // ensure autoplay checkbox is checked
      expect(element(by.css("input[name=video-autoplay]")).getAttribute("checked")).
        to.eventually.not.be.null;

      // ensure loop checkbox is displayed
      expect(element(by.css("input[name=video-loop]")).isDisplayed()).to.eventually.be.true;
      // ensure loop checkbox is checked
      expect(element(by.css("input[name=video-loop]")).getAttribute("checked")).
        to.eventually.not.be.null;

      // ensure autohide checkbox is displayed
      expect(element(by.css("input[name=video-autohide]")).isDisplayed()).to.eventually.be.true;
      // ensure autohide checkbox is checked
      expect(element(by.css("input[name=video-autohide]")).getAttribute("checked")).
        to.eventually.not.be.null;
    });


  });

})();
