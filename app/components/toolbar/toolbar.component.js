(function () {

  angular
    .module('mysoundboard')
    .component('toolbar', {
      controller: toolbarController,
      templateUrl: 'toolbar/toolbar.html'
    });

  function toolbarController($state, $rootScope, $log, FirebaseService) {
    const vm = this;

    vm.$rootScope = $rootScope;

    vm.logout = logout;

    $log.debug('toolbar');
    $log.debug(vm.user);

    ////////////////

    function logout() {
      $log.debug('logout');
      FirebaseService.auth.$unauth();
      $state.go('app.home');
    }
  }

})();
