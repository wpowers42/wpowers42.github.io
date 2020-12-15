import Suggestions from './tvSeries.Suggestions';
import {
  registerKeyDown, registerClickContainer, registerHoverContainer, registerInput,
} from './tvSeries.events';

const suggestions = new Suggestions(
  document.querySelector('#search-input'),
  document.querySelector('.search-suggestions'),
);

suggestions.input.addEventListener('focusin', () => {
  suggestions.input.value = '';
});

registerInput(suggestions);
registerKeyDown(suggestions, () => suggestions.submit());
registerClickContainer(suggestions.container, () => suggestions.submit());
registerHoverContainer(suggestions.container, suggestions);
