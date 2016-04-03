(function () {

  class ScriptRunFactory {
    constructor($log, $timeout) {
      this.$log = $log;
      this.$timeout = $timeout;

      this.variables = {};
      this.actions = null;
      this.nextIndex = 0;
      this.playing = false;
      this.isInitialized = false;
      this.timeouts = [];
    }

    init(actions) {
      this.actions = actions;
      this.isInitialized = true;
      this.playing = true;
    }

    iterate() {
      if (!this.playing || !this.isInitialized) {
        return Promise.reject();
      }

      return this._executeAction()
        .then(() => this.iterate());
    }

    stop() {
      this._stopScript().catch(() => {});
    }

    _executeAction() {
      this.$log.debug(`execute action, nextIndex: ${this.nextIndex}`);

      if (this.nextIndex < 0 || this.nextIndex >= this.actions.length) {
        return this._stopScript();
      }

      const element = this.actions[this.nextIndex];

      if (element.type === 'play') {
        return this._play(element);
      }

      if (element.type === 'wait') {
        return this._waitFor(element);
      }

      if (element.type === 'move') {
        return this._moveTo(element);
      }

      if (element.type === 'pause') {
        return this._pauseMusic(element);
      }
    }

    _play({ audio, loop }) {
      this.$log.debug(`play audio "${audio}" loop: ${loop}`);

      const audioEl = new Audio(audio);
      audioEl.loop = loop;
      audioEl.play();

      this.actions[this.nextIndex].audioElement = audioEl;
      this.nextIndex++;
      return Promise.resolve();
    }

    _waitFor({ milli }) {
      this.$log.debug(`wait for ${milli}ms`);

      this.nextIndex++;

      return new Promise((resolve, reject) => {
        this.timeouts.push(setTimeout(() => {
          console.log(`timeout finsiehd`);
          resolve();
        }, milli));
      });
    }

    _moveTo({ index, times }) {
      this.$log.debug(`move to index ${index}, ${times} times`);

      // track which iteration we are now and if is not yet defined, define it
      // with the times value
      if (this.variables[index]) {
        this.variables[index]--;
      } else {
        this.variables[index] = times;
      }

      // if is the last iteration on the move, go to the next action
      // otherwise, go to the index
      if (this.variables[index] === 0) {
        delete this.variables[index];
        this.nextIndex++;
      } else {
        this.nextIndex = index;
      }

      return Promise.resolve();
    }

    _pauseMusic({ indexes }) {
      this.$log.debug('pause audios');

      indexes.forEach((index) => {
        this.actions[index].audioElement.pause();
        delete this.actions[index].audioElement;
      });

      this.nextIndex++;
      return Promise.resolve();
    }

    _stopScript() {
      this.playing = false;

      this.$log.debug('stop script');

      this.actions.forEach((action) => {
        if (action.type === 'play') {
          action.audioElement.pause();
          delete action.audioElement;
        }
      });

      this.timeouts.forEach(timeoutId => {
        clearTimeout(timeoutId);
      });

      this.timeouts = [];

      return Promise.reject();
    }

  }

  angular
    .module('mysoundboard')
    .factory('ScriptRunFactory', () => ScriptRunFactory);

})();
