const config = require('config');
const path = require('path');

const fastify = require('fastify');
const fastifySwagger = require('fastify-swagger');
const fastifyHelmet = require('fastify-helmet');
const fastifyStatic = require('fastify-static');
const routes = require('./routes');

const APPLICATION_PORT = config.get('port');
const ROUTE_PREFIX = config.get('routePrefix');
const FASTIFY_OPTIONS = config.get('fastifyOptions');

// Initialize swagger
const initSwagger = () => {
  const swaggerOptions = config.get('swagger');

  return {
    routePrefix: `${ROUTE_PREFIX}/documentation`,
    swagger: {
      info: {
        title: 'Project AKLL 2020 Web Backend - Match Config Service',
        description: 'Project AKLL 2020 Web Backend - Match Config Service',
        version: '1.0.0',
      },
      host: swaggerOptions.host,
      schemes: swaggerOptions.schemes,
      securityDefinitions: {
        bearerAuth: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
        },
      },
      security: [{
        bearerAuth: [],
      }],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [{
        name: 'Service',
        description: 'Receive / send configs',
      }, {
        name: 'Utility',
        description: 'Utility endpoints',
      },
      ],
    },
    exposeRoute: true,
  };
};

// Routes
const serviceRoutes = async (server) => {
  Object.keys(routes.service).forEach((key) => {
    routes.service[key](server);
  });
};

const utilityRoute = async (server) => {
  Object.keys(routes.utility).forEach((key) => {
    routes.utility[key](server);
  });
};

/**
 * Init server
 * @param {Object} options Optional.
 */
const initServer = async () => {
  const server = fastify({
    logger: FASTIFY_OPTIONS.logger,
    ignoreTrailingSlash: FASTIFY_OPTIONS.ignoreTrailingSlash,
    ajv: {
      customOptions: {
        removeAdditional: 'all', // Remove additional params from the body etc
      },
    },
  });

  // Register plugins and routes
  server
    .register(fastifySwagger, initSwagger())
    .register(fastifyHelmet, {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ['\'self\''],
          styleSrc: ['\'self\'', '\'unsafe-inline\''],
          imgSrc: ['\'self\'', 'data:', 'validator.swagger.io'],
          scriptSrc: ['\'self\'', 'https: \'unsafe-inline\''],
        },
      },
    })
    .register(fastifyStatic, {
      root: path.join(__dirname, 'server-configs'),
    })
    .register(serviceRoutes, { prefix: `${ROUTE_PREFIX}/service` })
    .register(utilityRoute, { prefix: `${ROUTE_PREFIX}/utility` });

  return {
    start: async () => {
      await server.listen(APPLICATION_PORT, '0.0.0.0');
      return server;
    },
  };
};

module.exports = {
  initServer,
};
