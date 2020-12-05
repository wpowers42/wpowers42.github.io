this.utils = this.utils || {};
this.utils.js = (function (exports) {
  'use strict';

  var sortRhymes = function sortRhymes(rhymes) {
    var syllables = 98;
    return rhymes.sort(function (a, b) {
      if (a.syllables == syllables && b.syllables == syllables) {
        if (a.word.length > b.word.length) {
          return -1;
        } else if (a.word.length < b.word.length) {
          return 1;
        } else {
          return 0;
        }
      } else if (a.syllables == syllables) {
        return -1;
      } else if (b.syllables == syllables) {
        return 1;
      } else if (a.syllables == b.syllables) {
        if (a.word.length > b.word.length) {
          return -1;
        } else if (a.word.length < b.word.length) {
          return 1;
        } else {
          return 0;
        }
      } else {
        return a.syllables - b.syllables;
      }
    });
  };

  var createPuns = function createPuns(movies, query, rhymes) {
    var matchingMovies = [];
    var punsUsed = {};
    movies.forEach(function (movie) {
      var lower = movie.title.toLowerCase();
      if (lower.includes(query)) return;
      rhymes.forEach(function (rhyme) {
        if (lower.includes(rhyme.word)) {
          var editedTitle = lower.replace(rhyme.word, query).split(' ').map(function (w) {
            return w[0].toUpperCase() + w.substr(1).toLowerCase();
          }).join(' ');

          if (editedTitle.length > query.length + 2) {
            if (!(editedTitle in punsUsed)) {
              punsUsed[editedTitle] = 1;
              matchingMovies.push({
                title: movie.title,
                editedTitle,
                votes: movie.votes,
                rhyme
              });
            }
          }
        }
      });
    });
    return matchingMovies;
  };

  exports.createPuns = createPuns;
  exports.sortRhymes = sortRhymes;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

}({}));
//# sourceMappingURL=utils.js.map
