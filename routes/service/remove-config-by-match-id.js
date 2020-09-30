const { log } = require('../../lib');
const { MatchConfig } = require('../../models');

const schema = {
  description: 'Remove cancelled match with matchId',
  summary: 'Remove match config',
  tags: ['Service'],
  params: {
    type: 'object',
    required: ['matchId'],
    properties: {
      matchId: {
        type: 'string',
      },
    },
  },
};

const handler = async (req, reply) => {
  const { matchId } = req.params;

  let config;
  try {
    config = await MatchConfig.findOneAndDelete({ matchId });
  } catch (error) {
    log.error('Error when creating match config to db! ', error);
    reply.status(500).send({
      status: 'ERROR',
      error: 'Internal Server Error',
    });
    return;
  }

  if (!config) {
    log.error(`Match config not found! matchId: ${matchId}`);
    reply.status(404).send({
      status: 'ERROR',
      error: 'Not Found',
      message: 'Match not found! Failed to cancel match!',
    });
    return;
  }

  reply.send({
    status: 'OK',
  });
};

module.exports = async function (fastify) {
  fastify.route({
    method: 'POST',
    url: '/config/:matchId/delete',
    handler,
    schema,
  });
};
