(function () {

  angular
    .module('mysoundboard')
    .component('addActions', {
      controller: addActionsController,
      templateUrl: 'add-actions/add-actions.html'
    });

  function addActionsController($scope, $log, ActionService, $mdDialog) {
    const vm = this;

    vm.data = {};
    vm.showDialog = showDialog;
    vm.addAction = addAction;
    vm.iterate = iterate;
    vm.actions = ActionService.actions;

    function showDialog($event) {
      $mdDialog.show({
        templateUrl: 'add-actions/dialog.tmpl.html',
        targetEvent: $event,
        scope: $scope,
        clickOutsideToClose: true
      });
    }

    function addAction() {
      const action = { type: vm.data.type };

      if (action.type === 'play') {
        action.music = vm.data.music;
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
