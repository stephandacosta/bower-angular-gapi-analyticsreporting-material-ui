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

'use strict';

/**
 * @ngdoc service
 * @name angular-gapi-reporting-UI dateSelector
 * @description
 * # dateSelector
 * modules and components in angular-gapi-reporting-UI to select dates for reporting
 */

angular.module('angularGapiAnalyticsreportingUI')

  .controller('DateSelectorCtrl', ["$scope", "ngarReportService", function($scope, ngarReportService){

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

  }])


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

  .controller('MeasurementSelectorCtrl', ["$scope", "ngarFilter", "ngarManagementService", "ngarReportService", function($scope, ngarFilter, ngarManagementService, ngarReportService){

    var measurementMap = {
      'DIMENSION' : 'dimensions',
      'METRIC': 'metrics',
      'SEGMENT': 'segments'
    };
    $scope.selectedMeasurements = ngarReportService.params[0][measurementMap[$scope.type]];

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
  }])


  .directive('ngarMeasurementSelector', ["ngarManagementService", "ngarReportService", function (ngarManagementService, ngarReportService) {
    return {
      restrict: 'E',
      scope: {
        type:'@',
        defaultSelection: '='
      },
      controller: 'MeasurementSelectorCtrl',
      link: function(scope){
        var selectedMeasurements;
        var measurementMap = {
          'DIMENSION' : 'dimensions',
          'METRIC': 'metrics',
          'SEGMENT': 'segments'
        };
        scope.$watchCollection('defaultSelection', function(selection){
          if (selection){
            if (scope.type === 'DIMENSION' || scope.type === 'METRIC'){
              selectedMeasurements = selection.map(function(selectionItem){
                return ngarManagementService.items.metadata.find(function(metadataItem){
                  return metadataItem.id === selectionItem;
                });
              });
            }
            if (scope.type === 'SEGMENT'){
              selectedMeasurements = selection.map(function(selectionItem){
                return ngarManagementService.items.segments.find(function(segmentItem){
                  segmentItem.group = segmentItem.type;
                  segmentItem.uiName = segmentItem.name;
                  return segmentItem.name === selectionItem;
                });
              });
            }
            scope.selectedMeasurements = selectedMeasurements.filter(function(selected){
              return !_.isUndefined(selected);
            });
            ngarReportService.params[0][measurementMap[scope.type]]=scope.selectedMeasurements;
          }
        });
      },
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
         '    md-max-chips="7"\n' +
         '    ng-class="type">\n' +
         '    <md-chip-template>\n' +
         '      <span>{{$chip.uiName}}</span>\n' +
         '      <md-icon ng-click="removeMeasurement($index)">close</md-icon>\n' +
         '    </md-chip-template>\n' +
         '  </md-chips>\n' +
         '  <!-- <div ng-message="md-max-chips">You reached the maximum amount of chips</div> -->\n' +
         '</div>\n'
    };
  }]);

'use strict';

/**
 * @ngdoc service
 * @name angular-gapi-reporting-UI viewSelector
 * @description
 * # viewSelector
 * modules and components in angular-gapi-reporting-UI to select view ID
 */

