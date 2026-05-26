const crearCrudController = require('./crud.factory');

module.exports = crearCrudController({
  tabla: 'rutinas',
  campos: ['nombre', 'grupo_muscular', 'series', 'repeticiones', 'nivel', 'duracion', 'estado']
});
