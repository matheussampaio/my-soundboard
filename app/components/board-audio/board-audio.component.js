(function () {

  angular
    .module('mysoundboard')
    .component('boardAudio', {
      controller: boardAudioController,
      templateUrl: 'board-audio/board-audio.html',
      bindings: {
        audio: '='
      }
    });

  function boardAudioController($scope, $mdToast, ResourceFactory, BoardAudiosService) {
    const vm = this;

    vm.vars = {
      editing: 0,
      playing: false,
      keyBackup: null,
      audio: new Audio(`http://localhost:3000/api/audiodata/${vm.audio.file}/stream`)
    };

    vm.vars.audio.onended = () => {
      vm.vars.playing = false;
    };

    vm.edit = edit;
    vm.save = save;
    vm.cancel = cancel;
    vm.delete = deletefn;

    activate();

    ///////////////

    function activate() {
      if (vm.audio.key && !vm.audio.disabled) {
        BoardAudiosService.register({
          audio: vm.audio,
          play,
          stop
        });

      } else {
        console.log(`no keybinding`, vm.audio);
        // BoardAudiosService.unregister({
        //   audio: vm.audio
        // });
      }
    }

    function edit() {
      vm.vars.keyBackup = vm.audio.key;
      vm.vars.editing = true;
    }

    function save() {
      vm.vars.editing = false;

      vm.audio.key = vm.audio.key || '';

      ResourceFactory
        .audio
        .update({
          audioId: vm.audio._id
        }, vm.audio);

      activate();
    }

    function cancel() {
      vm.audio.key = vm.vars.keyBackup;
      vm.vars.editing = false;
    }

    function deletefn() {
      ResourceFactory
        .audio
        .delete({
          audioId: vm.audio._id
        });

      $mdToast.show($mdToast.simple().textContent('Audio Deleted!'));

      vm.audio.deleted = true;
    }

    function play() {
      if (!vm.vars.playing && !vm.vars.editing && !vm.audio.disabled) {
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
