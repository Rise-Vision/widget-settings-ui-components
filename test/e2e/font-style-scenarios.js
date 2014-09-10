casper.test.begin("Font Style - Loading", function (test) {
  var system = require('system');
  var e2ePort = system.env.E2E_PORT || 8099;
  casper.start("http://localhost:"+e2ePort+"/test/e2e/font-style-test.html",
    function () {
      test.assertTitle("Font Style - Test Page", "Test page has loaded");
      test.assertExists(".bold.active", "Bold is selected");
      test.assertExists(".italic.active", "Italic is selected");
      test.assertExists(".underline.active", "Underline is selected");
    }
  );

  // Bold
  casper.then(function () {
    casper.test.comment("Font Style - Bold");

    // Turn bold off.
    this.click(".bold");
    test.assertDoesntExist(".bold.active", "Click event - Bold is not selected");
    test.assertEval(function() {
      return !$("#font-style").data("plugin_fontStyle").isBold();
    }, "isBold returns false");

    // Turn bold on using the setBold function.
    var isBold = this.evaluate(function() {
      $("#font-style").data("plugin_fontStyle").setBold(true);

      return $("#font-style").data("plugin_fontStyle").isBold();
    });

    test.assert(isBold, "isBold returns true after calling setBold(true)");
  });

  // Italic
  casper.then(function () {
    casper.test.comment("Font Style - Italic");

    // Turn italic on.
    this.click(".italic");
    test.assertDoesntExist(".italic.active", "Click event - Italic is not " +
      "selected");
    test.assertEval(function() {
      return !$("#font-style").data("plugin_fontStyle").isItalic();
    }, "isItalic returns false");

    // Turn italic on using the setItalic function.
    var isItalic = this.evaluate(function() {
      $("#font-style").data("plugin_fontStyle").setItalic(true);

      return $("#font-style").data("plugin_fontStyle").isItalic();
    });

    test.assert(isItalic, "isItalic returns true after calling " +
      "setItalic(true)");
  });

  // Underline
  casper.then(function () {
    casper.test.comment("Font Style - Underline");

    // Turn underline off.
    this.click(".underline");
    test.assertDoesntExist(".underline.active", "Click event - Underline is " +
      "not selected");
    test.assertEval(function() {
      return !$("#font-style").data("plugin_fontStyle").isUnderline();
    }, "isUnderline returns false");

    // Turn underline on using the setUnderline function.
    var isUnderline = this.evaluate(function() {
      $("#font-style").data("plugin_fontStyle").setUnderline(true);

      return $("#font-style").data("plugin_fontStyle").isUnderline();
    });

    test.assert(isUnderline, "isUnderline returns true after calling " +
      "setUnderline(true)");
  });

  casper.then(function () {
    casper.test.comment("Font Style - getStyles & setStyles");

    var styles = this.evaluate(function() {
      $("#font-style").data("plugin_fontStyle").setStyles({
        bold: false,
        italic: false,
        underline: false,
      });

      return $("#font-style").data("plugin_fontStyle").getStyles();
    });

    test.assert(!styles.bold, "Bold is not selected after calling setStyles");
    test.assert(!styles.italic, "Italic is not selected after calling " +
      "setStyles");
    test.assert(!styles.underline, "Underline is not selected after calling " +
      "setStyles");
  });

  casper.run(function() {
    test.done();
  });
});


