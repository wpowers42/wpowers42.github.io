// https://www.codewars.com/kata/5a376259b6cfd77ca000006b/solutions/javascript
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

const dates = (userStart = null, days = 60) => {
  const dateArray = [];
  const today = userStart ? moment(userStart) : moment();
  let i = 0;
  do {
    const start = today.clone().add(i, 'days');
    const stop = start.clone().add(266, 'days');
    const obj = {
      start: start.format('YYYY-MM-DD'),
      stop: stop.format('YYYY-MM-DD'),
      sign: getSign(stop),
    };
    dateArray.push(obj);
    i += 1;
  } while (i < days);
  return dateArray;
};

const formatTable = (data) => {
  const table = document.createElement('table');
  let i = 0;
  do {
    const date = data[i];
    const row = document.createElement('tr');
    const start = document.createElement('td');
    start.innerText = date.start;
    row.appendChild(start);

    const stop = document.createElement('td');
    stop.innerText = date.stop;
    row.appendChild(stop);

    const sign = document.createElement('td');
    sign.innerText = date.sign;
    row.appendChild(sign);

    table.appendChild(row);
    i += 1;
  } while (i < data.length);
  document.querySelector('#table').innerHTML = '';
  document.querySelector('#table').appendChild(table);
};

const updateTable = () => {
  const date = document.querySelector('#start').value;
  const days = document.querySelector('#days').value;
  formatTable(dates(date, days));
};

document.querySelector('#button').addEventListener('click', updateTable);

updateTable();
