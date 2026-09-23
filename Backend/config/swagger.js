const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "SchemeSetu API",
      version: "1.0.0",
      description:
        "Production API for SchemeSetu scheme discovery, eligibility, authentication, and applications.",
    },

    servers: [
      {
        url: "http://localhost:5001",
        description: "Local development server",
      },
    ],

    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "accessToken",
        },
      },
    },
  },

  apis: [
    "./routes/*.js",
    "./controllers/*.js",
  ],
};

module.exports = swaggerJSDoc(options);