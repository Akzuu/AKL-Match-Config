const { log, writeConfigFile } = require('../../lib');
const { MatchConfig } = require('../../models');

const schema = {
  description: 'Get match config for server get5 bot',
  summary: 'Get match config',
  tags: ['Service'],
  params: {
    type: 'object',
    properties: {
      server: {
        type: 'string',
      },
    },
  },
};

const handler = async (req, reply) => {
  const startTime = new Date();
  const endStartTime = new Date();
  endStartTime.setHours(endStartTime.getHours() + 3);

  let matchConfig;
  try {
    matchConfig = await MatchConfig.findOneAndUpdate({
      server: req.params.server,
      'matchDate.startTime': {
        $gte: startTime,
        $lte: endStartTime,
      },
    }, {
      matchServed: true,
    });
  } catch (error) {
    log.error('Error when trying to find config! ', error);
    reply.status(500).send({
      status: 'ERROR',
      error: 'Internal Server Error',
    });
    return;
  }

  if (!matchConfig) {
    // Serve practice
    reply.sendFile('practice.json');
    return;
  }

  let filename;
  try {
    filename = await writeConfigFile(matchConfig);
  } catch (error) {
    log.error('Error when trying to write config file! ', error);
    reply.status(500).send({
      status: 'ERROR',
      error: 'Internal Server Error',
    });
    return;
  }

  reply.sendFile(filename);
};

module.exports = async function (fastify) {
  fastify.route({
    method: 'GET',
    url: '/config/:server',
    handler,
    schema,
  });
};
