/**
 * @name app module configuration
 *
 * @author Felix Brucker
 * @version v0.0.1
 *
 * @description
 * hanldes top level configuration
 *
 */
(function () {
  'use strict';

  var app = angular.module('app', ['ui.router', 'angular-loading-bar'])
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', config])
    .config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
      cfpLoadingBarProvider.includeSpinner = false;
      cfpLoadingBarProvider.latencyThreshold = 100;
    }]);
  app.directive('updateTitle', ['$rootScope', '$timeout',
    function ($rootScope, $timeout) {
      return {
        link: function (scope, element) {

          var listener = function (event, toState) {

            var title = 'Miner-Manager';
            if (toState.data && toState.data.pageTitle) title = toState.data.pageTitle;

            $timeout(function () {
              element.text(title);
            }, 0, false);
          };

          $rootScope.$on('$stateChangeSuccess', listener);
        }
      };
    }
  ]);
  app.directive('highlighter', ['$timeout', function ($timeout) {
    return {
      restrict: 'A',
      scope: {
        model: '=highlighter'
      },
      link: function (scope, element) {
        scope.$watch('model', function (nv, ov) {
          if (nv !== ov) {
            element.addClass('highlight');
            $timeout(function () {
              element.removeClass('highlight');
            }, 2000);
          }
        });
      }
    };
  }]);
  app.filter('bytes', function () {
    return function (bytes, precision) {
      if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
      if (typeof precision === 'undefined') precision = 1;
      var units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'],
        number = Math.floor(Math.log(bytes) / Math.log(1024));
      return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
    }
  });
  app.filter('hashrate', function () {
    return function (hashrate, precision, start = 1) {
      if (isNaN(parseFloat(hashrate)) || !isFinite(hashrate)) return '';
      if (parseFloat(hashrate) === 0) return '0 H/s';
      if (typeof precision === 'undefined') precision = 1;
      hashrate = hashrate * Math.pow(1000, start);
      var units = ['H/s', 'KH/s', 'MH/s', 'GH/s', 'TH/s', 'PH/s'],
        number = Math.floor(Math.log(hashrate) / Math.log(1000));
      if (number<0)
        return hashrate.toFixed(precision) + ' H/s';
      else
      return (hashrate / Math.pow(1000, Math.floor(number))).toFixed(precision) + ' ' + units[number];
    }
  });
  app.filter('iterationrate', function () {
    return function (hashrate, precision) {
      if (isNaN(parseFloat(hashrate)) || !isFinite(hashrate)) return '';
      if (parseFloat(hashrate) === 0) return '0 I/s';
      if (typeof precision === 'undefined') precision = 1;
      var units = ['I/s', 'KI/s', 'MI/s', 'GI/s', 'TI/s', 'PI/s'],
        number = Math.floor(Math.log(hashrate) / Math.log(1000));
      if (number<0)
        return hashrate.toFixed(precision) + ' I/s';
      else
        return (hashrate / Math.pow(1000, Math.floor(number))).toFixed(precision) + ' ' + units[number];
    }
  });
  app.filter('solutionrate', function () {
    return function (hashrate, precision) {
      if (isNaN(parseFloat(hashrate)) || !isFinite(hashrate)) return '';
      if (parseFloat(hashrate) === 0) return '0 Sol/s';
      if (typeof precision === 'undefined') precision = 1;
      var units = ['Sol/s', 'KSol/s', 'MSol/s', 'GSol/s', 'TSol/s', 'PSol/s'],
        number = Math.floor(Math.log(hashrate) / Math.log(1000));
      if (number<0)
        return hashrate.toFixed(precision) + ' Sol/s';
      else
      return (hashrate / Math.pow(1000, Math.floor(number))).toFixed(precision) + ' ' + units[number];
    }
  });
  app.filter('secondsToTimeString', function () {
    return function (seconds) {
      var days = Math.floor(seconds / 86400);
      var hours = Math.floor((seconds % 86400) / 3600);
      var minutes = Math.floor(((seconds % 86400) % 3600) / 60);
      var timeString = '';
      if (days > 0) timeString += (days > 1) ? (days + " days ") : (days + " day ");
      if (hours > 0) timeString += (hours > 1) ? (hours + " hours ") : (hours + " hour ");
      if (minutes >= 0) timeString += (minutes > 1) ? (minutes + " minutes ") : (minutes + " minute ");
      return timeString;
    }
  });

  function config($stateProvider, $urlRouterProvider, $locationProvider) {

    $locationProvider.html5Mode(true);

    //define module-specific routes here
    $stateProvider
      .state('stats', {
        url: '/',
        templateUrl: 'views/partials/stats.html',
        controller: 'statsCtrl',
        controllerAs: 'statsVm',
        data: {
          pageTitle: 'Miner-Manager Stats'
        }
      })
      .state('generalConfig', {
        url: '/generalConfig',
        templateUrl: 'views/partials/configGeneral.html',
        controller: 'configCtrl',
        controllerAs: 'configVm',
        data: {
          pageTitle: 'Miner-Control General Config'
        }
      })
      .state('minerConfig', {
        url: '/minerConfig',
        templateUrl: 'views/partials/configMiner.html',
        controller: 'configCtrl',
        controllerAs: 'configVm',
        data: {
          pageTitle: 'Miner-Manager Miner Config'
        }
      })
      .state('groupConfig', {
        url: '/groupConfig',
        templateUrl: 'views/partials/configGroups.html',
        controller: 'configCtrl',
        controllerAs: 'configVm',
        data: {
          pageTitle: 'Miner-Manager Group Config'
        }
      })
      .state('poolConfig', {
        url: '/poolConfig',
        templateUrl: 'views/partials/configPools.html',
        controller: 'configCtrl',
        controllerAs: 'configVm',
        data: {
          pageTitle: 'Miner-Manager Pool Config'
        }
      })
      .state('autoswitchPoolConfig', {
        url: '/autoswitchPoolConfig',
        templateUrl: 'views/partials/configAutoswitchPools.html',
        controller: 'configCtrl',
        controllerAs: 'configVm',
        data: {
          pageTitle: 'Miner-Manager Autoswitch Pools Config'
        }
      });
    $urlRouterProvider.otherwise('/');
  }

})();
