(function () {

  angular
    .module('mysoundboard')
    .component('boardScript', {
      controller: BoardScriptController,
      templateUrl: 'board-script/board-script.html',
      bindings: {
        script: '='
      }
    });

  function BoardScriptController($rootScope, $log, $timeout, $scope, $mdToast,
    $mdDialog, ResourceFactory, BoardAudiosService, HotkeysService, ScriptRunFactory) {
    const vm = this;

    vm.vars = {
      playing: false,
      scriptRun: null
    };

    vm.play = play;
    vm.stop = stop;
    vm.edit = edit;
    vm.save = save;
    vm.close = close;
    vm.cancel = cancel;
    vm.delete = deletefn;
    vm.addAction = addAction;
    vm.removeAction = removeAction;

    activate();

    ///////////////

    function activate() {
      register();
    }

    function register() {
      if (vm.script.key && !vm.script.disabled) {
        HotkeysService.register({
          type: 'script',
          id: vm.script._id,
          hotkey: vm.script.key,
          play,
          stop
        });
      }
    }

    function unregister() {
      HotkeysService.unregister({
        type: 'script',
        id: vm.script._id
      });
    }

    function edit() {
      vm.form = {};
      vm.vars.audios = BoardAudiosService.getAudios();

      $mdDialog.show({
        scope: $scope,
        templateUrl: 'board-script/dialog.tmpl.html',
        preserveScope: true,
        escapeToClose: true,
        clickOutsideToClose: true
      });
    }

    function closeDialog() {
      $mdDialog.hide();
    }

    function save() {
      vm.script.key = vm.script.key || '';

      ResourceFactory
        .script
        .update({
          scriptId: vm.script._id
        }, vm.script);

      $mdToast.show($mdToast.simple().textContent('Script Saved!'));

      unregister();
      register();
      closeDialog();
    }

    function cancel() {
      // vm.script.key = vm.vars.keyBackup;
      // TODO: ROLLBACK
    }

    function deletefn() {
      ResourceFactory
        .script
        .delete({
          scriptId: vm.script._id
        });

      $mdToast.show($mdToast.simple().textContent('Script Deleted!'));

      vm.script.deleted = true;

      closeDialog();
    }

    function play() {
      if (!vm.vars.playing && !vm.script.disabled) {
        vm.vars.playing = true;
        vm.vars.scriptRun = new ScriptRunFactory($log, $timeout);
        vm.vars.scriptRun.init(vm.script.data);
        vm.vars.scriptRun.iterate()
          .catch(() => {
            vm.vars.playing = false;
            _refresh();
          });
      }
    }

    function _refresh() {
      if (!$rootScope.$$phase) {
        $rootScope.$digest();
      }
    }

    function stop() {
      if (vm.vars.playing) {
        vm.vars.playing = false;
        vm.vars.scriptRun.stop();
      }
    }

    function addAction() {
      const action = { type: vm.form.type };

      if (action.type === 'play') {
        action.audio = `http://my-soundboard.herokuapp.com/api/audiodata/${vm.form.audio}/stream`;
        action.loop = vm.form.loop || false;
      }

      if (action.type === 'pause') {
        action.indexes = vm.form.indexes.split(',');
      }

      if (action.type === 'wait') {
        action.milli = vm.form.milliseconds;
      }

      if (action.type === 'move') {
        action.index = vm.form.index;
        action.times = vm.form.times;
      }

      vm.script.data.push(action);
    }

    function removeAction(index) {
      vm.script.data.splice(index, 1);
    }

  }

})();
