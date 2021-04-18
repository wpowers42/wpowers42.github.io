'use strict';

// https://www.codewars.com/kata/5a376259b6cfd77ca000006b/solutions/javascript
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

var dates = function dates() {
  var userStart = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var days = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 60;
  var dateArray = [];
  var today = userStart ? moment(userStart) : moment();
  var i = 0;

  do {
    var start = today.clone().add(i, 'days');
    var stop = start.clone().add(266, 'days');
    var obj = {
      start: start.format('YYYY-MM-DD'),
      stop: stop.format('YYYY-MM-DD'),
      sign: getSign(stop)
    };
    dateArray.push(obj);
    i += 1;
  } while (i < days);

  return dateArray;
};

var formatTable = function formatTable(data) {
  var table = document.createElement('table');
  var i = 0;

  do {
    var date = data[i];
    var row = document.createElement('tr');
    var start = document.createElement('td');
    start.innerText = date.start;
    row.appendChild(start);
    var stop = document.createElement('td');
    stop.innerText = date.stop;
    row.appendChild(stop);
    var sign = document.createElement('td');
    sign.innerText = date.sign;
    row.appendChild(sign);
    table.appendChild(row);
    i += 1;
  } while (i < data.length);

  document.querySelector('#table').innerHTML = '';
  document.querySelector('#table').appendChild(table);
};

var updateTable = function updateTable() {
  var date = document.querySelector('#start').value;
  var days = document.querySelector('#days').value;
  formatTable(dates(date, days));
};

document.querySelector('#button').addEventListener('click', updateTable);
updateTable();
