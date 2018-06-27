/* jshint expr: true */

(function() {

  "use strict";

  var chai = require("chai");
  var chaiAsPromised = require("chai-as-promised");

  chai.use(chaiAsPromised);
  var expect = chai.expect;

  var fs = require("fs");

  browser.driver.manage().window().setSize(1024, 768);

  describe("Transition Setting Component", function() {
    beforeEach(function (){
      browser.get("/test/e2e/angular/transition-setting-test-ng.html");
    });

    describe("Standard functionality", function () {

      it("Should correctly load defaults", function () {

        element.all(by.css("#main select[name='transition-by'] option")).then(function (elements) {
          expect(elements.length).to.equal(4);
        });

        expect(element(by.css("#main select[name='transition-by']")).getAttribute("value")).to.eventually.equal("none");
        expect(element(by.css("#main input[name='transition-duration']")).getAttribute("value")).to.eventually.equal("10");

        expect(element(by.css("#main select[name='transition-direction']")).isPresent()).to.eventually.be.false;
        expect(element(by.css("#main select[name='transition-speed']")).isPresent()).to.eventually.be.false;
        expect(element(by.css("#main input[name='transition-resume']")).isPresent()).to.eventually.be.false;
        expect(element(by.css("#main input[name='transition-pud']")).isPresent()).to.eventually.be.false;

      });

      it("Should display appropriate settings when fade is selected", function () {
        element(by.cssContainingText("#main option", "Fade")).click();

        expect(element(by.css("#main input[name='transition-duration']")).getAttribute("value")).to.eventually.equal("10");

        expect(element(by.css("#main select[name='transition-direction']")).isPresent()).to.eventually.be.false;
        expect(element(by.css("#main select[name='transition-speed']")).isPresent()).to.eventually.be.false;
        expect(element(by.css("#main input[name='transition-resume']")).isPresent()).to.eventually.be.false;
        expect(element(by.css("#main input[name='transition-pud']")).isPresent()).to.eventually.be.false;
      });

      it("Should display appropriate settings when scroll is selected", function () {
        element(by.cssContainingText("#main option", "Scroll")).click();

        // 3 options for speed selection
        element.all(by.css("#main select[name='transition-speed'] option")).then(function (elements) {
          expect(elements.length).to.equal(5);
        });

        // 2 options for direction selection
        element.all(by.css("#main select[name='transition-direction'] option")).then(function (elements) {
          expect(elements.length).to.equal(2);
        });

        // direction defaults on 'up'
        expect(element(by.css("#main select[name='transition-direction']")).getAttribute("value")).to.eventually.equal("up");

        expect(element(by.css("#main select[name='transition-speed']")).getAttribute("value")).to.eventually.equal("medium");
        expect(element(by.css("#main input[name='transition-resume']")).getAttribute("value")).to.eventually.equal("5");
        expect(element(by.css("#main input[name='transition-pud']")).getAttribute("value")).to.eventually.equal("10");

        expect(element(by.css("#main input[name='transition-duration']")).isPresent()).to.eventually.be.false;

      });

      it("Should display appropriate settings when 'Left' is selected from direction", function () {
        element(by.cssContainingText("#main option", "Scroll")).click();
        element(by.cssContainingText("#main option", "Left")).click();

        expect(element(by.css("#main select[name='transition-speed']")).getAttribute("value")).to.eventually.equal("medium");

        expect(element(by.css("#main input[name='transition-duration']")).isPresent()).to.eventually.be.false;
        expect(element(by.css("#main input[name='transition-resume']")).isPresent()).to.eventually.be.false;
        expect(element(by.css("#main input[name='transition-pud']")).isPresent()).to.eventually.be.false;
      });

      it("Should display appropriate settings when page is selected", function () {
        element(by.cssContainingText("#main option", "Page")).click();

        expect(element(by.css("#main input[name='transition-duration']")).getAttribute("value")).to.eventually.equal("10");
        expect(element(by.css("#main input[name='transition-resume']")).getAttribute("value")).to.eventually.equal("5");
        expect(element(by.css("#main input[name='transition-pud']")).getAttribute("value")).to.eventually.equal("10");

        expect(element(by.css("#main select[name='transition-direction']")).isPresent()).to.eventually.be.false;
        expect(element(by.css("#main select[name='transition-speed']")).isPresent()).to.eventually.be.false;
      });

    });

    describe("Hide fade option", function () {

      it("Should not display 'Fade' as an option", function () {

        expect(element(by.cssContainingText("#no-fade option", "Fade")).isPresent()).to.eventually.be.false;

        element.all(by.css("#no-fade select[name='transition-by'] option")).then(function (elements) {
          expect(elements.length).to.equal(3);
        });

      });

    });

  });

})();
