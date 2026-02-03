import vuetify from "./vuetify";
import router from "./router";

export /**
 * registerPlugins - TODO: Добавить описание функции
 * @param {any} app - Описание параметра app

 * @returns {any} TODO: Описать возвращаемое значение
 */
function registerPlugins(app) {
  app.use(vuetify);
  app.use(router);
}
