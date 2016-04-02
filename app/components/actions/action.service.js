(function () {

  angular
    .module('mysoundboard')
    .service('ActionService', ActionService);

  function ActionService($log, $timeout) {
    const service = {
      variables: {},
      actions: [],
      nextIndex: 0,
      iterate,
      addAction,
      removeAction
    };

    // service.actions = [
    // 	{ type: 'play', music: ['http://www.noiseaddicts.com/samples_1w72b820/4940.mp3', 'http://www.noiseaddicts.com/samples_1w72b820/3733.mp3'], loop: true },
    //   { type: 'play', music: ['http://www.noiseaddicts.com/samples_1w72b820/2240.mp3'], loop: false },
    //   { type: 'wait', milli: 3000 },
    //   { type: 'pause', indexes: [1] },
    //   { type: 'move', index: 0, times: 2 },
    //   { type: 'wait', milli: 15000 },
    //   { type: 'stop' }
    // ];

    return service;

    function iterate() {
      executeAction()
      .then(() => iterate())
      .catch(() => { $log.debug('stop'); });
    }

    function addAction(action) {
      $log.debug('adding action');
      $log.debug(action);

      service.actions.push(action);
    }

    function removeAction(index) {
      $log.debug(`removing action ${index}`);
      service.actions.splice(index, 1);
    }

    function executeAction() {
      $log.debug(`execute action, nextIndex: ${service.nextIndex}`);
      const element = service.actions[service.nextIndex];

      if (element.type === 'play') {
        return play(element);
      }

      if (element.type === 'wait') {
        return waitFor(element);
      }

      if (element.type === 'move') {
        return moveTo(element);
      }

      if (element.type === 'pause') {
        return pauseMusic(element);
      }

      if (element.type === 'stop') {
        return stopScript();
      }
    }

    function play({ music, loop }) {
      $log.debug(`play music "${music}" loop: ${loop}`);

      const audio = new Audio(music);
      audio.loop = loop;
      audio.play();

      service.actions[service.nextIndex].audioElement = audio;
      service.nextIndex++;
      return Promise.resolve();
    }

    function waitFor({ milli }) {
      $log.debug(`wait for ${milli}ms`);

      service.nextIndex++;
      return new Promise((resolve) => {
        $timeout(resolve, milli);
      });
    }

    function moveTo({ index, times }) {
      $log.debug(`move to index ${index}, ${times} times`);

      // track which iteration we are now and if is not yet defined, define it
      // with the times value
      if (service.variables[index]) {
        service.variables[index]--;
      } else {
        service.variables[index] = times;
      }

      // if is the last iteration on the move, go to the next action
      // otherwise, go to the index
      if (service.variables[index] === 0) {
        delete service.variables[index];
        service.nextIndex++;
      } else {
        service.nextIndex = index;
      }

      return Promise.resolve();
    }

    function pauseMusic({ indexes }) {
      $log.debug('pause musics');

      indexes.forEach((index) => {
        service.actions[index].audioElement.pause();
        delete service.actions[index].audioElement;
      });

      service.nextIndex++;
      return Promise.resolve();
    }

    function stopScript() {
      $log.debug('stop script');

      service.actions.forEach((action) => {
        action.audioElement.pause();
        delete action.audioElement;
      });

      return Promise.reject();
    }
  }

})();
