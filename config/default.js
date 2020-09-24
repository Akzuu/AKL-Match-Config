module.exports = {
  port: 3005,
  swagger: {
    host: 'localhost:3005',
    schemes: ['http', 'https'],
  },
  database: {
    mongo: {
      options: {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      },
    },
  },
  routePrefix: '/akl-config',
  fastifyOptions: {
    logger: false,
    ignoreTrailingSlash: true,
  },
};
