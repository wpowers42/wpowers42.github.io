(function () {
  'use strict';

  var clearResults = function clearResults() {
    var searchResults = document.querySelector('.search-results');
    searchResults.innerHTML = '';
    var noResults = document.querySelectorAll('.movie-no-results');
    Array.from(noResults).forEach(function (div) {
      return div.remove();
    });
  };

  var createResults = function createResults(data) {
    var frag = document.createDocumentFragment();

    var sort = function sort(a, b) {
      if (a.votes === b.votes) {
        return b.word.length - a.word.length;
      }

      return b.votes - a.votes;
    };

    var titles = [];

    var filter = function filter(a) {
      if (!titles.includes(a.title)) {
        titles.push(a.title);
        return true;
      }

      return false;
    };

    data.sort(sort).filter(filter).forEach(function (movie) {
      var movieContainer = document.createElement('div');
      movieContainer.className = 'movie-container';
      var editedTitle = document.createElement('div');
      editedTitle.className = 'movie-edited-title';
      editedTitle.textContent = movie.edited_title;
      movieContainer.append(editedTitle);
      frag.appendChild(movieContainer);
    });
    return frag;
  };

  var displayResults = function displayResults(frag) {
    var searchResults = document.querySelector('.search-results');
    searchResults.appendChild(frag.cloneNode(true));
  };

  var displayNoResults = function displayNoResults() {
    var body = document.querySelector('body');
    var noResults = document.createElement('div');
    noResults.className = 'movie-no-results';
    noResults.textContent = 'No Results :(';
    body.append(noResults);
  };

  var createEventListeners = function createEventListeners() {
    var searchResults = document.querySelector('.search-results');
    searchResults.addEventListener('click', function (event) {
      if (event.target.className === 'movie-container') {
        event.target.classList.toggle('favorite');
      } else if (event.target.className === 'movie-edited-title') {
        event.target.parentElement.classList.toggle('favorite');
      }
    });
  };

  var getRhymes = (function (query) {
    var url = "https://willp.herokuapp.com/puns/".concat(query);
    fetch(url).then(function (res) {
      return res.json();
    }).then(function (data) {
      createEventListeners();

      if (!data.length) {
        clearResults();
        displayNoResults();
      } else {
        var results = createResults(data);
        displayResults(results);
      }
    });
  });

  (function main() {
    var searchBox = document.querySelector('.search-box');
    searchBox.addEventListener('keyup', function (event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        var query = event.target.value.toLowerCase();
        getRhymes(query);
      }
    });
  })();

}());
//# sourceMappingURL=index.js.map
