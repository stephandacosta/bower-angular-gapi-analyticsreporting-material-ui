'use strict';

/**
 * @ngdoc overview
 * @name angularGapiAnalyticsreportingmain
 * @description
 * # angularGapiAnalyticsreportingmain
 *
 * Main module of the plugin.
 */

var ngarUI = angular.module('angularGapiAnalyticsreportingUI',[]);

// reminder to add error logging to analytics itself
ngarUI.run(function(){
  console.log('ngarUI is running');
});
