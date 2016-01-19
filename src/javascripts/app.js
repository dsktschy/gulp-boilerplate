import componentA from './component-a';
import componentB from './component-b';

const
  name = 'app',
  html = `<div id="${name}" class="${name}"></div>`,
  elCache = {},

  setElCache = () => {
    elCache.self = document.getElementById(`${name}`);
  },

  init = (wrapper) => {
    wrapper.insertAdjacentHTML('afterbegin', html);
    setElCache();
    componentA.init(elCache.self);
    componentB.init(elCache.self);
  };

export default {
  init
};
