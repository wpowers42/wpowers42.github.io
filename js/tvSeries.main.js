'use strict';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
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

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var colorscaleValue = [[0.00, {
  r: 238,
  g: 238,
  b: 238
}], [0.01, {
  r: 210,
  g: 34,
  b: 45
}], [0.40, {
  r: 210,
  g: 34,
  b: 45
}], [0.65, {
  r: 255,
  g: 191,
  b: 0
}], [1.00, {
  r: 35,
  g: 136,
  b: 35
}]];

var numInRange = function numInRange(pct, numStart, numEnd) {
  return numStart - (numStart - numEnd) * pct;
};

var ratingColorScale = function ratingColorScale(colorArr, ratingPct) {
  var low = _toConsumableArray(_toConsumableArray(colorArr).reverse().find(function (color) {
    return color[0] <= ratingPct;
  }));

  var high = _toConsumableArray(colorArr.find(function (color) {
    return color[0] >= ratingPct;
  }));

  return [low, high];
};

var getColor = function getColor(rating) {
  var colorArr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : colorscaleValue;
  var ratingPct = rating / 10;

  var _ratingColorScale = ratingColorScale(colorArr, ratingPct),
      _ratingColorScale2 = _slicedToArray(_ratingColorScale, 2),
      low = _ratingColorScale2[0],
      high = _ratingColorScale2[1];

  var rangePct = (ratingPct - low[0]) / (high[0] - low[0]);
  var color = {};
  ['r', 'g', 'b'].forEach(function (c) {
    var c1 = low[1][c];
    var c2 = high[1][c];
    var c3 = c1 === c2 ? c1 : numInRange(rangePct, c1, c2);
    color[c] = c3;
  });
  return color;
};

var createEpisodeDetail = function createEpisodeDetail(episode) {
  // container
  var episodeDetail = document.createElement('div');
  episodeDetail.className = 'episode-detail'; // Season and Episode

  var seasonEpisode = document.createElement('div');
  seasonEpisode.textContent = "S".concat(episode.season_number, " E").concat(episode.episode_number);
  seasonEpisode.className = 'episode-detail-season-episode'; // Title and Year

  var titleYear = document.createElement('div');
  titleYear.textContent = "".concat(episode.primary_title, " (").concat(episode.start_year, ")");
  titleYear.className = 'episode-detail-title-year'; // Rating and Votes

  var ratingVotes = document.createElement('div');
  ratingVotes.textContent = "".concat(episode.average_rating, "/10 (").concat(episode.number_votes, " votes)");
  ratingVotes.className = 'episode-detail-rating-votes'; // parent_tconst
  // tconst
  // appends

  episodeDetail.append(seasonEpisode);
  episodeDetail.append(titleYear);
  episodeDetail.append(ratingVotes); // return

  return episodeDetail;
};

var createLabels = function createLabels(labels, grid, type) {
  labels.forEach(function (label) {
    var labelCell = document.createElement('div');
    labelCell.className = "label-".concat(type);
    labelCell.textContent = label;
    labelCell.style['grid-column'] = type === 'row' ? 1 : 1 + label;
    labelCell.style['grid-row'] = type === 'row' ? labels.length + 1 - label : -2;
    grid.append(labelCell);
  });
};

var createGrid = function createGrid(data) {
  var gridContainer = document.querySelector('#heatmap-grid-container');
  gridContainer.innerHTML = '';
  var grid = document.createElement('div');
  grid.className = 'heatmap-grid';
  var columns = Math.max.apply(Math, _toConsumableArray(data.map(function (o) {
    return o.season_number;
  }))) + 1;
  var rows = Math.max.apply(Math, _toConsumableArray(data.map(function (o) {
    return o.episode_number;
  }))) + 1;
  var maxColumnWidth = 100;
  var maxWidth = columns * maxColumnWidth;
  var maxRowHeight = 100;
  var maxHeight = rows * maxRowHeight;
  var gridCss = {
    width: "".concat(maxWidth, "px"),
    'max-width': '90%',
    height: "".concat(maxHeight, "px"),
    'max-height': '70vh',
    'grid-template-columns': "20px repeat(".concat(columns, ", ").concat(100 / (columns - 1), "%)"),
    'grid-template-rows': "repeat(".concat(rows, ", ").concat(100 / rows, "%)")
  };
  Object.keys(gridCss).forEach(function (style) {
    grid.style[style] = gridCss[style];
  });

  var columnLabels = _toConsumableArray(Array(columns - 1).keys()).map(function (i) {
    return i + 1;
  });

  var rowLabels = _toConsumableArray(Array(rows - 1).keys()).map(function (i) {
    return i + 1;
  });

  createLabels(columnLabels, grid, 'column');
  createLabels(rowLabels, grid, 'row');
  data.forEach(function (episode) {
    if (!episode.season_number || !episode.episode_number) return;
    var episodeCell = document.createElement('div');
    episodeCell.className = 'episode-cell';
    episodeCell.setAttribute('data-tconst', episode.tconst);
    episodeCell.setAttribute('data-title', episode.primary_title);
    episodeCell.setAttribute('data-year', episode.start_year);
    episodeCell.setAttribute('data-season', episode.season_number);
    episodeCell.setAttribute('data-episode', episode.episode_number);
    episodeCell.setAttribute('data-rating', episode.average_rating);
    episodeCell.setAttribute('data-votes', episode.number_votes);
    var episodeDetail = createEpisodeDetail(episode);
    var tooltipPosition = episode.season_number / columns > 0.50 ? 'left' : 'right';
    episodeDetail.classList.add("tooltip-".concat(tooltipPosition));
    var rgb = getColor(episode.average_rating);
    var episodeCss = {
      'grid-column': episode.season_number + 1,
      'grid-row': -episode.episode_number + rows,
      'background-color': "rgb(".concat(rgb.r, ",").concat(rgb.g, ",").concat(rgb.b, ")")
    };
    Object.keys(episodeCss).forEach(function (style) {
      episodeCell.style[style] = episodeCss[style];
    }); // episodeCell.append(episodeDetail);

    grid.append(episodeCell);
  });
  gridContainer.append(grid);
};

