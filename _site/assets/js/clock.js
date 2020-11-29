'use strict';

var clockInterval = setInterval(function () {
  clock();
}, 1000);

var clock = function clock() {
  var d = new Date();
  var hours = d.getHours();
  var minutes = d.getMinutes();
  var ampm = hours >= 12 ? 'P' : 'A';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  hours = ('0' + hours).slice(-2); // single digit hours should have leading 0
  minutes = ('0' + minutes).slice(-2); // single digit minutes should have leading 0
  document.getElementById("hours").innerHTML = hours;
  document.querySelector('.ampm-top').innerHTML = ampm;
  document.querySelector('.ampm-bottom').innerHTML = 'M';
  document.getElementById("minutes").innerHTML = minutes;
};

clock();