(function () {
    'use strict';

    (function () {
      var searchBox = document.querySelector('.search-box');
      searchBox.addEventListener('keyup', function (event) {
        if (event.keyCode === 13) {
          event.preventDefault();
          var query = event.target.value.toLowerCase();
          getRhymes(query);
        }
      });

      var getRhymes = function getRhymes(query) {
        var url = "https://willp.herokuapp.com/puns/".concat(query);
        fetch(url).then(function (res) {
          return res.json();
        }).then(function (data) {
          var searchResults = document.querySelector('.search-results');
          searchResults.addEventListener('click', function (event) {
            if (event.target.className === 'movie-container') {
              event.target.classList.toggle('favorite');
            } else if (event.target.className === 'movie-edited-title') {
              event.target.parentElement.classList.toggle('favorite');
            }
          });
          searchResults.innerHTML = '';
          var noResults = document.querySelectorAll('.movie-no-results');
          Array.from(noResults).forEach(function (div) {
            return div.remove();
          });

          if (!data.length) {
            var body = document.querySelector('body');

            var _noResults = document.createElement('div');

            _noResults.className = 'movie-no-results';
            _noResults.textContent = 'No Results :(';
            body.append(_noResults);
          } else {
            var frag = document.createDocumentFragment();

            var sort = function sort(a, b) {
              if (a.votes == b.votes) {
                return b.word.length - a.word.length;
              } else {
                return b.votes - a.votes;
              }
            };

            var titles = [];

            var filter = function filter(a) {
              if (!titles.includes(a.title)) {
                titles.push(a.title);
                return true;
              } else {
                return false;
              }
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
            searchResults.appendChild(frag.cloneNode(true));
          }
        });
      };
    })();

}());
//# sourceMappingURL=movie_puns.js.map
