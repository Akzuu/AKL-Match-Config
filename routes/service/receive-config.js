const { log } = require('../../lib');
const { MatchConfig } = require('../../models');

const teamSchema = {
  type: 'object',
  description: 'Team information',
  required: ['name', 'tag', 'players'],
  properties: {
    name: {
      type: 'string',
    },
    tag: {
      type: 'string',
    },
    flag: {
      type: 'string',
      description: 'Country flag. Def: FI',
    },
    logo: {
      type: 'string',
      description: 'Team logo',
    },
    players: {
      type: 'array',
      description: 'SteamIds & forced names for team players',
      items: {
        type: 'object',
        required: ['steamId64'],
        properties: {
          steamId64: {
            type: 'string',
          },
          forcedName: {
            type: 'string',
          },
        },
      },
    },
  },
};

const schema = {
  description: 'Pass match configs to service',
  summary: 'Send match configs',
  tags: ['Service'],
  body: {
    type: 'object',
    required: ['matchId', 'server', 'matchDate', 'mapPool', 'teamOne', 'teamTwo'],
    properties: {
      matchId: {
        type: 'string',
        description: 'Unique id for the match. E.g. challonge match id',
      },
      server: {
        type: 'string',
        description: 'Server name. E.g. akl-csgo-1',
        example: 'akl-csgo-1',
      },
      matchDate: {
        type: 'object',
        required: ['startTime'],
        properties: {
          startTime: {
            type: 'string',
            format: 'date-time',
            description: 'When will the match start. Use GMT+0',
          },
          endTime: {
            type: 'string',
            format: 'date-time',
            description: 'Estimation of when the match ends / timeslot ending. Not required',
          },
        },
      },
      bo: {
        type: 'number',
        description: 'Best of x. Must be odd number or 2, e.g. 1,2,3,5,7... Default: 1',
      },
      spectators: {
        type: 'array',
        description: 'SteamIds for spectators. Could be admins, observers etc...',
        items: {
          type: 'object',
          required: ['steamId64'],
          properties: {
            steamId64: {
              type: 'string',
            },
            forcedName: {
              type: 'string',
            },
          },
        },
      },
      vetoStarter: {
        type: 'string',
        enum: ['team1', 'team2'],
        description: 'Which team starts the veto process. Default team1',
        default: 'team1',
      },
      sideChoosingMethod: {
        type: 'string',
        enum: ['standard', 'always_knife', 'never_knife'],
        default: 'standard',
        description: 'Def: standard. Can be "standard", "always_knife" or "never_knife". See get5 doc',
      },
      mapPool: {
        type: 'array',
        description: 'Maps',
        items: {
          type: 'string',
        },
      },
      playersPerTeam: {
        type: 'number',
        default: 5,
      },
      teamOne: teamSchema,
      teamTwo: teamSchema,
      cvars: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            cvar: {
              type: 'string',
            },
            value: {
              type: 'string',
            },
          },
        },
      },
    },
  },
};

const handler = async (req, reply) => {
  try {
    await MatchConfig.create(req.body);
  } catch (error) {
    log.error('Error when creating match config to db! ', error);
    reply.status(500).send({
      status: 'ERROR',
      error: 'Internal Server Error',
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
    url: '/config/',
    handler,
    schema,
  });
};
