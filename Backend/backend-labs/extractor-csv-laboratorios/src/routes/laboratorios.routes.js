const express = require('express');
const {
  transformLaboratorios,
  statusLaboratorios
} = require('../controllers/laboratorios.controller');

const router = express.Router();

router.post('/transform', transformLaboratorios);
router.get('/status', statusLaboratorios);

module.exports = router;
