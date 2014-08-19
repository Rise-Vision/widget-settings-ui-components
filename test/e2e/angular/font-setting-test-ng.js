(function() {
  "use strict";

  var chai = require("chai");
  var chaiAsPromised = require("chai-as-promised");
  var expect = chai.expect;

  chai.use(chaiAsPromised);
  browser.driver.manage().window().setSize(1024, 768);

  describe("Font Setting", function() {
    beforeEach(function () {
      browser.get("/test/e2e/angular/font-setting-test-ng.html");
    });

    it("Font Picker should be present and the dialog closed", function() {

      expect(element(by.css(".bfh-selectbox-option")).getText()).
        to.eventually.equal("Verdana");
      expect(element(by.css(".bfh-selectbox-options")).isDisplayed()).
        to.eventually.be.false;

    });

    it("Font Size Picker should be present and dialog closed", function() {

      expect(element(by.css("button.selectpicker span.filter-option")).getText()).
        to.eventually.equal("20");
      expect(element(by.css(".bootstrap-select div.dropdown-menu")).isDisplayed()).
        to.eventually.be.false;

    });

    it("Font Style should be present", function() {

      expect(element(by.css(".bold")).isPresent()).
        to.eventually.be.true;
      expect(element(by.css(".italic")).isPresent()).
        to.eventually.be.true;
      expect(element(by.css(".underline")).isPresent()).
        to.eventually.be.true;

      expect(element(by.css(".bold.active")).isPresent()).
        to.eventually.be.false;
      expect(element(by.css(".italic.active")).isPresent()).
        to.eventually.be.false;
      expect(element(by.css(".underline.active")).isPresent()).
        to.eventually.be.false;

    });

    it("Text and Highlight Color Picker should be present and dialogs closed", function() {
      expect(element(by.css(".sp-replacer.text-color-picker")).isPresent()).
        to.eventually.be.true;

      expect(element(by.css(".sp-replacer.text-color-picker div.sp-preview")).
        getCssValue("border-color")).
        to.eventually.equal("rgb(0, 0, 0)");

      expect(element(by.css(".sp-replacer.highlight-color-picker")).isPresent()).
        to.eventually.be.true;

      expect(element(by.css(".sp-replacer.highlight-color-picker div.sp-preview-inner")).
        getCssValue("background-color")).
        to.eventually.equal("rgba(0, 0, 0, 0)");

      expect(element.all(by.css(".sp-container.sp-hidden")).count()).
        to.eventually.equal(2);

    });
    
    it("Alignment should be present and dialog closed", function() {

      expect(element(by.css(".btn-alignment .glyphicon-align-left"))
        .isPresent()).to.eventually.be.true;
      expect(element(by.css(".alignment div.dropdown-menu")).isDisplayed())
        .to.eventually.be.false;

    });

    it("Preview should show default values", function () {
      element(by.css(".font-picker-text span")).then(function(elem) {
        expect(elem.getCssValue("font-family")).to.eventually.equal("Verdana");

        expect(elem.getCssValue("font-size")).to.eventually.equal("27px");

        expect(elem.getCssValue("font-weight")).to.eventually.equal("normal");

        expect(elem.getCssValue("font-style")).to.eventually.equal("normal");

        expect(elem.getCssValue("text-decoration")).to.eventually.equal("none");

        expect(elem.getCssValue("color")).to.eventually.equal("rgba(0, 0, 0, 1)");

        expect(elem.getCssValue("background-color")).to.eventually.equal("rgba(0, 0, 0, 0)");

      });

      expect(element(by.css(
        ".btn-alignment[data-wysihtml5-command-value='left']")).isPresent()).
        to.eventually.be.true;
      expect(element(by.css(".font-picker-text")).getCssValue("text-align")).
        to.eventually.equal("left");

    });

    // Bold
    it("Should turn bold on when clicked", function () {
      element(by.css(".bold")).click();

      expect(element(by.css(".bold.active")).isPresent()).
        to.eventually.be.true;
      expect(element(by.css(".font-picker-text span")).getCssValue("font-weight")).
        to.eventually.equal("bold");
    });
  });
})();
