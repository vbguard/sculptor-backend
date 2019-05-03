const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Sculptor API",
      version: "1.0.0",
      description: "API for Sculptor, view what routes pass"
    },
    basePath: "/api"
  },
  apis: ["src/routes/routes.js"]
};

const specs = swaggerJsDoc(options);

module.exports = app => {
  app.use("/doc", swaggerUI.serve, swaggerUI.setup(specs));
};
