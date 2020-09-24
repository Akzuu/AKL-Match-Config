const fs = require('fs');

const fsPromises = fs.promises;

const formatPlayerArrays = (array) => {
  let formated = '';
  if (array && Array.isArray(array) && array.length > 0) {
    array.forEach((value) => {
      formated = formated.concat(`"${value.steamId64}"   "${value.forcedName}"\n`);
    });
    formated = formated.substr(0, formated.length - 1);
  }

  return formated;
};

const formatSingleArrays = (array) => {
  let formated = '';
  if (array && Array.isArray(array) && array.length > 0) {
    array.forEach((value) => {
      formated = formated.concat(`"${value}"\n`);
    });
    formated = formated.substr(0, formated.length - 1);
  }

  return formated;
};

const formatCvars = (array) => {
  let formated = '';

  if (array && Array.isArray(array) && array.length > 0) {
    array.forEach((value) => {
      formated = formated.concat(`"${value.cvar}"   "${value.value}"\n`);
    });
    formated = formated.substr(0, formated.length - 1);
  }

  return formated;
};

const writeConfigFile = async (matchConfig) => {
  const spectators = formatPlayerArrays(matchConfig.spectators);
  const playersTeamOne = formatPlayerArrays(matchConfig.teamOne.players);
  const playersTeamTwo = formatPlayerArrays(matchConfig.teamTwo.players);
  const mapList = formatSingleArrays(matchConfig.mapPool);
  const cvars = formatCvars(matchConfig.cvars);

  await fsPromises.writeFile(`./server-configs/${matchConfig.server}_match.cfg`,
    `"Match"
    {
      "matchid" "${matchConfig.matchId}"
      "num_maps"  "${matchConfig.bo}"
    
      "spectators"
      {
        "players"
        {
          ${spectators}
        }
      }
    
      "skip_veto" "0"
    
      "veto_first"  "${matchConfig.vetoStarter}"  // Set to "team1" or "team2" to select who starts the veto. Any other values will default to team1 starting.
    
      "side_type" "${matchConfig.sideChoosingMethod}" // Either "standard", "always_knife", or "never_knife"
    
      "maplist"
      {
        ${mapList}
      }
    
      "players_per_team"  "${matchConfig.playersPerTeam}"
      "min_players_to_ready"  "1"
      "min_spectators_to_ready" "0"
    
      "team1"
      {
        "name"  "${matchConfig.teamOne.name}"
        "tag" "${matchConfig.teamOne.tag}"
        "flag"  "${matchConfig.teamOne.flag}"
        "logo"  "${matchConfig.teamOne.logo}"
        "players"
        {
          ${playersTeamOne}
        }
      }
    
      "team2"
      {
        "name"  "${matchConfig.teamTwo.name}"
        "tag" "${matchConfig.teamTwo.tag}"
        "flag"  "${matchConfig.teamTwo.flag}"
        "logo"  "${matchConfig.teamTwo.logo}"
        "players"
        {
          ${playersTeamTwo}
        }
      }
    
      // These will be executed on each map start or config load.
      // You should not use this as a replacement for the cfg/get5/live.cfg config.
      "cvars"
      {
        ${cvars}
      }
    }`);

  return `${matchConfig.server}_match.cfg`;
};

module.exports = {
  writeConfigFile,
};
