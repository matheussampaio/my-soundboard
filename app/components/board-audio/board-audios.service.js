(function () {

  angular
    .module('mysoundboard')
    .service('BoardAudiosService', BoardAudiosService);

  function BoardAudiosService(ResourceFactory, UserService) {
    const service = {
      addAudio,
      getAudios,
      data: []
    };

    activate();

    return service;

    ///////////////////

    function activate() {
      service.data = ResourceFactory.audio.query({
        user: UserService.data.uid
      });
    }

    function addAudio(audio) {
      service.data.push(audio);
    }

    function getAudios() {
      return service.data;
    }
  }

})();
