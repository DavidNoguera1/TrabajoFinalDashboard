const { transformRawCsvFiles, getPipelineStatus } = require('../services/laboratorios.service');

function transformLaboratorios(req, res) {
  try {
    const result = transformRawCsvFiles();
    return res.json({
      message: 'Transformacion completada correctamente',
      processed: result
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

function statusLaboratorios(req, res) {
  try {
    return res.json(getPipelineStatus());
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  transformLaboratorios,
  statusLaboratorios
};
