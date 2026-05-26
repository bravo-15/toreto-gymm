const crearCrudController = require('./crud.factory');

module.exports = crearCrudController({
  tabla: 'membresias',
  campos: ['nombre', 'duracion', 'precio', 'descripcion', 'estado']
});
