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
      // ensure correct model value for autoplay
      expect(element(by.model("video.autoplay")).isSelected()).to.eventually.be.true;

      // ensure scaleToFit checkbox is displayed
      expect(element(by.css("input[name=video-scale]")).isDisplayed()).to.eventually.be.true;
      // ensure autoplay checkbox is checked
      expect(element(by.css("input[name=video-scale]")).getAttribute("checked")).
        to.eventually.not.be.null;
      // ensure correct model value for autoplay
      expect(element(by.model("video.scaleToFit")).isSelected()).to.eventually.be.true;

      // ensure volume slider is displayed
      expect(element(by.css(".slider")).isDisplayed()).to.eventually.be.true;

      // force browser to mouse over the volume slider
      browser.actions().mouseMove(element(by.css(".slider"))).perform();

      // ensure volume slider default value setting is 50
      expect(element(by.model("video.volume")).getAttribute("value")).to.eventually.equal("50,0");
    });

  });

})();
