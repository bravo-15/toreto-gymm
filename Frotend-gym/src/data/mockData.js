export const clientes = [
  { id: 1, nombre: "Carlos Ramos", dni: "74859621", celular: "987654321", estado: "Activo" },
  { id: 2, nombre: "Lucía Torres", dni: "70521478", celular: "965874123", estado: "Activo" },
  { id: 3, nombre: "Miguel Peña", dni: "73698541", celular: "912345678", estado: "Inactivo" },
];

export const membresias = [
  { id: 1, nombre: "Plan Mensual", precio: "S/ 80.00", duracion: "30 días", estado: "Activo" },
  { id: 2, nombre: "Plan Trimestral", precio: "S/ 210.00", duracion: "90 días", estado: "Activo" },
  { id: 3, nombre: "Plan Premium", precio: "S/ 120.00", duracion: "30 días", estado: "Activo" },
];

export const pagos = [
  { id: 1, cliente: "Carlos Ramos", monto: "S/ 80.00", metodo: "Yape", fecha: "2026-05-22", estado: "Pagado" },
  { id: 2, cliente: "Lucía Torres", monto: "S/ 120.00", metodo: "Efectivo", fecha: "2026-05-21", estado: "Pagado" },
  { id: 3, cliente: "Miguel Peña", monto: "S/ 80.00", metodo: "Plin", fecha: "2026-05-20", estado: "Pendiente" },
];

export const asistencias = [
  { id: 1, cliente: "Carlos Ramos", fecha: "2026-05-22", hora: "07:30", estado: "Válido" },
  { id: 2, cliente: "Lucía Torres", fecha: "2026-05-22", hora: "18:10", estado: "Válido" },
  { id: 3, cliente: "Miguel Peña", fecha: "2026-05-22", hora: "19:25", estado: "Denegado" },
];
