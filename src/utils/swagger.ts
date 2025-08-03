import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pet Store API',
      version: '1.0.0',
      description: 'RESTful API for Pet Store',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Pet: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            type: { type: 'string' },
            age: { type: 'integer' },
            breed: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            images: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  url: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['src/**/*.ts', 'src/routes/**/*.ts',],
};
const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
