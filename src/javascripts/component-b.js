const
  name = 'component-b',
  html = `<div id="${name}" class="${name}">${name}</div>`,

  init = (wrapper) => {
    wrapper.insertAdjacentHTML('beforeend', html);
  };

export default {
  init
};
