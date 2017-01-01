'use strict';

/**
 * @ngdoc service
 * @name angular-gapi-reporting-UI measurementSelector
 * @description
 * # measurementSelector
 * modules and components in angular-gapi-reporting-UI to select dimensions, metrics and segments
 */

angular.module('angularGapiAnalyticsreportingUI')
  .factory('ngarFilter', function () {

    var createFilter = function(query, property){
      return function(item) {
        return _.includes(_.lowerCase(item[property]), _.lowerCase(query));
      };
    };

    return {
      createFilter:createFilter
    };

  })

  .controller('MeasurementSelectorCtrl', function($scope, ngarFilter, ngarManagementService, ngarReportService){

    var measurementMap = {
      'DIMENSION' : 'dimensions',
      'METRIC': 'metrics',
      'SEGMENT': 'segments'
    };
    $scope.selectedMeasurements = ngarReportService.params[measurementMap[$scope.type]];

    $scope.selectMeasurement = function(measurement){
      if (measurement){
        $scope.selectedMeasurements.push(measurement);
        this.searchMeasurementText = '';
      }
    };
    var measurements = function(type){
      if (type === 'DIMENSION' || type === 'METRIC'){
        return ngarManagementService.items.metadata.filter(function(item){
          return item.type === type;
        });
      }
      if (type === 'SEGMENT'){
        return ngarManagementService.items.segments.map(function(segment){
          segment.group = segment.type;
          segment.uiName = segment.name;
          return segment;
        });
      }
    };
    $scope.measurementSearch = function(query) {
      return query ? measurements($scope.type).filter(ngarFilter.createFilter(query,'uiName')) : [];
    };
    $scope.removeMeasurement = function(index){
      $scope.selectedMeasurements.splice(index,1);
    };
  })


  .directive('ngarMeasurementSelector', function () {
    return {
      restrict: 'E',
      scope: {
        type:'@'
      },
      controller: 'MeasurementSelectorCtrl',
      template:
         '<div flex layout-margin>\n' +
         '  <md-autocomplete\n' +
         '    md-no-cache\n' +
         '    md-selected-item-change="selectMeasurement(measurement)"\n' +
         '    md-selected-item="selectedMeasurement"\n' +
         '    md-search-text="searchMeasurementText"\n' +
         '    md-items="measurement in measurementSearch(searchMeasurementText)"\n' +
         '    md-item-text="measurement.uiName"\n' +
         '    placeholder="Enter {{type}}">\n' +
         '    <md-item-template>\n' +
         '      <span>\n' +
         '        <span> {{measurement.group}} > </span>\n' +
         '      </span>\n' +
         '      <span>\n' +
         '        <span>\n' +
         '          <strong>{{measurement.uiName}}</strong>\n' +
         '        </span>\n' +
         '      </span>\n' +
         '    </md-item-template>\n' +
         '    <md-not-found>\n' +
         '      "{{searchMeasurement}}" has no match.\n' +
         '    </md-not-found>\n' +
         '  </md-autocomplete>\n' +
         '  <md-chips\n' +
         '    ng-model="selectedMeasurements"\n' +
         '    delete-button-label="Remove Measurement"\n' +
         '    delete-hint="Press delete to remove {{type}}"\n' +
         '    readonly="true"\n' +
         '    md-max-chips="7">\n' +
         '    <md-chip-template>\n' +
         '      <span>{{$chip.uiName}}</span>\n' +
         '      <md-icon ng-click="removeMeasurement($index)">close</md-icon>\n' +
         '    </md-chip-template>\n' +
         '  </md-chips>\n' +
         '  <!-- <div ng-message="md-max-chips">You reached the maximum amount of chips</div> -->\n' +
         '</div>\n'
    };
  });
