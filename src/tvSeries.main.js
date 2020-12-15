import Suggestions from './tvSeries.Suggestions';
import {
  registerFocus, registerKeyDown, registerClickContainer, registerHoverContainer,
  registerInput,
} from './tvSeries.events';

const suggestions = new Suggestions(
  document.querySelector('#search-input'),
  document.querySelector('.search-suggestions'),
);

registerFocus(suggestions);
registerInput(suggestions);
registerKeyDown(suggestions, () => suggestions.submit());
registerClickContainer(suggestions.container, () => suggestions.submit());
registerHoverContainer(suggestions.container, suggestions);