var getEpisodes = function getEpisodes() {
  var tconst = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'tt0944947';
  var url = "https://willp.herokuapp.com/tv-series/".concat(tconst);
  fetch(url).then(function (data) {
    return data.json();
  }).then(function (episodes) {
    createGrid(episodes);
  });
};

/* eslint-disable no-param-reassign */
var updateSuggestions = function updateSuggestions(container, fuzzyhound, input) {
  var results = fuzzyhound.search(input.value);
  var frag = document.createDocumentFragment();

  if (results.length) {
    container.classList.add('active');
  }

  results.forEach(function (result) {
    var resultContainer = document.createElement('div');
    resultContainer.className = 'result-container';
    resultContainer.setAttribute('data-tconst', result.tconst);
    resultContainer.setAttribute('data-title', result.title);
    var titleContainer = document.createElement('div');
    titleContainer.className = 'title-container';
    titleContainer.innerHTML = fuzzyhound.highlight(result.title, 'title');
    var yearsContainer = document.createElement('div');
    yearsContainer.className = 'years-container';
    yearsContainer.innerText = result.years;
    resultContainer.append(titleContainer);
    resultContainer.append(yearsContainer);
    frag.appendChild(resultContainer);
  });
  container.innerHTML = '';
  container.appendChild(frag);
};

var Suggestions = /*#__PURE__*/function () {
  // pass in the search input box and suggestions div
  function Suggestions(input, container) {
    _classCallCheck(this, Suggestions);

    this.input = input;
    this.query = null;
    this.selection = 0;
    this.container = container; // eslint-disable-next-line no-undef

    this.fuzzyhound = new FuzzySearch({
      output_limit: 6,
      output_map: 'alias'
    }); // load the tv series data

    this.seriesData();
  } // get the tv series json and load into fuzzyhound


  _createClass(Suggestions, [{
    key: "seriesData",
    value: function seriesData() {
      var _this = this;

      fetch('https://raw.githubusercontent.com/wpowers42/wpowers42.github.io/main/json/series.json').then(function (res) {
        return res.json();
      }).then(function (data) {
        _this.fuzzyhound.setOptions({
          source: data,
          keys: {
            title: 'title'
          },
          output_map: 'item',
          token_field_min_length: 2
        });
      });
    }
  }, {
    key: "highlightSelection",
    value: function highlightSelection(priorSelection) {
      var explicit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      // get result elements
      var results = Array.from(this.container.children); // if the last selection wasn't input field, remove selected

      if (priorSelection !== 0) {
        results[priorSelection - 1].classList.remove('selected');
      } else {
        this.query = this.input.value; // save to restore query later
      } // if new selection isn't input field, add selected class


      if (this.selection !== 0) {
        var selection = results[this.selection - 1];
        selection.classList.add('selected');
        if (!explicit) this.input.value = selection.getAttribute('data-title');
      } else {
        this.input.value = this.query; // restore query
      }
    }
  }, {
    key: "updateSelection",
    value: function updateSelection(direction) {
      var explicit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      if (!direction && typeof direction === 'number') return; // add rule to return if not results available

      var priorSelection = this.selection;
      this.selection += direction;

      if (this.selection < 0) {
        this.selection = this.fuzzyhound.results.length;
      } else if (this.selection > this.fuzzyhound.results.length) {
        this.selection = 0;
      }

      if (explicit) {
        this.selection = explicit;
      }

      this.highlightSelection(priorSelection, explicit);
    }
  }, {
    key: "update",
    value: function update() {
      this.selection = 0;
      updateSuggestions(this.container, this.fuzzyhound, this.input);
    }
  }, {
    key: "submit",
    value: function submit() {
      var selected = document.querySelector('.selected');
      var tconst = selected.getAttribute('data-tconst');
      var title = selected.getAttribute('data-title');
      this.input.value = title;
      this.container.classList.remove('active');
      this.container.innerHTML = '';
      this.container.blur();
      getEpisodes(tconst);
    }
  }]);

  return Suggestions;
}();

