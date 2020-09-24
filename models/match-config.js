const mongoose = require('mongoose');

const { Schema } = mongoose;

// See get5 example config
// https://github.com/splewis/get5/blob/master/configs/get5/example_match.cfg
const schema = new Schema({
  matchId: {
    type: String,
    required: true,
    unique: true,
  },
  server: {
    type: String,
    required: true,
  },
  matchServed: {
    type: Boolean,
    default: false,
  },
  matchDate: {
    startTime: {
      required: true,
      type: Date,
    },
    endTime: {
      type: Date,
    },
  },
  bo: {
    type: Number,
    default: 1,
  },
  spectators: [{
    steamId64: {
      required: true,
      type: String,
    },
    forcedName: {
      type: String,
    },
  }],
  vetoStarter: {
    type: String,
    enum: ['team1', 'team2'],
    default: 'team1',
  },
  sideChosingMethod: {
    type: String,
    default: 'standard',
    enum: ['standard', 'always_knife', 'never_knife'],
  },
  mapPool: [{
    type: String,
  }],
  playersPerTeam: {
    type: Number,
    default: 5,
  },
  teamOne: {
    name: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      required: true,
    },
    flag: {
      type: String,
      default: 'FI',
    },
    logo: {
      type: String,
    },
    players: [{
      steamId64: {
        required: true,
        type: String,
      },
      forcedName: {
        type: String,
      },
    }],
  },
  teamTwo: {
    name: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      required: true,
    },
    flag: {
      type: String,
      default: 'FI',
    },
    logo: {
      type: String,
    },
    players: [{
      steamId64: {
        required: true,
        type: String,
      },
      forcedName: {
        type: String,
      },
    }],
  },
  cvars: [{
    cvar: {
      type: String,
    },
    value: {
      type: String,
    },
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('MatchConfigs', schema);
