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
 * tags:
 *   name: ParametrosIE
 *   description: Gestión de parámetros de la Institución Educativa
 */

// Ruta para ver los parámetros de la IE
router.get("/", [checkJWT], verParametrosIE);

// Ruta para editar los parámetros de la IE
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

// Ruta para establecer los parámetros de la IE
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
