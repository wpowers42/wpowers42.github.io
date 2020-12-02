// ---
// ---

(function () {
    const searchBox = document.querySelector('.search-box');
    searchBox.addEventListener('keyup', function (event) {
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            const query = event.target.value.toLowerCase();
            getRhymes(query)

        }
    })

    const getRhymes = query => {
        const movieListUrl = 'https://willp.herokuapp.com/movies'
        // const rhymeUrl = `https://rhymebrain.com/talk?function=getRhymes&word=${query}&next=&function=getWordInfo&word=${query}`;
        const rhymeUrl = `https://willp.herokuapp.com/rhymes/${query}`
        // const minScore = 225;
        // const minFreq = 20;
        const minLength = 4;

        // TODO: fix
        const syllables = 10;

        fetch(rhymeUrl)
            .then(res => res.json())
            // .then(([rhymesDicts, syllables]) => {
            .then(data => {
                const rhymeBlacklist = ['part'];
                const rhymes = data.filter(rhyme => {
                    return (rhyme.word.length >= minLength
                        && !rhymeBlacklist.includes(rhyme.word.toLowerCase()));
                });
                const sortedRhymes = rhymes.sort((a, b) => {
                    if (a.syllables == syllables && b.syllables == syllables) {
                        // if both rhymes have same number of syllables as query, sort by length desc
                        if (a.word.length > b.word.length) {
                            return -1
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
                        // if syllables are the same, sort by length
                        if (a.word.length > b.word.length) {
                            return -1
                        } else if (a.word.length < b.word.length) {
                            return 1;
                        } else {
                            return 0;
                        }
                    } else {
                        return a.syllables - b.syllables
                    }

                });
                const rhymeList = sortedRhymes.map(r => r.word.toLowerCase());
                const movieFullUrl = movieListUrl + `?queries=${rhymeList.join(',')}`;
                const movieShortenedUrl = movieFullUrl.substring(0, 2048)
                const movieUrl = movieShortenedUrl.substring(0, movieShortenedUrl.lastIndexOf(','));
                // 2048
                fetch(movieUrl)
                    .then(res => res.json())
                    .then(movies => {
                        const matchingMovies = [];
                        movies.forEach(movie => {
                            const lower = movie.title.toLowerCase();
                            if (lower.includes(query)) return;
                            let rhymeFound = false;
                            sortedRhymes.forEach(rhyme => {
                                if (lower.includes(rhyme.word) && !rhymeFound) {
                                    const editedTitle = lower.replace(rhyme.word, query)
                                        .split(' ').map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
                                        .join(' ');
                                    matchingMovies.push({
                                        title: movie.title,
                                        editedTitle,
                                        votes: movie.votes,
                                        rhyme
                                    });
                                    rhymeFound = true;
                                }
                            });
                        });
                        const sortedMovies = matchingMovies.sort((a, b) => {
                            return b.votes - a.votes;
                            // if (b.rhyme.score = a.rhyme.score) {
                            //     return b.votes - a.votes;
                            // } else {
                            //     return b.rhyme.score - a.rhyme.score
                            // }
                        });
                        console.log(sortedMovies);
                        const searchResults = document.querySelector('.search-results');
                        searchResults.addEventListener('click', function (event) {
                            if (event.target.className === 'movie-container') {
                                event.target.classList.toggle('favorite');
                            }
                            else if (event.target.className === 'movie-edited-title') {
                                event.target.parentElement.classList.toggle('favorite');
                            }
                        })
                        searchResults.innerHTML = '';
                        const noResults = document.querySelectorAll('.movie-no-results');
                        Array.from(noResults).forEach((div) => div.remove());
                        if (!sortedMovies.length) {
                            const body = document.querySelector('body');
                            const noResults = document.createElement('div');
                            noResults.className = 'movie-no-results';
                            noResults.textContent = 'No Results :(';
                            body.append(noResults);
                        } else {
                            const frag = document.createDocumentFragment();
                            sortedMovies.forEach(movie => {
                                const movieContainer = document.createElement('div');
                                movieContainer.className = 'movie-container';
                                const editedTitle = document.createElement('div');
                                editedTitle.className = 'movie-edited-title';
                                editedTitle.textContent = movie.editedTitle;
                                movieContainer.append(editedTitle);
                                frag.appendChild(movieContainer);
                            })
                            searchResults.appendChild(frag.cloneNode(true))
                        }
                    })
            })
    }

})();