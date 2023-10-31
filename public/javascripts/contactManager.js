import Model from './mvc_modules/model.js';
import View from './mvc_modules/view.js';
import Controller from './mvc_modules/controller.js';

(() => {
  class App {
    init() {
      document.addEventListener('DOMContentLoaded', async () => {
        let controller = new Controller(new Model(), new View());
      });
    }
  }

  const app = new App();
  app.init()
})();