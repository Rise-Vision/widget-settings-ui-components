casper.test.begin("alignment: font list", function (test) {
    casper.start("http://localhost:8099/test/e2e/alignment-test.html", function () {
        test.assertTitle("Alignment - Test Page");
        //should Display "Times New Roman" by default
        //test.assertSelectorHasText(".bfh-selectbox-option", "Times New Roman");
        //test.assertNotVisible(".bfh-selectbox-options");
    });

    casper.run(function() {
        test.done();
    });
});
