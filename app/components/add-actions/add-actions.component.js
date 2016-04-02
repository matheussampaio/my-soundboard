(function () {

  angular
    .module('mysoundboard')
    .component('addActions', {
      controller: addActionsController,
      templateUrl: 'add-actions/add-actions.html'
    });

  function addActionsController($log, ActionService) {
    const vm = this;

    vm.data = {};
    vm.addAction = addAction;
    vm.iterate = iterate;

    function addAction() {
      const action = { type: vm.data.action };

      if (action.type === 'play') {
        action.music = [vm.data.music];
        action.loop = vm.data.loop || false;
      }

      if (action.type === 'pause') {
        action.indexes = vm.data.indexes.split(',');
      }

      if (action.type === 'wait') {
        action.milli = vm.data.milliseconds;
      }

      if (action.type === 'move') {
        action.index = vm.data.index;
        action.times = vm.data.times;
      }

      ActionService.addAction(action);
    }

    function iterate() {
      ActionService.nextIndex = 0;
      ActionService.iterate();
    }
  }

})();
