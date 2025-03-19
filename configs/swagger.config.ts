const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Skincare API",
      version: "1.0.0",
      description: "API for booking skincare services",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
    },
    servers: [
      {
        url: "http://localhost:8080",
      },
    ],
  },
  apis: ["./controllers/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
