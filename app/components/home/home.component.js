(function () {

  angular
    .module('mysoundboard')
    .component('home', {
      controller: homeController,
      templateUrl: 'home/home.html'
    });

  function homeController($rootScope, ResourceFactory, UserService) {
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
