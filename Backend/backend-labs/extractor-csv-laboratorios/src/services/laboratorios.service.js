const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..', '..');
const RAW_DIR = path.join(ROOT_DIR, 'data', 'raw');
const CLEAN_DIR = path.join(ROOT_DIR, 'data', 'clean');
const ERROR_DIR = path.join(ROOT_DIR, 'data', 'error');

function ensureDirectories() {
  [RAW_DIR, CLEAN_DIR, ERROR_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

function parseCsv(content) {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return { headers: [], rows: [] };
  }

  const headers = lines[0].split(',').map((header) => header.trim());
  const rows = lines.slice(1).map((line) => {
    const values = line.split(',').map((value) => value.trim());
    const row = {};

    headers.forEach((header, index) => {
      row[header] = values[index] ?? '';
    });

    return row;
  });

  return { headers, rows };
}

function normalizeDocumento(value) {
  return String(value || '').replace(/\D/g, '');
}

function mapLaboratorioRow(row) {
  return {
    numero_documento: normalizeDocumento(row.id_estudiante),
    semestre: Number.parseInt(row.semestre, 10) || null,
    fecha: row.fecha || null,
    hora_entrada: row.hora_entrada || null,
    hora_salida: row.hora_salida || null,
    equipo_utilizado: row.equipo_utilizado ? row.equipo_utilizado.trim().toUpperCase() : null,
    descripcion_equipo: row.descripcion_equipo ? row.descripcion_equipo.trim() : null
  };
}

function toMongoCollectionName(fileBaseName) {
  return fileBaseName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function buildMongoScript(collectionName, docs) {
  const docsAsJs = docs
    .map((doc) => `  ${JSON.stringify(doc, null, 2).replace(/\n/g, '\n  ')}`)
    .join(',\n');

  return `// Generado automaticamente para MongoDB\n` +
    `db.${collectionName}.deleteMany({});\n\n` +
    `db.${collectionName}.insertMany([\n${docsAsJs}\n]);\n`;
}

function cleanCsvContent(rawContent) {
  return rawContent.replace(/"/g, '').replace(/\r\n/g, '\n').trim() + '\n';
}

function processSingleCsvFile(fileName) {
  const inputPath = path.join(RAW_DIR, fileName);
  const baseName = path.parse(fileName).name;
  const cleanCsvName = `${baseName}_clean.csv`;
  const cleanCsvPath = path.join(CLEAN_DIR, cleanCsvName);

  const rawContent = fs.readFileSync(inputPath, 'utf-8');
  const cleanedContent = cleanCsvContent(rawContent);
  fs.writeFileSync(cleanCsvPath, cleanedContent, 'utf-8');

  const { headers, rows } = parseCsv(cleanedContent);
  if (rows.length === 0) {
    throw new Error(`El archivo ${fileName} no contiene filas de datos validas.`);
  }

  const isLaboratorioDataset =
    headers.includes('id_estudiante') &&
    headers.includes('semestre') &&
    headers.includes('fecha') &&
    headers.includes('hora_entrada') &&
    headers.includes('hora_salida') &&
    headers.includes('equipo_utilizado') &&
    headers.includes('descripcion_equipo');

  const mongoDocs = isLaboratorioDataset
    ? rows.map(mapLaboratorioRow)
    : rows;

  const collectionName = isLaboratorioDataset
    ? 'accesos_laboratorio'
    : toMongoCollectionName(baseName);

  const jsonName = `${baseName}_mongo.json`;
  const jsonPath = path.join(CLEAN_DIR, jsonName);
  fs.writeFileSync(jsonPath, JSON.stringify(mongoDocs, null, 2), 'utf-8');

  const insertName = `${baseName}_insert.js`;
  const insertPath = path.join(CLEAN_DIR, insertName);
  fs.writeFileSync(insertPath, buildMongoScript(collectionName, mongoDocs), 'utf-8');

  return {
    input: fileName,
    cleanCsv: cleanCsvName,
    mongoJson: jsonName,
    mongoInsert: insertName,
    totalRows: mongoDocs.length,
    collection: collectionName
  };
}

function transformRawCsvFiles() {
  ensureDirectories();

  const rawCsvFiles = fs
    .readdirSync(RAW_DIR)
    .filter((file) => file.toLowerCase().endsWith('.csv'));

  if (rawCsvFiles.length === 0) {
    throw new Error('No se encontraron archivos CSV en data/raw.');
  }

  const processed = [];

  rawCsvFiles.forEach((fileName) => {
    try {
      const result = processSingleCsvFile(fileName);
      processed.push(result);
    } catch (error) {
      const errorFilePath = path.join(ERROR_DIR, `${path.parse(fileName).name}.error.log`);
      const errorLog = `[${new Date().toISOString()}] ${error.message}\n`;
      fs.writeFileSync(errorFilePath, errorLog, { encoding: 'utf-8', flag: 'a' });
      throw error;
    }
  });

  return processed;
}

function getPipelineStatus() {
  ensureDirectories();

  const rawFiles = fs.readdirSync(RAW_DIR);
  const cleanFiles = fs.readdirSync(CLEAN_DIR);
  const errorFiles = fs.readdirSync(ERROR_DIR);

  return {
    raw: rawFiles.length,
    clean: cleanFiles.length,
    error: errorFiles.length,
    files: {
      raw: rawFiles,
      clean: cleanFiles,
      error: errorFiles
    }
  };
}

module.exports = {
  transformRawCsvFiles,
  getPipelineStatus
};
