'use strict';

let noSleep = null;

class Interval {
  constructor(activeInterval, restInterval, timeElement) {
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

  createEventListeners() {
    this.startButton.addEventListener('click', this.start.bind(this));
    this.startButton.addEventListener('click', function enableNoSleep() {
      document.removeEventListener('click', enableNoSleep, false);
      // eslint-disable-next-line no-undef
      noSleep = new NoSleep();
      noSleep.enable();
    }, false);
    this.pauseButton.addEventListener('click', this.pause.bind(this));
    this.resetButton.addEventListener('click', this.reset.bind(this));
    // display settings modal
    this.settingsButton.addEventListener('click', this.displaySettings.bind(this));
  }

  updateActiveInterval(seconds) {
    this.activeInterval = seconds * 1000; // convert to ms
  }

  updateRestInterval(seconds) {
    this.restInterval = seconds * 1000; // convert to ms
  }

  start() {
    this.audio.play(); // play sound indicating period has ended
    clearInterval(this.interval);
    this.isPaused = false;
    this.updateButtonState();
    this.setEndTime(this.remainingTime);
    this.interval = setInterval(() => {
      const ms = this.end.getTime() - new Date().getTime();
      if (ms < 0) {
        // change to the other interval
        this.isActiveInterval = !this.isActiveInterval;
        clearInterval(this.interval);
        this.remainingTime = this.isActiveInterval ? this.activeInterval : this.restInterval;
        this.start();
      } else {
        const domTime = parseInt(this.timeElement.textContent, 10);
        const updatedTime = Math.ceil(ms / 1000);
        if (domTime !== updatedTime) {
          this.timeElement.textContent = updatedTime;
        }
      }
    }, 100);
  }

  pause() {
    clearInterval(this.interval);
    this.isPaused = true;
    this.updateButtonState();
    this.remainingTime = this.end - new Date(); // in ms
  }

  reset() {
    clearInterval(this.interval); // stops the current interval
    // resets the interval to the 'active' state
    this.isPaused = true;
    this.updateButtonState();
    this.isActiveInterval = true;
    this.remainingTime = this.activeInterval;
    this.setEndTime(this.timeElement);
    this.timeElement.textContent = Math.ceil(this.remainingTime / 1000);
  }

  updateButtonState() {
    // if timer is paused, show the start button, else show the pause button
    if (this.isPaused) {
      this.startButton.classList.remove('hidden');
      this.pauseButton.classList.add('hidden');
    } else {
      this.startButton.classList.add('hidden');
      this.pauseButton.classList.remove('hidden');
    }
  }

  displaySettings() {
    this.settingsModal.classList.remove('hidden');
  }

  setEndTime(milliseconds) {
    this.end = new Date();
    this.end.setMilliseconds(this.end.getMilliseconds() + milliseconds);
  }
}

// eslint-disable-next-line no-unused-vars
const i = new Interval(888, 30, document.querySelector('.time'));

const resizeTime = () => {
  const gridDiv = document.querySelector('.grid-container');
  const timeDiv = document.querySelector('.time');
  const height = gridDiv.clientHeight * 0.55;
  timeDiv.style['font-size'] = `clamp(1rem, 55vw, ${height}px)`;
  timeDiv.style['line-height'] = `${height}px`;
};
window.addEventListener('resize', resizeTime);
resizeTime();
