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

const getSignColor = (sign) => {
  const color1 = 'rgba(195, 169, 255, 0.50)';
  const color2 = 'rgba(133, 208, 175, 0.50)';
  const color3 = 'rgba(85, 189, 202, 0.50)';

  switch (sign) {
    case 'Aries': return color1;
    case 'Taurus': return color2;
    case 'Gemini': return color3;
    case 'Cancer': return color1;
    case 'Leo': return color2;
    case 'Virgo': return color3;
    case 'Libra': return color1;
    case 'Scorpio': return color2;
    case 'Sagittarius': return color3;
    case 'Capricorn': return color1;
    case 'Aquarius': return color2;
    case 'Pisces': return color3;
    default: return color1;
  }
};

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
    sign: getSign(day.add(266, 'days')),
    dueDate: day.add(266, 'days').format('YYYY-MM-DD'),
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

  // const firstSign = days.filter((day) => day)[0].sign;

  days.forEach((day) => {
    const container = document.createElement(day ? 'time' : 'span');

    const number = document.createElement('div');
    number.textContent = day ? moment(day.day).date() : '';
    number.className = 'day-of-month';

    const sign = document.createElement('div');
    sign.textContent = day ? day.sign : '';
    sign.className = 'sign';

    const dueDate = document.createElement('div');
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
