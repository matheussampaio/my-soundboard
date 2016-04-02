(function () {

  angular
    .module('mysoundboard')
    .component('dashboard', {
      controller: dashboardController,
      templateUrl: 'dashboard/dashboard.html'
    });

  function dashboardController($log, $timeout) {
    let nextIndex = 0;
    const variables = {};
    const actions = [
    	{ type: 'play', music: ['http://www.noiseaddicts.com/samples_1w72b820/4940.mp3', 'http://www.noiseaddicts.com/samples_1w72b820/3733.mp3'], loop: true },
      { type: 'play', music: ['http://www.noiseaddicts.com/samples_1w72b820/2240.mp3'], loop: false },
      { type: 'wait', milli: 3000 },
      { type: 'pause', indexes: [1] },
      { type: 'move', index: 0, times: 2 },
      { type: 'wait', milli: 15000 },
      { type: 'stop' }
    ];

    iterate();

    function iterate() {
      executeAction()
        .then(() => iterate())
        .catch(() => { $log.debug('stop'); });
    }

    function executeAction() {
      const element = actions[nextIndex];

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

      if (actions[nextIndex].audioElements === undefined) {
        actions[nextIndex].audioElements = [];
      }

      music.forEach((m) => {
        const audio = new Audio(m);
        audio.loop = loop;
        audio.play();

        actions[nextIndex].audioElements.push(audio);
      });

      nextIndex++;
      return Promise.resolve();
    }

    function waitFor({ milli }) {
      $log.debug(`wait for ${milli}ms`);

      nextIndex++;
      return new Promise((resolve) => {
        $timeout(resolve, milli);
      });
    }

    function moveTo({ index, times }) {
      $log.debug(`move to index ${index}, ${times} times`);

      // track which iteration we are now and if is not yet defined, define it
      // with the times value
      if (variables[index]) {
        variables[index]--;
      } else {
        variables[index] = times;
      }

      // if is the last iteration on the move, go to the next action
      // otherwise, go to the index
      if (variables[index] === 0) {
        delete variables[index];
        nextIndex++;
      } else {
        nextIndex = index;
      }

      return Promise.resolve();
    }

    function pauseMusic({ indexes }) {
      $log.debug('pause musics');

      indexes.forEach((index) => {
        const action = actions[index];

        removeAudioElement(action);
      });

      nextIndex++;
      return Promise.resolve();
    }

    function stopScript() {
      $log.debug('stop script');

      actions.forEach((action) => {
        if (action.type === 'play') {
          removeAudioElement(action);
        }
      });

      return Promise.reject();
    }

    function removeAudioElement({ audioElements }) {
      audioElements.forEach((element) => {
        element.pause();
      });

      audioElements = [];
    }
  }

})();
