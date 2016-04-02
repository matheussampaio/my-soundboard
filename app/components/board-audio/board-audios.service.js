(function () {

  angular
    .module('mysoundboard')
    .service('BoardAudiosService', BoardAudiosService);

  function BoardAudiosService($rootScope, hotkeys, ResourceFactory, UserService) {
    const service = {
      addAudio,
      getAudios,
      register,
      unregister,
      keys: [],
      keysPressed: {},
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

    function targetKeyPressed(event, key) {
      service.keysPressed[key.combo[0]] = true;

      _refresh();
    }

    function targetKeyUnpressed(event, key) {
      service.keysPressed[key.combo[0]] = false;

      _refresh();
    }

    function _refresh() {
      console.log(service.keysPressed);
      service.keys.forEach((obj) => {
        let allPressed = true;

        obj.audio.key.split('+').forEach(k => {
          allPressed = allPressed && service.keysPressed[k];
        });

        if (allPressed) {
          obj.play();
        } else {
          obj.stop();
        }
      });
    }

    function register(data) {
      service.keys.push(data);

      data.audio.key.split('+').forEach(bind => {
        hotkeys.bindTo($rootScope)
          .add({
            combo: bind,
            action: 'keydown',
            callback: (event, key) => {
              targetKeyPressed(event, key);
            }
          })
          .add({
            combo: bind,
            action: 'keyup',
            callback: (event, key) => {
              targetKeyUnpressed(event, key);
            }
          });
      });
    }

    function unregister({ audio }) {
      service.keys = service.keys.filter(key => key.data._id === audio._id);
    }
  }

})();
