(function () {

  angular
    .module('mysoundboard')
    .factory('ResourceFactory', ResourceFactory);

  function ResourceFactory($resource) {
    const DOMAIN = `/api`;

    const vm = {
      audio: audioResource()
    }

    return vm;

    ///////////////////

    function audioResource() {
      return $resource(`${DOMAIN}/audio/:audioId`, {
        audioId: '@id'
      }, {
        update: {
          method: 'PUT'
        }
      });
    }
  }

})();
