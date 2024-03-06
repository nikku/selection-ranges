/* global process */

// configures browsers to run test against
// any of [ 'ChromeHeadless', 'Chrome', 'Firefox' ]
const browsers = (process.env.TEST_BROWSERS || 'ChromeHeadless').split(',');

// use puppeteer provided Chrome for testing
process.env.CHROME_BIN = require('puppeteer').executablePath();


module.exports = function(karma) {
  karma.set({

    basePath: '../../',

    frameworks: [
      'mocha',
      'chai'
    ],

    files: [
      'dist/selection-ranges.min.js',
      'test/integration/*.js'
    ],

    reporters: [ 'progress' ],

    browsers,

    autoWatch: false,
    singleRun: true
  });
};
