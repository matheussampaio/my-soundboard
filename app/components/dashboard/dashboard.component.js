(function () {

  angular
    .module('mysoundboard')
    .component('dashboard', {
      controller: dashboardController,
      templateUrl: 'dashboard/dashboard.html'
    });

  function dashboardController(ResourceFactory, UserService) {
    const vm = this;

    vm.data = null;

    activate();

    ////////////////

    function activate() {
      ResourceFactory.audio.get({
        userId: UserService.data.uid
      }).$promise.then(data => {
        vm.data = data;
      });
    }
  }

})();
