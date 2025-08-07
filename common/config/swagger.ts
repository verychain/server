import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "VeryPool API",
      version: "1.0.0",
      description: "VeryPool API 문서",
      contact: {
        name: "VeryPool Team",
        url: "https://github.com/verychain/server",
      },
    },
    servers: [
      {
        url: "https://your-production-domain.com/api",
        description: "Production server",
      },
      {
        url: "http://localhost:3000/api",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./router/*.ts", "./domain/*/controller/*.ts", "./common/model/*.ts"],
};

export const specs = swaggerJsdoc(options);
