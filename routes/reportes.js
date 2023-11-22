const router = require("express").Router();
const { check } = require("express-validator");
const { checkFields } = require("../middleware/check_fields");
const { checkJWT } = require("../middleware/check_jwt");
const { generarReporte } = require("../controllers/reportes");

/**
 * @swagger
 * tags:
 *   name: Reporte
 *   description: Generación de reportes
 */

// Ruta para generar un reporte
/**
 * @swagger
 * /reporte/generar:
 *   post:
 *     summary: Genera un reporte filtrado por fechas y tipo de registro.
 *     tags:
 *       - Reporte
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fechaInicio:
 *                 type: string
 *                 format: date
 *                 description: Fecha de inicio para el filtro.
 *               fechaFin:
 *                 type: string
 *                 format: date
 *                 description: Fecha de fin para el filtro.
 *               selectedType:
 *                 type: string
 *                 description: Tipo de registro para el filtro.
 *     responses:
 *       200:
 *         description: Reporte generado exitosamente.
 *       400:
 *         description: Datos de entrada no válidos.
 *       404:
 *         description: No se encontraron registros para los filtros proporcionados.
 *       500:
 *         description: Error al generar el reporte.
 */
router.post(
  "/generar",
  [
    check("fechaInicio", "Fecha de inicio es requerida").notEmpty(),
    check("fechaFin", "Fecha de fin es requerida").notEmpty(),
    check("selectedType", "Tipo de registro es requerido").notEmpty(),
  ],
  checkFields,
  [checkJWT],
  generarReporte
);

module.exports = router;
