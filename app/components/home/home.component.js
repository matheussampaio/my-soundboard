(function () {

  angular
    .module('mysoundboard')
    .component('home', {
      controller: homeController,
      templateUrl: 'home/home.html'
    });

  function homeController(UserService) {
    const vm = this;

    vm.user = UserService;
  }

})();
