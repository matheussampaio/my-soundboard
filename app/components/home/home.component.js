(function () {

  angular
    .module('mysoundboard')
    .component('home', {
      controller: homeController,
      templateUrl: 'home/home.html'
    });

  function homeController(UserService) {
    console.log('home', UserService.user);
  }

})();