angular.module('angularGapiAnalyticsreportingUI')
  .factory('ngarViewSelectorService', ["ngarManagementService", "$mdPanel", "$mdMedia", function (ngarManagementService, $mdPanel, $mdMedia) {

    var panelPosition;
    if ($mdMedia('gt-sm')){
      panelPosition = $mdPanel.newPanelPosition()
      .absolute()
      .left('10%')
      .top('10%');
    } else {
      panelPosition = $mdPanel.newPanelPosition()
      .absolute()
      .left('10%')
      .top('10%');
    }

    var template =
    '<md-content flex layout-fill layout="row" md-whiteframe="8">\n' +
    '  <div layout="column" flex layout-fill>\n' +
    '    <md-toolbar md-scroll-shrink>\n' +
    '      <div class="md-toolbar-tools">Accounts</div>\n' +
    '    </md-toolbar>\n' +
    '    <div layout="column" flex layout-fill style="overflow:scroll;">\n' +
    '      <md-list>\n' +
    '        <md-list-item class="md-2-line" ng-repeat="account in accounts track by account.id" ng-click="selectAccount(account.id)">\n' +
    '          <div class="md-list-item-text" layout="column">\n' +
    '            <p>{{account.name}}</p>\n' +
    '            <p>({{account.id}})</p>\n' +
    '          </div>\n' +
    '        </md-list-item>\n' +
    '      </md-list>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '  <div layout="column" flex layout-fill style="overflow:scroll;">\n' +
    '    <md-toolbar md-scroll-shrink>\n' +
    '      <div class="md-toolbar-tools">Properties</div>\n' +
    '    </md-toolbar>\n' +
    '    <div layout="column" flex layout-fill style="overflow:scroll;">\n' +
    '      <md-list>\n' +
    '        <md-list-item class="md-2-line" ng-repeat="property in selectedAccount.properties track by property.id" ng-click="selectProperty(property.id)">\n' +
    '          <div class="md-list-item-text" layout="column">\n' +
    '            <p>{{property.name}}</p>\n' +
    '            <p>({{property.id}})</p>\n' +
    '          </div>\n' +
    '        </md-list-item>\n' +
    '      </md-list>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '  <div layout="column" flex layout-fill style="overflow:scroll;">\n' +
    '    <md-toolbar md-scroll-shrink>\n' +
    '      <div class="md-toolbar-tools">Views</div>\n' +
    '    </md-toolbar>\n' +
    '    <div layout="column" flex layout-fill style="overflow:scroll;">\n' +
    '      <md-list style="overflow:scroll:">\n' +
    '        <md-list-item class="md-2-line" ng-repeat="view in selectedProperty.views track by view.id" ng-click="selectView(view.id)">\n' +
    '          <div class="md-list-item-text" layout="column">\n' +
    '            <p>{{view.name}}</p>\n' +
    '            <p>({{view.id}})</p>\n' +
    '          </div>\n' +
    '        </md-list-item>\n' +
    '      </md-list>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</md-content>\n' +
    '<md-button flex ng-click="closePanel()" class="md-warn md-raised">Close</md-button>\n';

    var showSelector = function () {
      console.log('showSelector');
      var config = {
        controller: 'ViewSelectorCtrl',
        controllerAs: 'Ctrl',
        locals : {
          accounts:ngarManagementService.items.accountsTree
        },
        position: panelPosition,
        zIndex: 1000,
        panelClass : 'viewSelector',
        template: template,
        clickOutsideToClose: true,
        escapeToClose: true,
        focusOnOpen: true,
        hasBackdrop: true,
        fullscreen: false
      };

      var panelRef = $mdPanel.create(config);
      panelRef.open()
          .finally(function() {
            panelRef = undefined;
          });
    };

    return {
      showSelector: showSelector
    };

  }])

  .controller('ViewSelectorCtrl', ["$scope", "mdPanelRef", "ngarManagementService", "ngarReportService", "accounts", function($scope, mdPanelRef, ngarManagementService, ngarReportService, accounts){
    $scope.accounts = accounts;
    $scope._mdPanelRef = mdPanelRef;
    $scope.closePanel = function(){
     $scope._mdPanelRef.close()
       .finally(function(){
         console.log('closing selector');
       });
    };
    $scope.selectAccount = function(id){
     $scope.selectedAccount = $scope.accounts.find(function(account){
       return account.id === id;
     });
     $scope.selectedProperty = {};
    };
    $scope.selectProperty = function(id){
     $scope.selectedProperty = $scope.selectedAccount.properties.find(function(property){
       return property.id === id;
     });
    };
    $scope.selectView = function(viewID){
     ngarReportService.updateViewId(viewID);
     $scope.closePanel();
    };
  }])

  .directive('ngarViewSelector', ["ngarViewSelectorService", "ngarReportService", function (ngarViewSelectorService,ngarReportService) {
    return {
      restrict: 'A',
      scope: {
        defaultView : '='
      },
      link: function(scope, el){
        el.bind('click', function(){
          ngarViewSelectorService.showSelector();
        });
        scope.$watch('defaultView', function(viewId){
          if (viewId){
            ngarReportService.updateViewId(viewId);
          }
        });
      }
    };
  }]);
