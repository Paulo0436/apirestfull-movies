const express = require("express");
const YAML = require("yaml");
const fs = require("fs");
const swaggerUi = require("swagger-ui-express");

const router = express.Router();

const file = fs.readFileSync('src/swagger.yaml', 'utf-8');


const swaggerDoc = YAML.parse(file);

// Rota da documentação
router.use("/", swaggerUi.serve);
router.get("/", swaggerUi.setup(swaggerDoc));

module.exports = router;
