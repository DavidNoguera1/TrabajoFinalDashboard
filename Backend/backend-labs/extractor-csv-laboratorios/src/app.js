const express = require('express');
const laboratoriosRoutes = require('./routes/laboratorios.routes');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use('/api/laboratorios', laboratoriosRoutes);

app.listen(PORT, () => {
  console.log(`Extractor CSV Laboratorios running on port ${PORT}`);
});
