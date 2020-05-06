import packageJSON from '../package.json';

module.exports = {
  app: {
    version: packageJSON.version,
    title: 'analytics',
    description: packageJSON.description
  },

  dir_structure: {
    models: 'app/models/**/*.js',
    routes: 'app/routes/**/*Routes.js',
    controllers: 'app/conrollers/**/*Controller.js'
  },
  constants: {
    DB_URL: "mongodb://localhost:27017/analytics"
  }
};
