(function () {

  angular
    .module('mysoundboard')
    .component('boardAudio', {
      controller: boardAudioController,
      templateUrl: 'board-audio/board-audio.html',
      bindings: {
        data: '='
      }
    });

  function boardAudioController($scope, hotkeys, ResourceFactory) {
    const vm = this;

    vm.vars = {
      editing: 0,
      playing: false,
      keyBackup: null,
      audio: new Audio(`http://localhost:3000/api/audiodata/${vm.data.file}/stream`)
    };

    vm.edit = edit;
    vm.save = save;
    vm.cancel = cancel;
    vm.delete = deletefn;

    activate();

    ///////////////

    function activate() {
      if (vm.data.key && !vm.data.disabled) {
        hotkeys.bindTo($scope)
          .add({
            combo: vm.data.key,
            description: vm.data.title,
            action: 'keydown',
            callback: () => {
              play();
            }
          })
          .add({
            combo: vm.data.key,
            description: vm.data.title,
            action: 'keyup',
            callback: () => {
              stop();
            }
          });
      }
    }

    function edit() {
      vm.vars.keyBackup = vm.data.key;
      vm.vars.editing = true;
    }

    function save() {
      vm.vars.editing = false;

      ResourceFactory
        .audio
        .update({
          audioId: vm.data._id
        }, vm.data);

      activate();
    }

    function cancel() {
      vm.data.key = vm.vars.keyBackup;
      vm.vars.editing = false;
    }

    function deletefn() {
      ResourceFactory
        .audio
        .delete({
          audioId: vm.data._id
        });

      vm.data.deleted = true;
    }

    function play() {
      if (!vm.vars.playing && !vm.vars.editing && !vm.data.disabled) {
        vm.vars.playing = true;
        vm.vars.audio.play();
      }
    }

    function stop() {
      if (vm.vars.playing) {
        vm.vars.playing = false;
        vm.vars.audio.pause();
        vm.vars.audio.load();
      }
    }

  }

})();
