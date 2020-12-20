'use strict';

const noSleep = new NoSleep();

class Interval {
  constructor(primary, secondary, primaryElement, secondaryElement) {
    this.primary = primary;
    this.secondary = secondary;
    this.primaryElement = primaryElement;
    this.secondaryElement = secondaryElement;
    this.isPrimary = true;
    this.end = null;
    this.interval = null;
    this.target = null;
    this.audio = document.querySelector('.audio');
    this.createEventListeners();
  }

  createEventListeners() {
    document.querySelector('.start').addEventListener('click', this.start.bind(this));
    document.querySelector('.start').addEventListener('click', function enableNoSleep() {
      document.removeEventListener('click', enableNoSleep, false);
      noSleep.enable();
    }, false);
    document.querySelector('.reset').addEventListener('click', this.reset.bind(this));
    document.querySelector('.select-primary').addEventListener('change', (event) => {
      this.updatePrimary.bind(this)(parseInt(event.target.value, 10));
      this.reset.bind(this)();
    });
    document.querySelector('.select-secondary').addEventListener('change', (event) => {
      this.updateSecondary.bind(this)(parseInt(event.target.value, 10));
      this.reset.bind(this)();
    });
  }

  updatePrimary(seconds) {
    this.primary = seconds;
  }

  updateSecondary(seconds) {
    this.secondary = seconds;
  }

  start() {
    this.audio.play(); // play sound indicating period has ended
    clearInterval(this.interval);
    this.setEndTime(this.isPrimary ? this.primary : this.secondary);
    this.target = this.isPrimary ? this.primaryElement : this.secondaryElement;
    this.interval = setInterval(() => {
      const ms = this.end.getTime() - new Date().getTime();
      this.target.textContent = Math.ceil(ms / 1000);
      if (ms <= 0) {
        const value = this.isPrimary ? this.primary : this.secondary;
        this.isPrimary = !this.isPrimary;
        this.setActive();
        this.target.textContent = value;
        clearInterval(this.interval);
        this.start();
      }
    }, 10);
  }

  reset() {
    clearInterval(this.interval);
    this.isPrimary = true;
    this.setActive();
    this.setEndTime(this.primaryElement);
    this.primaryElement.textContent = this.primary;
    this.secondaryElement.textContent = this.secondary;
  }

  setActive() {
    if (this.isPrimary) {
      this.primaryElement.parentElement.classList.remove('inactive');
      this.secondaryElement.parentElement.classList.add('inactive');
    } else {
      this.primaryElement.parentElement.classList.add('inactive');
      this.secondaryElement.parentElement.classList.remove('inactive');
    }
  }

  setEndTime(seconds) {
    this.end = new Date();
    this.end.setSeconds(this.end.getSeconds() + seconds);
  }
}

const i = new Interval(90, 30, document.querySelector('#interval-primary'),
  document.querySelector('#interval-secondary'));

i.reset();
