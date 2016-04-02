(function () {

  angular
    .module('mysoundboard')
    .service('UserService', UserService);

  function UserService($log, $rootScope, FirebaseService) {
    const service = {
      data: null
    };

    activate();

    return service;

    ///////////////////

    function activate() {
      FirebaseService.auth.$onAuth((user) => {
        $log.debug(`[$onAuth] receive user: ${user}`);
        service.data = user;
        _refresh();
      });
    }

    function _refresh() {
      if (!$rootScope.$$phase) {
        $log.debug('refreshing...');
        $rootScope.$apply();
      }
    }
  }

})();
