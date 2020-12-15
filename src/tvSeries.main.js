import Suggestions from './tvSeries.Suggestions';
import { registerKeyDown, registerClickContainer, registerHoverContainer } from './tvSeries.events';

const suggestions = new Suggestions(
  document.querySelector('#search-input'),
  document.querySelector('.search-suggestions'),
);

suggestions.input.addEventListener('input', (event) => {
  const { value } = event.target;
  suggestions.update(value);
});

suggestions.input.addEventListener('focusin', () => {
  suggestions.input.value = '';
});

registerKeyDown(suggestions, () => suggestions.submit());
registerClickContainer(suggestions.container, () => suggestions.submit());
registerHoverContainer(suggestions.container, suggestions);
