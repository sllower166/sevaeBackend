const router = require("express").Router();
const { check } = require("express-validator");
const { checkFields } = require("../middleware/check_fields");
const { checkJWT } = require("../middleware/check_jwt");
const {
  crearEstudiante,
  editarEstudiante,
  eliminarEstudiante,
  consultarEstudiantes,
  crearCarnetEstudiante,
  accesoManualEstudiante,
} = require("../controllers/estudiante"); // Asegúrate de importar los controladores adecuados

/**
 * @swagger
 * tags:
 *   name: Estudiantes
 *   description: administración de Estudiantes
 */

// Ruta para crear un estudiante
/**
 * @swagger
 * /estudiantes/crear:
 *   post:
 *     summary: Crea un nuevo estudiante.
 *     tags:
 *       - Estudiantes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *     responses:
 *       201:
 *         description: Estudiante creado exitosamente.
 *       400:
 *         description: Datos de entrada no válidos.
 */
router.post(
  "/crear",
  [
    check("nombre", "El nombre es requerido").notEmpty(),
    check("apellidos", "Los apellidos son requeridos").notEmpty(),
    check("NUIP", "El NUIP es requerido").notEmpty(),
    check("grado", "El grado es requerido").notEmpty(),
  ],
  checkFields,
  [checkJWT],
  crearEstudiante
);

// Ruta para editar un estudiante
/**
 * @swagger
 * /estudiantes/editar/{id}:
 *   put:
 *     summary: Edita un estudiante existente por ID.
 *     tags:
 *       - Estudiantes
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del estudiante a editar.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:

 *     responses:
 *       200:
 *         description: Estudiante editado exitosamente.
 *       404:
 *         description: Estudiante no encontrado.
 */
router.put(
  "/editar/:id",
  [
    check("nombre", "El nombre es requerido").notEmpty(),
    check("apellidos", "Los apellidos son requeridos").notEmpty(),
    check("NUIP", "El NUIP es requerido").notEmpty(),
    check("grado", "El grado es requerido").notEmpty(),
  ],
  checkFields,
  [checkJWT],
  editarEstudiante
);

// Ruta para eliminar un estudiante
/**
 * @swagger
 * /estudiantes/eliminar/{id}:
 *   delete:
 *     summary: Elimina un estudiante existente por ID.
 *     tags:
 *       - Estudiantes
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del estudiante a eliminar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Estudiante eliminado exitosamente.
 *       404:
 *         description: Estudiante no encontrado.
 */
router.delete("/eliminar/:id", [checkJWT], eliminarEstudiante);

// Ruta para consultar estudiantes (GET)
/**
 * @swagger
 * /estudiantes/consultar:
 *   get:
 *     summary: Consulta todos los estudiantes.
 *     tags:
 *       - Estudiantes
 *     responses:
 *       200:
 *         description: Consulta exitosa.
 *         content:
 *           application/json:
 *             example:
 *               ok: true
 *               estudiantes:
 *                 - nombre: Juan
 *                   apellidos: Perez
 *                   NUIP: 123456789
 *                   grado: 11
 *                 - nombre: María
 *                   apellidos: López
 *                   NUIP: 987654321
 *                   grado: 10
 *       500:
 *         description: Error del servidor.
 */

router.get("/consultar", [checkJWT], consultarEstudiantes);

// Ruta para crear un carné de estudiante por ID
/**
 * @swagger
 * /estudiantes/crear-carnet:
 *   post:
 *     summary: Crea un carné para un estudiante específico.
 *     tags:
 *       - Estudiantes
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del estudiante para el cual se creará el carné.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Carné creado exitosamente.
 *       401:
 *         description: No autorizado.
 *       404:
 *         description: Estudiante no encontrado.
 *       500:
 *         description: Error del servidor.
 */
router.post("/crear-carnet", [checkJWT], crearCarnetEstudiante);

/**
 * @swagger
 * /estudiantes/acceso-manual:
 *   post:
 *     summary: Acceso manual para un estudiante específico.
 *     tags:
 *       - Estudiantes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estudianteId:
 *                 type: string
 *                 description: ID del estudiante.
 *               tipoAcceso:
 *                 type: string
 *                 description: Tipo de acceso (entrada/salida).
 *               motivo:
 *                 type: string
 *                 description: Motivo del acceso manual (opcional).
 *               usuarioID:
 *                 type: string
 *                 description: ID del usuario que realiza el acceso.
 *     responses:
 *       200:
 *         description: Acceso manual realizado exitosamente.
 *       400:
 *         description: ID del estudiante y tipo de acceso son requeridos.
 *       404:
 *         description: Estudiante no encontrado.
 *       500:
 *         description: Error del servidor.
 */

router.post(
  "/ingreso-manual",
  [checkJWT],
  [
    check("estudianteId", "ID del estudiante es requerido").notEmpty(),
    check("tipoAcceso", "Tipo de acceso es requerido").notEmpty(),
    checkFields,
  ],
  accesoManualEstudiante
);

module.exports = router;
