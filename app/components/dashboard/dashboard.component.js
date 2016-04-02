(function () {

  angular
    .module('mysoundboard')
    .component('dashboard', {
      controller: dashboardController,
      templateUrl: 'dashboard/dashboard.html'
    });

  function dashboardController(BoardAudiosService, BoardScriptsService) {
    const vm = this;

    vm.audio = null;
    vm.script = null;

    activate();

    ////////////////

    function activate() {
      vm.audio = BoardAudiosService.getAudios();
      vm.script = BoardScriptsService.getScripts();
    }
  }

})();
