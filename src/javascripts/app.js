import appComponentA from './app-component-a';
import appComponentB from './app-component-b';

const
  name = 'app',
  html = `<div id="${name}" class="${name}"></div>`,
  elCache = {},

  setElCache = () => {
    elCache.self = document.getElementById(name);
  },

  init = (wrapper) => {
    wrapper.insertAdjacentHTML('afterbegin', html);
    setElCache();
    appComponentA.init(elCache.self);
    appComponentB.init(elCache.self);
  };

export default {
  init
};