var createEpisodeDetail$1 = function createEpisodeDetail(dataset) {
  // container
  var episodeDetail = document.createElement('div');
  episodeDetail.className = 'episode-detail'; // Season and Episode

  var seasonEpisode = document.createElement('div');
  seasonEpisode.textContent = "S".concat(dataset.season, " E").concat(dataset.episode);
  seasonEpisode.className = 'episode-detail-season-episode'; // Title and Year

  var titleYear = document.createElement('div');
  titleYear.textContent = "".concat(dataset.title, " (").concat(dataset.year, ")");
  titleYear.className = 'episode-detail-title-year'; // Rating and Votes

  var ratingVotes = document.createElement('div');
  ratingVotes.textContent = "".concat(dataset.rating, "/10 (").concat(dataset.votes, " votes)");
  ratingVotes.className = 'episode-detail-rating-votes'; // appends

  episodeDetail.append(seasonEpisode);
  episodeDetail.append(titleYear);
  episodeDetail.append(ratingVotes);
  return episodeDetail;
};

// credit to Timothy Huang for this regex test:
// https://dev.to/timhuang/a-simple-way-to-detect-if-browser-is-on-a-mobile-device-with-javascript-44j3
var isMobile = function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

var registerFocus = function registerFocus(suggestions) {
  suggestions.input.addEventListener('focusin', function () {
    suggestions.input.select();
  });
};

var registerInput = function registerInput(suggestions) {
  suggestions.input.addEventListener('input', function (event) {
    var value = event.target.value;
    suggestions.update(value);
  });
};

var registerKeyDown = function registerKeyDown(suggestions, submit) {
  window.addEventListener('keydown', function (event) {
    if (event.code === 'Enter') {
      submit();
    }

    if (event.code === 'ArrowUp') {
      suggestions.updateSelection(-1);
    }

    if (event.code === 'ArrowDown') {
      suggestions.updateSelection(1);
    }
  });
};

var registerClickContainer = function registerClickContainer(container, submit) {
  container.addEventListener('click', function () {
    submit();
  });
};

var registerClickGrid = function registerClickGrid() {
  if (isMobile()) return;
  var gridContainer = document.querySelector('#heatmap-grid-container');
  gridContainer.addEventListener('click', function (event) {
    var url = 'https://www.imdb.com/title/';
    var parentOne = event.target.parentElement;
    var parentTwo = parentOne.parentElement;

    if (event.target.classList.contains('episode-cell')) {
      window.open("".concat(url).concat(event.target.getAttribute('data-tconst')), '_blank');
    } else if (parentOne.classList.contains('episode-cell')) {
      window.open("".concat(url).concat(parentOne.getAttribute('data-tconst')), '_blank');
    } else if (parentTwo.classList.contains('episode-cell')) {
      window.open("".concat(url).concat(parentTwo.getAttribute('data-tconst')), '_blank');
    }
  });
};

var registerHoverContainer = function registerHoverContainer(container, suggestions) {
  container.addEventListener('mouseover', function (event) {
    var target = event.target;
    if (target === event.currentTarget) return;

    while (!target.classList.contains('result-container') && target) {
      target = target.parentElement;
    }

    var i = 0;
    var _target = target,
        previousSibling = _target.previousSibling;

    while (previousSibling !== null) {
      i += 1;
      previousSibling = previousSibling.previousSibling;
    }

    suggestions.updateSelection(null, i + 1);
  });
};

var registerHoverGrid = function registerHoverGrid() {
  // tooltip should be centered, just above target div
  // if touching edge of screen, flip to other edge.
  var episodeInfo = document.querySelector('#episode-info');
  var gridContainer = document.querySelector('#heatmap-grid-container');
  gridContainer.addEventListener('mouseover', function (event) {
    if (!event.target.classList.contains('episode-cell')) return;
    var w = event.target.offsetWidth;
    var l = event.target.offsetLeft;
    var h = event.target.offsetHeight;
    var t = event.target.offsetTop;
    var x = l + w / 2;
    var y = t - episodeInfo.offsetHeight;
    episodeInfo.classList.add('fixed-block');
    episodeInfo.style.top = "".concat(y, "px");
    episodeInfo.style.left = "".concat(x, "px");
    episodeInfo.innerHTML = '';
    episodeInfo.append(createEpisodeDetail$1(event.target.dataset)); // episodeInfo.textContent = event.target.getAttribute('data-title');
  }); // the xy coordinates reset to some position when non-mouseover, seems ok

  gridContainer.addEventListener('mouseleave', function () {
    episodeInfo.classList.remove('fixed-block');
  });
};

var suggestions = new Suggestions(document.querySelector('#search-input'), document.querySelector('.search-suggestions'));
registerClickGrid();
registerFocus(suggestions);
registerInput(suggestions);
registerKeyDown(suggestions, function () {
  return suggestions.submit();
});
registerClickContainer(suggestions.container, function () {
  return suggestions.submit();
});
registerHoverContainer(suggestions.container, suggestions);
registerHoverGrid();
