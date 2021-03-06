const grunt = require('grunt');


/**
 * Grunt configuration. Defines two tasks for creating browser and Node.js
 * CommonJS modules:
 * - `grunt`: Builds both modules.
 */

grunt.loadNpmTasks('grunt-contrib-concat');


// clang-format off

/**
 * Browser build.
 * - CommonJS exports.
 */
const BROWSER_BANNER = '';
const BROWSER_FOOTER = [
  'goog.global = window;',
  'goog.Timer.defaultTimerObject = window;',
  'module.exports = ee;'
].join('\n') + '\n';

/**
 * Node.js build.
 * - CommonJS exports.
 * - 'googleapis' dependency, used for serverside authentication.
 * - XmlHttpRequest polyfill, for network requests.
 */
const NODEJS_BANNER = [
  'const googleapis = require(\'googleapis\');',
  'const XMLHttpRequest = require(\'xmlhttprequest\').XMLHttpRequest;',
].join('\n') + '\n';
const NODEJS_FOOTER = [
  'goog.Timer.defaultTimerObject = global;',
  'module.exports = ee;'
].join('\n') + '\n';

// clang-format on


const BUILD_DIR = 'build';


/** Build configuration. */
grunt.initConfig({
  /**
   * Using the compilation output, creates CommonJS targets for Node.js and
   * browser build tooling. The browser target is used by build bundlers like
   * Browserify, Webpack, and native ES6 modules.
   *
   * For traditional HTML script
   * <scripts src="..."/> includes, use build/ee_api_js*.js instead.
   */
  concat: {
    browser: {
      src: [`${BUILD_DIR}/ee_api_js_npm.js`],
      dest: `${BUILD_DIR}/browser.js`,
      options: {banner: BROWSER_BANNER, footer: BROWSER_FOOTER}
    },
    nodejs: {
      src: [`${BUILD_DIR}/ee_api_js_npm.js`],
      dest: `${BUILD_DIR}/main.js`,
      options: {banner: NODEJS_BANNER, footer: NODEJS_FOOTER}
    }
  }
});

/**
 * Default tasks, executed consecutively with `grunt` command.
 */
grunt.registerTask('default', ['concat:nodejs', 'concat:browser']);
