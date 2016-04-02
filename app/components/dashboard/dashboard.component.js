(function () {

  angular
    .module('mysoundboard')
    .component('dashboard', {
      controller: dashboardController,
      templateUrl: 'dashboard/dashboard.html'
    });

  function dashboardController($log, $timeout) {
    
  }

})();
