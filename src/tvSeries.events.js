const registerFocus = (suggestions) => {
  suggestions.input.addEventListener('focusin', () => {
    // eslint-disable-next-line no-param-reassign
    suggestions.input.value = '';
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
    if (event.which === 13) {
      submit();
    }
    if (event.which === 40) {
      suggestions.updateSelection(1);
    }
    if (event.which === 38) {
      suggestions.updateSelection(-1);
    }
  });
};

const registerClickContainer = (container, submit) => {
  container.addEventListener('click', () => {
    submit();
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

export {
  registerFocus, registerInput, registerKeyDown, registerClickContainer,
  registerHoverContainer,
};
