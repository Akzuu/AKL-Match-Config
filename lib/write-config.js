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

  if (players.length > 0) return players;
  return playersObject;
};

const writeConfigFile = async (matchConfig) => {
  // const spectators = generatePlayersField(matchConfig.spectators);
  const teamOnePlayers = generatePlayersField(matchConfig.teamOne.players);
  const teamTwoPlayers = generatePlayersField(matchConfig.teamTwo.players);

  let payload;
  // Hardcoded wingman tournament config maker
  // TODO: Replace
  if (matchConfig.playersPerTeam === 2) {
    payload = {
      matchid: matchConfig.matchId,
      num_maps: matchConfig.bo,
      players_per_team: matchConfig.playersPerTeam,
      min_players_to_ready: 1,
      min_spectators_to_ready: 0,
      skip_veto: false,
      veto_first: matchConfig.vetoStarter,
      side_type: matchConfig.sideChosingMethod,
      maplist: matchConfig.mapPool,
      team1: {
        name: matchConfig.teamOne.name,
        tag: matchConfig.teamOne.tag,
      },
      team2: {
        name: matchConfig.teamTwo.name,
        tag: matchConfig.teamTwo.tag,
      },
      cvars: {
        get5_check_auths: '0',
      },
    };
  } else {
    payload = {
      matchid: matchConfig.matchId,
      num_maps: matchConfig.bo,
      players_per_team: matchConfig.playersPerTeam,
      min_players_to_ready: 1,
      min_spectators_to_ready: 0,
      skip_veto: false,
      veto_first: matchConfig.vetoStarter,
      side_type: matchConfig.sideChosingMethod,
      maplist: matchConfig.mapPool,
      team1: {
        name: matchConfig.teamOne.name,
        tag: matchConfig.teamOne.tag,
        players: teamOnePlayers,
      },
      team2: {
        name: matchConfig.teamTwo.name,
        tag: matchConfig.teamTwo.tag,
        players: teamTwoPlayers,
      },
      cvars: {
        get5_check_auths: '1',
      },
    };
  }

  const stringedPayload = JSON.stringify(payload, null, 2);

  await fsPromises.writeFile(`./server-configs/${matchConfig.server}_match.json`, stringedPayload);

  return `${matchConfig.server}_match.json`;
};

module.exports = {
  writeConfigFile,
};
