'use strict';

/**
 * @ngdoc service
 * @name angular-gapi-reporting-UI dateSelector
 * @description
 * # dateSelector
 * modules and components in angular-gapi-reporting-UI to select dates for reporting
 */

angular.module('angularGapiAnalyticsreportingUI')

  .controller('DateSelectorCtrl', function($scope, ngarReportService){

    $scope.$watch('dateStart', function(newDate){
      ngarReportService.params[0].dateStart = newDate;
    });
    $scope.$watch('dateEnd', function(newDate){
      ngarReportService.params[0].dateEnd = newDate;
    });

    $scope.openEndDate = function(){
      $scope.endDateIsOpen=true;
    };
    $scope.closeEndDate = function(){
      $scope.endDateIsOpen=false;
    };

  })


  .directive('ngarDateSelector', function () {
    return {
      restrict: 'E',
      scope: {
        defaultStart:'=',
        defaultEnd: '='
      },
      controller: 'DateSelectorCtrl',
      template:
         '<div layout="row" layout-padding>\n' +
         '  <div layout="column">\n' +
         '    <label class="md-subhead">Start Date </label>\n' +
         '    <md-datepicker ng-model="dateStart" ng-change="openEndDate()" md-hide-icons="triangle" md-open-on-focus ng-required></md-datepicker>\n' +
         '  </div>\n' +
         '  <div layout="column">\n' +
         '    <label class="md-subhead">End Date</label>\n' +
         '    <md-datepicker ng-model="dateEnd" md-hide-icons="triangle" md-is-open="endDateIsOpen"  md-open-on-focus ng-required></md-datepicker>\n' +
         '  </div>\n' +
         '</div>\n',
      link: function(scope){

        scope.$watch('defaultStart', function(start){
          if (start){
            scope.dateStart = start;
          }
        });

        scope.$watch('defaultEnd', function(end){
          if (end){
            scope.dateEnd = end;
          }
        });

      }
    };
  });
