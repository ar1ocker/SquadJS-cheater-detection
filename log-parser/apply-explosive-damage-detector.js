const minTimeBetweenExplosive = CHANGE_ME * 1000; // The minimum time in milliseconds between explosions that is not considered cheating behavior
const maxExplosiveInRow = CHANGE_ME; // The maximum number of explosions in a row
// (in a row is when there are less than minTimeBetweenExplosive milliseconds between an explosion n and n-1)
const timeoutBetweenEmit = CHANGE_ME * 1000; // The timeout between the emit in milliseconds
// After the first emit and before the timeout expires - all messages about explosions of a particular cheater will be ignored

export default {
  regex:
    /^\[([0-9.:-]+)]\[([ 0-9]*)]LogSquadTrace: \[DedicatedServer\]ApplyExplosiveDamage\(\): HitActor=.* DamageCauser=(\S+) DamageInstigator=(\S+) /,
  onMatch: (args, logParser) => {
    const parsedData = {
      raw: args[0],
      time: args[1],
      chainID: args[2],
      causer: args[3],
      controller: args[4],
    };

    const playerControllerObj =
      logParser.eventStore.players_controllers[parsedData.controller];

    if (typeof playerControllerObj === "undefined") {
      // If squadjs was launched after the player was connected, the player's controller is unknown
      return;
    }

    parsedData.eosID = playerControllerObj.eosID;

    if (!("lastApplyExplosiveDamage" in playerControllerObj)) {
      playerControllerObj.lastApplyExplosiveDamage = parsedData.time;
      playerControllerObj.countApplyExplosiveDamage = 1;
      playerControllerObj.lastEmitTime = null;
      return;
    }

    // We do not spam the emit, we throw the emit only 1 time in timeoutBetweenEmit
    if (
      playerControllerObj.lastEmitTime !== null &&
      parsedData.time - playerControllerObj.lastEmitTime < timeoutBetweenEmit
    ) {
      return;
    }

    // If less time has passed since the previous explosion than it should
    if (
      parsedData.time - playerControllerObj.lastApplyExplosiveDamage <
      minTimeBetweenExplosive
    ) {
      playerControllerObj.countApplyExplosiveDamage++;
      playerControllerObj.lastApplyExplosiveDamage = parsedData.time;
    } else {
      playerControllerObj.countApplyExplosiveDamage = 0;
      playerControllerObj.lastApplyExplosiveDamage = parsedData.time;
      return;
    }

    if (playerControllerObj.countApplyExplosiveDamage >= maxExplosiveInRow) {
      logParser.emit("EXCEEDING_EXPLOSIVE_LIMIT", parsedData);
      playerControllerObj.lastEmitTime = parsedData.time;
      playerControllerObj.countApplyExplosiveDamage = 0;
    }
  },
};
