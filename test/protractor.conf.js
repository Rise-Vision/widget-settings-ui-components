var seleniumAddress = (process.env.NODE_ENV === 'prod') ? 'http://localhost:4444/wd/hub' : undefined;

exports.config = {
  allScriptsTimeout: 11000,

  // specs: [
  //   'e2e/*.js'
  // ],

  // -----------------------------------------------------------------
  // Browser and Capabilities: Chrome
  // -----------------------------------------------------------------

  // seleniumServerJar: "../node_modules/protractor/selenium/selenium-server-standalone-2.9.248307.jar",
  seleniumAddress: seleniumAddress,
  capabilities: {
    browserName: 'phantomjs',
    version: '',
    platform: 'ANY'
  },

  framework: 'mocha',

  mochaOpts: {
    reporter: 'spec',
    slow: 3000
  }
};
