const controller = require('../controllers/rutinas.controller');
const crearCrudRoutes = require('./crud.routes');
module.exports = crearCrudRoutes(controller);
