(function () {

  angular
    .module('mysoundboard')
    .service('HotkeysService', HotkeysService);

  function HotkeysService($rootScope, hotkeys, BoardAudiosService, BoardScriptsService) {
    const service = {
      register,
      unregister,
      audios: [],
      scripts: [],
      hotkeys: [],
      keysPressed: {}
    };

    activate();

    return service;

    ///////////////////

    function activate() {
      service.audios = BoardAudiosService.getAudios();
      service.scripts = BoardScriptsService.getScripts();
    }

    function register({ type, id, hotkey, play, stop }) {
      service.hotkeys.push({ type, id, hotkey, play, stop });

      hotkey.split('+').forEach(bind => {
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

    function unregister({ type, id }) {
      service.hotkeys = service.hotkeys.filter(h => h.id === id && h.type === type);
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
      service.hotkeys.forEach((obj) => {
        let allPressed = true;

        obj.hotkey.split('+').forEach(k => {
          allPressed = allPressed && service.keysPressed[k];
        });

        if (allPressed) {
          obj.play();
        } else {
          obj.stop();
        }
      });
    }
  }

})();
