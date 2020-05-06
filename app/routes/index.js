import routes from './analyticsRoutes.js';

const initRoutes = (app) => {
  app.use(`/v1`, routes);
};

export default initRoutes;
