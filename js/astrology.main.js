'use strict';

/* eslint-disable no-undef */
console.log('Credit for zodiac sign: https://www.codewars.com/kata/5a376259b6cfd77ca000006b/solutions/javascript');
console.log('Credit for calendar CSS: https://mathiaspicker.com/CalendarPickerJS/');

var getZodiacSign = function getZodiacSign(day, month) {
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

var getSign = function getSign(dt) {
  return getZodiacSign(dt.date(), dt.month() + 1);
};

var getDaysArrayByMonth = function getDaysArrayByMonth(date) {
  var daysInMonth = moment(date).daysInMonth();
  var arrDays = [];

  while (daysInMonth) {
    var _current = moment(date).date(daysInMonth);

    arrDays.push(_current); // eslint-disable-next-line no-plusplus

    daysInMonth--;
  }

  arrDays.sort(function (a, b) {
    return a.date() - b.date();
  });
  return arrDays;
};

var dates = function dates() {
  var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : moment();
  var arrDays = getDaysArrayByMonth(date);
  var enhancedDays = arrDays.map(function (day) {
    return {
      day: day.format('YYYY-MM-DD'),
      sign: getSign(day.add(266, 'days'))
    };
  });
  return enhancedDays;
}; // TODO: add 266 days
// TODO: fix disabled


var update = function update() {
  var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : moment();
  document.querySelector('#month').innerText = date.format('MMMM - YYYY');
  var days = dates(date);
  var padding = moment(days[0].day).day();

  while (padding > 0) {
    days.unshift(null);
    padding--;
  }

  var calendarWrapper = document.querySelector('#calendar-grid');
  calendarWrapper.innerHTML = '';
  days.forEach(function (day) {
    var container = document.createElement(day ? 'time' : 'span');
    var number = document.createElement('div');
    var sign = document.createElement('div');
    number.textContent = day ? moment(day.day).date() : '';
    sign.textContent = day ? day.sign : '';
    container.appendChild(number);
    container.appendChild(sign);

    if (day && moment(day.day).isBefore(moment(), 'day')) {
      container.className = 'disabled';
    }

    calendarWrapper.appendChild(container);
  });
};

var current = moment();
update(current);
document.querySelector('#previous-month').addEventListener('click', function () {
  current = current.subtract(1, 'month');
  update(current);
});
document.querySelector('#next-month').addEventListener('click', function () {
  current = current.add(1, 'month');
  update(current);
});
