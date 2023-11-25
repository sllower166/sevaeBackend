const router = require("express").Router();
const { check } = require("express-validator");
const {
  createDirectivo,
  directivoLogin,
  renewToken,
  resetPassword,
} = require("../controllers/directivo");
const { checkFields } = require("../middleware/check_fields");
const { checkJWT } = require("../middleware/check_jwt");

/**
 * @swagger
 * tags:
 *   name: Directivo
 *   description: administración de Directivo
 */

//Ruta login
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Iniciar sesión de un directivo
 *     tags: [Directivo]
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *
 */
router.post(
  "/login",
  [
    check("usuario", "Usuario es requerido").notEmpty(),
    check(
      "contraseña",
      "La contraseña debe tener al menos 6 caracteres"
    ).isLength({
      min: 6,
    }),
    checkFields,
  ],
  directivoLogin
);

/**
 * @swagger
 * /new:
 *   post:
 *     summary: Crear un nuevo directivo
 *     tags: [Directivo]
 *     description: Crea un nuevo directivo con los siguientes campos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: El nombre del directivo.
 *               usuario:
 *                 type: string
 *                 description: El nombre de usuario del directivo.
 *               contraseña:
 *                 type: string
 *                 description: La contraseña del directivo (debe tener al menos 6 caracteres).
 *               email:
 *                 type: string
 *                 description: El correo electrónico del directivo.
 *     responses:
 *       201:
 *         description: Creación exitosa
 *
 */

router.post(
  "/new",
  [
    check("nombre", "Nombre es requerido").isString(),
    check("usuario", "Usuario es requerido").isString(),
    check(
      "contraseña",
      "La contraseña debe tener al menos 6 caracteres"
    ).isLength({
      min: 6,
    }),
    check("email", "Correo electrónico es requerido").isEmail(),
    checkFields,
  ],
  createDirectivo
);

/**
 * @swagger
 * /renew:
 *   get:
 *     summary: Renovar token web de un directivo
 *     tags: [Directivo]
 *     responses:
 *       200:
 *         description: Token renovado exitosamente
 *
 */
router.get("/renew", renewToken);

/**
 * @swagger
 * /reset-password:
 *   post:
 *     summary: Restablecer la contraseña de un directivo
 *     tags: [Directivo]
 *     responses:
 *       200:
 *         description: Contraseña restablecida exitosamente
 *
 */
router.post("/reset-password", resetPassword);

module.exports = router;
