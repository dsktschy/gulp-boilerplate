const
  name = 'app-component-a',
  html = `
    <div id="${name}" class="${name}">
      <h1>${name}</h1>
    </div>
  `,

  init = (wrapper) => {
    wrapper.insertAdjacentHTML('beforeend', html);
  };

export default {
  init
};
