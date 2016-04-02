(function () {

  angular
    .module('mysoundboard')
    .service('FirebaseService', FirebaseService);

  function FirebaseService($firebaseAuth) {
    const URL = 'https://my-soundboard.firebaseio.com/';

    const service = {
      ref: new Firebase(URL),
      auth: null
    };

    active();

    return service;

    ///////////////////

    function active() {
      service.auth = $firebaseAuth(service.ref);
    }
  }

})();
