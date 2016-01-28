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

      return browser.wait(function() {
        return element(by.css(".mce-btn[aria-label='Font Family']")).isPresent()
          .then(function(isPresent) {
            if (isPresent) {
              return element(by.css(".mce-btn[aria-label='Font Family']")).isDisplayed()
                .then(function(isDisplayed) {
                  return isDisplayed;
                });
            }
          });
      });
    });

    describe("Initialization", function() {
      describe("Font Family", function() {
        it("should load both default and Google fonts", function() {
          element(by.css(".mce-btn[aria-label='Font Family']")).click();

          element.all(by.css("#mceu_20-body div")).then(function(elements) {
            expect(elements.length).to.equal(746);
          });
        });

        it("should show font family", function() {
          expect(element(by.css(".mce-btn[aria-label='Font Family']")).isDisplayed()).to.eventually.be.true;
        });

        it("should set font family to Verdana", function() {
          expect(element(by.css(".mce-btn[aria-label='Font Family'] .mce-txt")).getText()).to.eventually.equal("Verdana");
        });

        it("should set correct font family for preview text", function() {
          expect(element(by.css(".text")).getCssValue("font-family")).to.eventually.equal("verdana, geneva, sans-serif");
        });
      });

      describe("Font Sizes", function() {
        it("should show font sizes", function() {
          expect(element(by.css(".mce-btn[aria-label='Font Sizes']")).isDisplayed()).to.eventually.be.true;
        });

        it("should set font size to 24px", function() {
          expect(element(by.css(".mce-btn[aria-label='Font Sizes'] .mce-txt")).getText()).to.eventually.equal("24px");
        });

        it("should set correct font size for preview text", function() {
          expect(element(by.css(".text")).getCssValue("font-size")).to.eventually.equal("24px");
        });
      });

      describe("Alignment", function() {
        it("should show align left", function() {
          expect(element(by.css(".mce-btn[aria-label='Align left']")).isDisplayed()).to.eventually.be.true;
        });

        it("should show align center", function() {
          expect(element(by.css(".mce-btn[aria-label='Align center']")).isDisplayed()).to.eventually.be.true;
        });

        it("should show align right", function() {
          expect(element(by.css(".mce-btn[aria-label='Align right']")).isDisplayed()).to.eventually.be.true;
        });

        it("should show justify", function() {
          expect(element(by.css(".mce-btn[aria-label='Justify']")).isDisplayed()).to.eventually.be.true;
        });

        it("should set alignment to align left", function() {
          expect(element(by.css(".mce-active[aria-label='Align left']")).isDisplayed()).to.eventually.be.true;
        });

         it("should set correct alignment for preview text", function() {
          expect(element(by.css(".text-container")).getCssValue("text-align")).to.eventually.equal("left");
        });
      });

      describe("Text Color", function() {
        it("should show text color", function() {
          expect(element(by.css(".mce-colorbutton[aria-label='Text color']")).isDisplayed()).to.eventually.be.true;
        });

        it("should show background color", function() {
          expect(element(by.css(".mce-colorbutton[aria-label='Background color']")).isDisplayed()).to.eventually.be.true;
        });

        it("should set correct color for preview text", function() {
          expect(element(by.css(".text")).getCssValue("color")).to.eventually.equal("rgba(0, 0, 0, 1)");
        });
      });

      describe("Background Color", function() {
        it("should set text color to black", function() {
          expect(element(by.css(".mce-colorbutton[aria-label='Text color'] .mce-preview")).getCssValue("background-color")).to.eventually.equal("rgba(0, 0, 0, 1)");
        });

        it("should set background color to transparent", function() {
          expect(element(by.css(".mce-colorbutton[aria-label='Background color'] .mce-preview")).getCssValue("background-color")).to.eventually.equal("rgba(0, 0, 0, 0)");
        });

        it("should set correct background color for preview text", function() {
          expect(element(by.css(".text")).getCssValue("background-color")).to.eventually.equal("rgba(0, 0, 0, 0)");
        });
      });

      describe("Bold", function() {
        it("should show bold", function() {
          expect(element(by.css(".mce-btn[aria-label='Bold']")).isDisplayed()).to.eventually.be.true;
        });

        it("should not select bold", function() {
          expect(element(by.css(".mce-active[aria-label='Bold']")).isPresent()).to.eventually.be.false;
        });

        it("should set correct font weight for preview text", function() {
          expect(element(by.css(".text")).getCssValue("font-weight")).to.eventually.equal("normal");
        });
      });

      describe("Italic", function() {
        it("should show italic", function() {
          expect(element(by.css(".mce-btn[aria-label='Italic']")).isDisplayed()).to.eventually.be.true;
        });

        it("should not select italic", function() {
          expect(element(by.css(".mce-active[aria-label='Italic']")).isPresent()).to.eventually.be.false;
        });

        it("should set correct font style for preview text", function() {
          expect(element(by.css(".text")).getCssValue("font-style")).to.eventually.equal("normal");
        });
      });

      describe("Underline", function() {
        it("should show underline", function() {
          expect(element(by.css(".mce-btn[aria-label='Underline']")).isDisplayed()).to.eventually.be.true;
        });

        it("should not select underline", function() {
          expect(element(by.css(".mce-active[aria-label='Underline']")).isPresent()).to.eventually.be.false;
        });

        it("should set correct text decoration for preview text", function() {
          expect(element(by.css(".text")).getCssValue("text-decoration")).to.eventually.equal("none");
        });
      });
    });

    describe("Updating", function() {
      describe("Font Family", function() {
        it("should update font family for preview text", function() {
          element(by.css(".mce-btn[aria-label='Font Family']")).click();
          element(by.css("#mceu_21-text")).click();

          expect(element(by.css(".text")).getCssValue("font-family")).to.eventually.equal("'andale mono', monospace");
        });
      });

      describe("Font Sizes", function() {
        it("should update font size for preview text", function() {
          element(by.css(".mce-btn[aria-label='Font Sizes']")).click();
          element(by.css("#mceu_21-text")).click();

          expect(element(by.css(".text")).getCssValue("font-size")).to.eventually.equal("8px");
        });
      });

      describe("Alignment", function() {
        it("should update alignment for preview text", function() {
          element(by.css(".mce-btn[aria-label='Align center']")).click();

          expect(element(by.css(".text-container")).getCssValue("text-align")).to.eventually.equal("center");
        });
      });

      describe("Text Color", function() {
        it("should update color for preview text", function() {
          element(by.css(".mce-colorbutton[aria-label='Text color'] .mce-open")).click();
          element(by.css("#mceu_20-16")).click();

          expect(element(by.css(".text")).getCssValue("color")).to.eventually.equal("rgba(255, 0, 0, 1)");
        });
      });

      describe("Background Color", function() {
        it("should update background color for preview text", function() {
          element(by.css(".mce-colorbutton[aria-label='Background color'] .mce-open")).click();
          element(by.css("#mceu_20-16")).click();

          expect(element(by.css(".text")).getCssValue("background-color")).to.eventually.equal("rgba(255, 0, 0, 1)");
        });
      });

      describe("Bold", function() {
        it("should update font weight for preview text", function() {
          element(by.css(".mce-btn[aria-label='Bold']")).click();

          expect(element(by.css(".text")).getCssValue("font-weight")).to.eventually.equal("bold");
        });
      });

      describe("Italic", function() {
        it("should update font style for preview text", function() {
          element(by.css(".mce-btn[aria-label='Italic']")).click();

          expect(element(by.css(".text")).getCssValue("font-style")).to.eventually.equal("italic");
        });
      });

      describe("Underline", function() {
        it("should update text decoration for preview text", function() {
          element(by.css(".mce-btn[aria-label='Underline']")).click();

          expect(element(by.css(".text")).getCssValue("text-decoration")).to.eventually.equal("underline");
        });
      });

      describe("Custom Font", function() {
        var url = "",
          customFontUrl = "https://my.custom.font/BrushScriptStd.otf";

        beforeEach(function () {
          url = browser.findElement(by.model("url"));

          element(by.css(".mce-btn[aria-label='Font Family']")).click();
          element(by.css("#mceu_766-text")).click();
        });

        describe("Modal visibility", function() {
          it("should show modal for custom font", function() {
            expect(element(by.css(".custom-font")).isDisplayed()).to.eventually.be.true;
          });

          it("should hide modal when cancel button is clicked", function() {
            element(by.css(".custom-font .cancel")).click();

            expect(element(by.css(".custom-font")).isDisplayed()).to.eventually.be.false;
          });
        });

        describe("Select button", function() {
          it("should disable Select button if there is no custom font URL", function() {
            expect(element(by.css(".custom-font .select")).isEnabled()).to.eventually.be.false;
          });

          it("should disable Select button if custom font URL is invalid", function() {
            element(by.css(".custom-font input[name='url']")).clear();
            element(by.css(".custom-font input[name='url']")).sendKeys("http://abc123");

            expect(element(by.css(".custom-font .select")).isEnabled()).to.eventually.be.false;
          });

          it("should enable Select button if custom font URL is valid", function() {
            url.clear();
            url.sendKeys(customFontUrl);

            expect(element(by.css(".custom-font .select")).isEnabled()).to.eventually.be.true;
          });
        });

        describe("Preview text", function() {
          it("should set correct font family for preview text", function() {
            url.clear();
            url.sendKeys(customFontUrl);
            element(by.css(".custom-font .select")).click();

            expect(element(by.css(".text")).getCssValue("font-family")).to.eventually.equal("BrushScriptStd");
          });
        });
      });

    });
  });
})();
