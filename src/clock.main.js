const updateTimeElements = (hours, minutes, ampm) => {
  document.getElementById('hours').innerHTML = hours;
  document.querySelector('.ampm-top').innerHTML = ampm;
  document.querySelector('.ampm-bottom').innerHTML = 'M';
  document.getElementById('minutes').innerHTML = minutes;
};

// eslint-disable-next-line import/prefer-default-export
const getTime = (date) => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'P' : 'A';
  hours %= 12;
  hours = hours || 12; // the hour '0' should be '12'
  hours = (`0${hours}`).slice(-2); // single digit hours should have leading 0
  minutes = (`0${minutes}`).slice(-2); // single digit minutes should have leading 0
  return [hours, minutes, ampm];
};

const clock = () => {
  const date = new Date();
  const [hours, minutes, ampm] = getTime(date);
  updateTimeElements(hours, minutes, ampm);
};

clock();
setInterval(() => {
  clock();
}, 1000);
