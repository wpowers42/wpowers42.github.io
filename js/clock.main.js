'use strict';

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var updateTimeElements = function updateTimeElements(hours, minutes, ampm) {
  document.getElementById('hours').innerHTML = hours;
  document.querySelector('.ampm-top').innerHTML = ampm;
  document.querySelector('.ampm-bottom').innerHTML = 'M';
  document.getElementById('minutes').innerHTML = minutes;
}; // eslint-disable-next-line import/prefer-default-export


var getTime = function getTime(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'P' : 'A';
  hours %= 12;
  hours = hours || 12; // the hour '0' should be '12'

  hours = "0".concat(hours).slice(-2); // single digit hours should have leading 0

  minutes = "0".concat(minutes).slice(-2); // single digit minutes should have leading 0

  return [hours, minutes, ampm];
};

var clock = function clock() {
  var date = new Date();

  var _getTime = getTime(date),
      _getTime2 = _slicedToArray(_getTime, 3),
      hours = _getTime2[0],
      minutes = _getTime2[1],
      ampm = _getTime2[2];

  updateTimeElements(hours, minutes, ampm);
};

clock();
setInterval(function () {
  clock();
}, 1000);
