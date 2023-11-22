const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  swaggerDefinition: {
    info: {
      title: "sevae Docs",
      version: "1.0.0",
    },
  },
  apis: ["routes/*.js"],
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = function (app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
