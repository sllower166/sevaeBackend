const router = require("express").Router();
const { check } = require("express-validator");
const {
  verParametrosIE,
  editarParametrosIE,
  setearParametrosIE,
} = require("../controllers/schoolParams"); // Asegúrate de importar los controladores correctos
const { checkFields } = require("../middleware/check_fields");
const { checkJWT } = require("../middleware/check_jwt");

/**
 * @swagger
 * /schoolparams:
 *   get:
 *     summary: Ver los parámetros de la Institución Educativa.
 *     tags:
 *       - Institución Educativa
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Parámetros de la IE obtenidos exitosamente.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error del servidor.
 */
router.get("/", [checkJWT], verParametrosIE);

/**
 * @swagger
 * /schoolparams:
 *   put:
 *     summary: Editar los parámetros de la Institución Educativa.
 *     tags:
 *       - Institución Educativa
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombreIE:
 *                 type: string
 *                 description: Nombre de la Institución Educativa.
 *               horaIngreso:
 *                 type: string
 *                 description: Hora de ingreso.
 *               horaSalida:
 *                 type: string
 *                 description: Hora de salida.
 *     responses:
 *       200:
 *         description: Parámetros de la IE editados exitosamente.
 *       400:
 *         description: Nombre de IE, hora de ingreso y hora de salida son requeridos.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error del servidor.
 */
router.put(
  "/",
  [checkJWT],
  [
    check("nombreIE", "Nombre de IE es requerido").notEmpty(),
    check("horaIngreso", "Hora de ingreso es requerida").notEmpty(),
    check("horaSalida", "Hora de salida es requerida").notEmpty(),
    checkFields,
  ],
  editarParametrosIE
);

/**
 * @swagger
 * /schoolparams:
 *   post:
 *     summary: Establecer los parámetros de la Institución Educativa.
 *     tags:
 *       - Institución Educativa
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombreIE:
 *                 type: string
 *                 description: Nombre de la Institución Educativa.
 *               horaIngreso:
 *                 type: string
 *                 description: Hora de ingreso.
 *               horaSalida:
 *                 type: string
 *                 description: Hora de salida.
 *     responses:
 *       200:
 *         description: Parámetros de la IE establecidos exitosamente.
 *       400:
 *         description: Nombre de IE, hora de ingreso y hora de salida son requeridos.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error del servidor.
 */

router.post(
  "/",
  [checkJWT],
  [
    check("nombreIE", "Nombre de IE es requerido").notEmpty(),
    check("horaIngreso", "Hora de ingreso es requerida").notEmpty(),
    check("horaSalida", "Hora de salida es requerida").notEmpty(),
    checkFields,
  ],
  setearParametrosIE
);

module.exports = router;
