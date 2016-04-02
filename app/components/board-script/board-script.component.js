(function () {

  angular
    .module('mysoundboard')
    .component('boardScript', {
      controller: BoardScriptController,
      templateUrl: 'board-script/board-script.html',
      bindings: {
        data: '='
      }
    });

  function BoardScriptController() {
    const vm = this;

    vm.vars = {
      editing: 0,
      playing: false,
      keyBackup: null
    };

    vm.edit = edit;
    vm.save = save;
    vm.cancel = cancel;
    vm.delete = deletefn;

    activate();

    ///////////////

    function activate() {
      if (vm.data.key && !vm.data.disabled) {
        // BoardAudiosService.register({
        //   audio: vm.data,
        //   play,
        //   stop
        // });

      } else {
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
        .script
        .update({
          scriptId: vm.data._id
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
