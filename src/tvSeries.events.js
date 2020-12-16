import { createEpisodeDetail } from './tvSeries.episodeDetail';

const registerFocus = (suggestions) => {
  suggestions.input.addEventListener('focusin', () => {
    suggestions.input.select();
  });
};

const registerInput = (suggestions) => {
  suggestions.input.addEventListener('input', (event) => {
    const { value } = event.target;
    suggestions.update(value);
  });
};

const registerKeyDown = (suggestions, submit) => {
  window.addEventListener('keydown', (event) => {
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

const registerClickContainer = (container, submit) => {
  container.addEventListener('click', () => {
    submit();
  });
};

const registerClickGrid = () => {
  const gridContainer = document.querySelector('#heatmap-grid-container');
  gridContainer.addEventListener('click', (event) => {
    const url = 'https://www.imdb.com/title/';
    const parentOne = event.target.parentElement;
    const parentTwo = parentOne.parentElement;
    if (event.target.classList.contains('episode-cell')) {
      window.open(`${url}${event.target.getAttribute('data-tconst')}`, '_blank');
    } else if (parentOne.classList.contains('episode-cell')) {
      window.open(`${url}${parentOne.getAttribute('data-tconst')}`, '_blank');
    } else if (parentTwo.classList.contains('episode-cell')) {
      window.open(`${url}${parentTwo.getAttribute('data-tconst')}`, '_blank');
    }
  });
};

const registerHoverContainer = (container, suggestions) => {
  container.addEventListener('mouseover', (event) => {
    let { target } = event;
    if (target === event.currentTarget) return;
    while (!target.classList.contains('result-container') && target) {
      target = target.parentElement;
    }
    let i = 0;
    let { previousSibling } = target;
    while (previousSibling !== null) {
      i += 1;
      previousSibling = previousSibling.previousSibling;
    }
    suggestions.updateSelection(null, i + 1);
  });
};

const registerHoverGrid = () => {
  // tooltip should be centered, just above target div
  // if touching edge of screen, flip to other edge.
  const episodeInfo = document.querySelector('#episode-info');
  const gridContainer = document.querySelector('#heatmap-grid-container');
  gridContainer.addEventListener('mouseover', (event) => {
    if (!event.target.classList.contains('episode-cell')) return;
    const w = event.target.offsetWidth;
    const l = event.target.offsetLeft;
    const r = l + w;

    const h = event.target.offsetHeight;
    const t = event.target.offsetTop;
    const b = t + h;

    const x = l + w / 2;
    const y = t - episodeInfo.offsetHeight;

    episodeInfo.classList.add('fixed-block');
    episodeInfo.style.top = `${y}px`;
    episodeInfo.style.left = `${x}px`;

    episodeInfo.innerHTML = '';
    episodeInfo.append(createEpisodeDetail(event.target.dataset));

    // episodeInfo.textContent = event.target.getAttribute('data-title');
  });
  // the xy coordinates reset to some position when non-mouseover, seems ok
  gridContainer.addEventListener('mouseleave', () => {
    episodeInfo.classList.remove('fixed-block');
  });
};

export {
  registerFocus, registerInput, registerKeyDown, registerClickContainer,
  registerClickGrid, registerHoverContainer, registerHoverGrid,
};
