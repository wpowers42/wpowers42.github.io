/* eslint-disable no-undef */

console.log('Credit for zodiac sign: https://www.codewars.com/kata/5a376259b6cfd77ca000006b/solutions/javascript');
console.log('Credit for calendar CSS: https://mathiaspicker.com/CalendarPickerJS/');

const getZodiacSign = (day, month) => {
  if (month === 1) return day < 20 ? 'Capricorn' : 'Aquarius';
  if (month === 2) return day < 19 ? 'Aquarius' : 'Pisces';
  if (month === 3) return day < 21 ? 'Pisces' : 'Aries';
  if (month === 4) return day < 20 ? 'Aries' : 'Taurus';
  if (month === 5) return day < 21 ? 'Taurus' : 'Gemini';
  if (month === 6) return day < 22 ? 'Gemini' : 'Cancer';
  if (month === 7) return day < 23 ? 'Cancer' : 'Leo';
  if (month === 8) return day < 23 ? 'Leo' : 'Virgo';
  if (month === 9) return day < 23 ? 'Virgo' : 'Libra';
  if (month === 10) return day < 23 ? 'Libra' : 'Scorpio';
  if (month === 11) return day < 22 ? 'Scorpio' : 'Sagittarius';
  if (month === 12) return day < 22 ? 'Sagittarius' : 'Capricorn';
  return 'Unknown';
};

const getSign = (dt) => getZodiacSign(dt.date(), dt.month() + 1);

const getDaysArrayByMonth = (date) => {
  let daysInMonth = moment(date).daysInMonth();
  const arrDays = [];

  while (daysInMonth) {
    const current = moment(date).date(daysInMonth);
    arrDays.push(current);
    // eslint-disable-next-line no-plusplus
    daysInMonth--;
  }

  arrDays.sort((a, b) => a.date() - b.date());

  return arrDays;
};

const dates = (date = moment()) => {
  const arrDays = getDaysArrayByMonth(date);

  const enhancedDays = arrDays.map((day) => ({
    day: day.format('YYYY-MM-DD'),
    sign: getSign(day),
  }));
  return enhancedDays;
};

const update = (date = moment()) => {
  document.querySelector('#month').innerText = date.format('MMMM - YYYY');
  const days = dates(date);
  let padding = moment(days[0].day).day();
  while (padding > 0) {
    days.unshift(null);
    padding--;
  }

  const calendarWrapper = document.querySelector('#calendar-grid');
  calendarWrapper.innerHTML = '';
  days.forEach((day) => {
    const container = document.createElement(day ? 'time' : 'span');
    const number = document.createElement('div');
    const sign = document.createElement('div');
    number.textContent = day ? moment(day.day).date() : '';
    sign.textContent = day ? day.sign : '';
    container.appendChild(number);
    container.appendChild(sign);
    if (day && moment().dayOfYear() > moment(day.day).dayOfYear()) {
      container.className = 'disabled';
    }
    calendarWrapper.appendChild(container);
  });
};

let current = moment();
update(current);

document.querySelector('#previous-month').addEventListener('click', () => {
  current = current.subtract(1, 'month');
  update(current);
});

document.querySelector('#next-month').addEventListener('click', () => {
  current = current.add(1, 'month');
  update(current);
});
