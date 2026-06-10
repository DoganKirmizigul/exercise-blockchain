const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const spec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'NFT Ticketing API', version: '1.0.0' },
  },
  apis: ['./src/presentation/*.routes.js'],
});

module.exports = (app) => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec));
};