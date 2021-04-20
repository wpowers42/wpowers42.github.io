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

var getSignColor = function getSignColor(sign) {
  var color1 = 'rgba(195, 169, 255, 0.50)';
  var color2 = 'rgba(133, 208, 175, 0.50)';
  var color3 = 'rgba(85, 189, 202, 0.50)';

  switch (sign) {
    case 'Aries':
      return color1;

    case 'Taurus':
      return color2;

    case 'Gemini':
      return color3;

    case 'Cancer':
      return color1;

    case 'Leo':
      return color2;

    case 'Virgo':
      return color3;

    case 'Libra':
      return color1;

    case 'Scorpio':
      return color2;

    case 'Sagittarius':
      return color3;

    case 'Capricorn':
      return color1;

    case 'Aquarius':
      return color2;

    case 'Pisces':
      return color3;

    default:
      return color1;
  }
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
      sign: getSign(day.add(266, 'days')),
      dueDate: day.add(266, 'days').format('MM/DD/YY')
    };
  });
  return enhancedDays;
};

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
  calendarWrapper.innerHTML = ''; // const firstSign = days.filter((day) => day)[0].sign;

  days.forEach(function (day) {
    var container = document.createElement(day ? 'time' : 'span');
    var number = document.createElement('div');
    number.textContent = day ? moment(day.day).date() : '';
    number.className = 'day-of-month';
    var sign = document.createElement('div');
    sign.textContent = day ? day.sign : '';
    sign.className = 'sign';
    var dueDate = document.createElement('div');
    dueDate.textContent = day ? day.dueDate : '';
    dueDate.className = 'due-date';
    container.appendChild(number);
    container.appendChild(sign);
    container.appendChild(dueDate);

    if (day && moment(day.day).isBefore(moment(), 'day')) {
      container.classList.add('disabled');
    } else if (day) {
      container.style.backgroundColor = getSignColor(day.sign);
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
