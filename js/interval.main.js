'use strict';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var noSleep = null;

var Interval = /*#__PURE__*/function () {
  function Interval(activeInterval, restInterval, timeElement) {
    _classCallCheck(this, Interval);

    this.activeInterval = activeInterval * 1000; // in ms

    this.restInterval = restInterval * 1000; // in ms

    this.timeElement = timeElement;
    this.isActiveInterval = true;
    this.end = null;
    this.isPaused = true;
    this.remainingTime = this.activeInterval; // already in ms

    this.interval = null;
    this.target = null;
    this.audio = document.querySelector('.audio');
    this.activeIntervalOption = document.querySelector('.select-active');
    this.restIntervalOption = document.querySelector('.select-rest');
    this.startButton = document.querySelector('.start');
    this.pauseButton = document.querySelector('.pause');
    this.resetButton = document.querySelector('.reset');
    this.settingsButton = document.querySelector('.settings');
    this.settingsModal = document.querySelector('.settings-modal');
    this.createEventListeners();
    this.reset(); // create the default state
  }

  _createClass(Interval, [{
    key: "createEventListeners",
    value: function createEventListeners() {
      this.startButton.addEventListener('click', this.start.bind(this));
      this.startButton.addEventListener('click', function enableNoSleep() {
        document.removeEventListener('click', enableNoSleep, false); // eslint-disable-next-line no-undef

        noSleep = new NoSleep();
        noSleep.enable();
      }, false);
      this.pauseButton.addEventListener('click', this.pause.bind(this));
      this.resetButton.addEventListener('click', this.reset.bind(this)); // display settings modal

      this.settingsButton.addEventListener('click', this.displaySettings.bind(this));
    }
  }, {
    key: "updateActiveInterval",
    value: function updateActiveInterval(seconds) {
      this.activeInterval = seconds * 1000; // convert to ms
    }
  }, {
    key: "updateRestInterval",
    value: function updateRestInterval(seconds) {
      this.restInterval = seconds * 1000; // convert to ms
    }
  }, {
    key: "start",
    value: function start() {
      var _this = this;

      this.audio.play(); // play sound indicating period has ended

      clearInterval(this.interval);
      this.isPaused = false;
      this.updateButtonState();
      this.setEndTime(this.remainingTime);
      this.interval = setInterval(function () {
        var ms = _this.end.getTime() - new Date().getTime();

        if (ms < 0) {
          // change to the other interval
          _this.isActiveInterval = !_this.isActiveInterval;
          clearInterval(_this.interval);
          _this.remainingTime = _this.isActiveInterval ? _this.activeInterval : _this.restInterval;

          _this.start();
        } else {
          var domTime = parseInt(_this.timeElement.textContent, 10);
          var updatedTime = Math.ceil(ms / 1000);

          if (domTime !== updatedTime) {
            _this.timeElement.textContent = updatedTime;
          }
        }
      }, 100);
    }
  }, {
    key: "pause",
    value: function pause() {
      clearInterval(this.interval);
      this.isPaused = true;
      this.updateButtonState();
      this.remainingTime = this.end - new Date(); // in ms
    }
  }, {
    key: "reset",
    value: function reset() {
      clearInterval(this.interval); // stops the current interval
      // resets the interval to the 'active' state

      this.isPaused = true;
      this.updateButtonState();
      this.isActiveInterval = true;
      this.remainingTime = this.activeInterval;
      this.setEndTime(this.timeElement);
      this.timeElement.textContent = Math.ceil(this.remainingTime / 1000);
    }
  }, {
    key: "updateButtonState",
    value: function updateButtonState() {
      // if timer is paused, show the start button, else show the pause button
      if (this.isPaused) {
        this.startButton.classList.remove('hidden');
        this.pauseButton.classList.add('hidden');
      } else {
        this.startButton.classList.add('hidden');
        this.pauseButton.classList.remove('hidden');
      }
    }
  }, {
    key: "displaySettings",
    value: function displaySettings() {
      this.settingsModal.classList.remove('hidden');
    }
  }, {
    key: "setEndTime",
    value: function setEndTime(milliseconds) {
      this.end = new Date();
      this.end.setMilliseconds(this.end.getMilliseconds() + milliseconds);
    }
  }]);

  return Interval;
}(); // eslint-disable-next-line no-unused-vars


var i = new Interval(888, 30, document.querySelector('.time'));

var resizeTime = function resizeTime() {
  var gridDiv = document.querySelector('.grid-container');
  var timeDiv = document.querySelector('.time');
  var height = gridDiv.clientHeight * 0.55;
  timeDiv.style['font-size'] = "clamp(1rem, 55vw, ".concat(height, "px)");
  timeDiv.style['line-height'] = "".concat(height, "px");
};

window.addEventListener('resize', resizeTime);
resizeTime();
