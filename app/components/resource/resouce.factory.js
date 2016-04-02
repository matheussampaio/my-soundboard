(function () {

  angular
    .module('mysoundboard')
    .factory('ResourceFactory', ResourceFactory);

  function ResourceFactory($resource) {
    const DOMAIN = `/api`;

    const vm = {
      audio: audioResource(),
      script: scriptResource()
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

    function scriptResource() {
      return $resource(`${DOMAIN}/script/:scriptId`, {
        scriptId: '@id'
      }, {
        update: {
          method: 'PUT'
        }
      });
    }
  }

})();
