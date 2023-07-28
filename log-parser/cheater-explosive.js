const minTimeBetweenExplosive = CHANGE_ME * 1000; // Минимальное время в миллисекундах
// между взрывами, которое не считается читерским поведением
const maxExplosiveInRow = CHANGE_ME; // Максимальное количество взрывов подряд
// (подряд - это когда между взрывом n и n-1 меньше minTimeBetweenExplosive миллисекунд)
const timeoutBetweenEmit = CHANGE_ME * 1000; // Таймаут между emit в миллисекундах
// После первого emit и до истечения таймаута - все сообщения о взрывах
// конкретного читера будут проигнорированы

export default {
    regex:
    /^\[([0-9.:-]+)]\[([ 0-9]*)]LogSquadTrace: \[DedicatedServer\]ApplyExplosiveDamage\(\): HitActor=.* DamageCauser=(\S+) DamageInstigator=(\S+) /,
    onMatch: (args, logParser) => {
      let returnData = {
        raw: args[0],
        time: args[1],
        chainID: args[2],
        causer: args[3],
        controller: args[4],
      };

      const playerControllerObj = logParser.eventStore.controllers[returnData.controller];

      if (typeof playerControllerObj == 'undefined') {
        // Если squadjs был запущен после подключения игрока - контроллер игрока неизвестен
        return;
      }

      returnData.steamID = playerControllerObj.steamID;

      if (!('lastApplyExplosiveDamage' in playerControllerObj)) {
        playerControllerObj.lastApplyExplosiveDamage = returnData.time;
        playerControllerObj.countApplyExplosiveDamage = 1;
        playerControllerObj.lastEmitTime = null;
        return;
      }

      // Не спамим emit, кидаем emit только 1 раз в timeoutBetweenEmit
      if ((playerControllerObj.lastEmitTime !== null)
          && (returnData.time - playerControllerObj.lastEmitTime < timeoutBetweenEmit)) {
        return;
      }

      // Если с момента предыдущего взрыва прошло меньше времени чем в должно
      if ((playerControllerObj.lastApplyExplosiveDamage - returnData.time) < minTimeBetweenExplosive) {
        playerControllerObj.countApplyExplosiveDamage++;
        playerControllerObj.lastApplyExplosiveDamage = returnData.time;
      } else {
        playerControllerObj.countApplyExplosiveDamage = 0;
        playerControllerObj.lastApplyExplosiveDamage = returnData.time;
        return;
      }

      if (playerControllerObj.countApplyExplosiveDamage >= maxExplosiveInRow) {
        logParser.emit('CHEATER-EXPLOSIVE-DAMAGE', returnData);
        playerControllerObj.lastEmitTime = returnData.time;
        playerControllerObj.countApplyExplosiveDamage = 0;
      }
    },
  };

