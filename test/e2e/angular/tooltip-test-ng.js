(function() {

  "use strict";

  /* https://github.com/angular/protractor/blob/master/docs/getting-started.md */

  var chai = require("chai");
  var chaiAsPromised = require("chai-as-promised");

  chai.use(chaiAsPromised);
  var expect = chai.expect;

  var fs = require("fs");

  browser.driver.manage().window().setSize(1024, 768);

  describe("Tooltip component", function() {
    beforeEach(function (){
      browser.get("/test/e2e/angular/tooltip-test-ng.html");
    });

    it("Should hide Tooltip by default", function () {
      expect(element(by.css(".fa.fa-question-circle")).isPresent()).
      to.eventually.be.true;

      expect(element(by.css("div.popover.fade")).isPresent()).
      to.eventually.be.false;
    });

    it("Should show tooltip when clicked", function () {
      element(by.css(".fa.fa-question-circle")).click();

      expect(element(by.css("div.popover.right.fade.in")).isPresent()).
      to.eventually.be.true;

      expect(element(by.css("div.popover-content")).getText()).
      to.eventually.equal("Tooltip text");
    });

    xit("Should hide tooltip when clicked twice", function () {
      element(by.id("tooltip")).click();
      element(by.id("tooltip")).click();

      expect(element(by.css("div.popover.fade")).isPresent()).
      to.eventually.be.false;
    });
  });

})();
