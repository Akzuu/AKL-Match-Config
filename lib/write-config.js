const fs = require('fs');

const fsPromises = fs.promises;

const generatePlayersField = (playersArray) => {
  const playersObject = {};
  const players = [];
  playersArray.forEach((player) => {
    if (!player.forcedName) {
      players.push(player.steamId64);
    } else {
      playersObject[player.steamId64] = player.forcedName;
    }
  });

  if (playersArray.length > 0) return players;
  return playersObject;
};

const writeConfigFile = async (matchConfig) => {
  const payload = {
    matchid: matchConfig.matchId,
    num_maps: matchConfig.bo,
    players_per_team: 5,
    min_players_to_ready: 1,
    min_spectators_to_ready: 0,
    skip_veto: false,
    veto_first: matchConfig.vetoStarter,
    side_type: matchConfig.sideChosingMethod,
    spectators: {
      players: generatePlayersField(matchConfig.spectators),
    },
    maplist: matchConfig.mapPool,
    team1: {
      name: matchConfig.teamOne.name,
      tag: matchConfig.teamOne.tag,
      players: generatePlayersField(matchConfig.teamOne.players),
    },

    team2: {
      name: matchConfig.teamTwo.name,
      tag: matchConfig.teamTwo.tag,
      players: generatePlayersField(matchConfig.teamTwo.players),
    },
    cvars: {
      get5_check_auths: '1',
    },
  };

  const stringedPayload = JSON.stringify(payload);

  await fsPromises.writeFile(`./server-configs/${matchConfig.server}_match.json`, stringedPayload);

  return `${matchConfig.server}_match.json`;
};

module.exports = {
  writeConfigFile,
};
