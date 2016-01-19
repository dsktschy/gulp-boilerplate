const
  name = 'component-a',
  html = `<div id="${name}" class="${name}">${name}</div>`,

  init = (wrapper) => {
    wrapper.insertAdjacentHTML('beforeend', html);
  };

export default {
  init
};
