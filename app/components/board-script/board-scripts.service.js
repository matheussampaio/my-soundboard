(function () {

  angular
    .module('mysoundboard')
    .service('BoardScriptsService', BoardScriptsService);

  function BoardScriptsService(ResourceFactory, UserService) {
    const service = {
      addScript,
      getScripts,
      createScript,
      data: []
    }

    activate();

    return service;

    ///////////////////

    function activate() {
      service.data = ResourceFactory.script.query({
        user: UserService.data.uid
      });
    }

    function addScript(script) {
      service.data.push(script);
    }

    function getScripts() {
      return service.data;
    }

    function createScript() {
      const script = new ResourceFactory.script();

      script.title = 'Script Title';
      script.user = UserService.data.uid;
      script.data = [];
      service.data.push(script);
      script.$save();
    }
  }

})();
