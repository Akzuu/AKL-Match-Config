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
  const currentTime = new Date();
  const currentTimePlusFifteen = new Date();
  currentTimePlusFifteen.setMinutes(currentTime.getMinutes() + 15);

  let matchConfig;
  try {
    matchConfig = await MatchConfig.findOne({
      server: req.params.server,
      'matchDate.startTime': {
        $lte: currentTimePlusFifteen,
      },
      'matchDate.endTime': {
        $gte: currentTime,
      },
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
