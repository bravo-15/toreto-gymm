const router = require('express').Router();
const dashboardController = require('../controllers/dashboard.controller');

router.get('/resumen', dashboardController.resumen);

module.exports = router;
