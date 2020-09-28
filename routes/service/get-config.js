const moment = require('moment');
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
  let matchConfigs;
  try {
    matchConfigs = await MatchConfig.find({
      server: req.params.server,
    });
  } catch (error) {
    log.error('Error when trying to find config! ', error);
    reply.status(500).send({
      status: 'ERROR',
      error: 'Internal Server Error',
    });
    return;
  }

  if (!matchConfigs || matchConfigs.length < 1) {
    // Serve practice
    reply.sendFile('practice.json');
    return;
  }

  const currentTime = moment();
  const currentTimePlusOneHour = moment().add(1, 'hours');

  const configToBeServer = matchConfigs.find((matchConfig) => {
    if (currentTime
      .isBetween(matchConfig.matchDate.startTime, matchConfig.matchDate.endTime)
    || currentTimePlusOneHour
      .isBetween(matchConfig.matchDate.startTime, matchConfig.matchDate.endTime)) {
      return matchConfig;
    }
    return undefined;
  });

  if (!configToBeServer) {
    // Serve practice
    reply.sendFile('practice.json');
    return;
  }

  let filename;
  try {
    filename = await writeConfigFile(configToBeServer);
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
