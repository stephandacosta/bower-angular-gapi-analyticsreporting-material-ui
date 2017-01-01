'use strict';

/**
 * @ngdoc service
 * @name angular-gapi-reporting-UI viewSelector
 * @description
 * # viewSelector
 * modules and components in angular-gapi-reporting-UI to select view ID
 */

angular.module('angularGapiAnalyticsreportingUI')
  .factory('ngarViewSelectorService', function (ngarManagementService, $mdPanel, $mdMedia) {

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

  })

  .controller('ViewSelectorCtrl', function($scope, mdPanelRef, ngarManagementService, ngarReportService, accounts){
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
  })

  .directive('ngarViewSelector', function (ngarViewSelectorService) {
    return {
      restrict: 'A',
      scope: {},
      link: function(scope, el){
        el.bind('click', function(){
          ngarViewSelectorService.showSelector();
        });
      }
    };
  });
