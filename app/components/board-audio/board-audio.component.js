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

  function boardAudioController($scope, $mdToast, ResourceFactory, BoardAudiosService) {
    const vm = this;

    vm.vars = {
      editing: 0,
      playing: false,
      keyBackup: null,
      audio: new Audio(`http://localhost:3000/api/audiodata/${vm.data.file}/stream`)
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
      if (vm.data.key && !vm.data.disabled) {
        BoardAudiosService.register({
          audio: vm.data,
          play,
          stop
        });

      } else {
        console.log(`no keybinding`, vm.data);
        // BoardAudiosService.unregister({
        //   audio: vm.data
        // });
      }
    }

    function edit() {
      vm.vars.keyBackup = vm.data.key;
      vm.vars.editing = true;
    }

    function save() {
      vm.vars.editing = false;

      vm.data.key = vm.data.key || '';

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

      $mdToast.show($mdToast.simple().textContent('Audio Deleted!'));

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
