const crearCrudController = require('./crud.factory');

module.exports = crearCrudController({
  tabla: 'clientes',
  campos: ['nombre', 'dni', 'telefono', 'correo', 'estado']
});
