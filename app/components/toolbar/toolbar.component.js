(function () {

  angular
    .module('mysoundboard')
    .component('toolbar', {
      controller: toolbarController,
      templateUrl: 'toolbar/toolbar.html'
    });

  function toolbarController($state, $log, FirebaseService, UserService) {
    const vm = this;

    vm.user = UserService;

    vm.logout = logout;

    console.log('toolbar', vm.user);

    ////////////////

    function logout() {
      $log.debug('logout');
      FirebaseService.auth.$unauth();
      $state.go('app.home');
    }
  }

})();
