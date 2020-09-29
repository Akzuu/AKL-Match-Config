const moment = require('moment');
const { log } = require('../../lib');
const { MatchConfig } = require('../../models');

const schema = {
  description: 'Check if server has match going on (by schedule)',
  summary: 'Check if there is match going on',
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
    reply.send(false);
    return;
  }

  const currentTime = moment();
  const currentTimePlusOneHour = moment().add(15, 'minutes');

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
    reply.send(false);
    return;
  }

  reply.send(true);
};

module.exports = async function (fastify) {
  fastify.route({
    method: 'GET',
    url: '/:server/runningMatch',
    handler,
    schema,
  });
};
