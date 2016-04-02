(function () {

  angular
    .module('mysoundboard')
    .component('dashboard', {
      controller: dashboardController,
      templateUrl: 'dashboard/dashboard.html'
    });

  function dashboardController(BoardAudiosService) {
    const vm = this;

    vm.data = null;

    activate();

    ////////////////

    function activate() {
      vm.data = BoardAudiosService.getAudios();
    }
  }

})();
