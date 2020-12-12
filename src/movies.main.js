import getRhymes from './movies.api';

(function main() {
  const searchBox = document.querySelector('.search-box');
  searchBox.addEventListener('keyup', (event) => {
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      const query = event.target.value.toLowerCase();
      getRhymes(query);
    }
  });
}());
