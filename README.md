# ⭐ If it's useful, give it a star ⭐
# SquadJS-cheater-detection

## English

Detect and kick cheaters using ApplyExplosiveDamage spam to the server

Tested on SquadJS version 4.1.0

### Settings

- Download the repository 

```
git clone https://github.com/ar1ocker/SquadJS-cheater-detection
```

- Copy the file `log-parser/apply-explosive-damage-detector.js` to the folder `<path to squadjs on the server>/squad-server/log-parser/`

- Copy the file `plugins/kick-cheaters.js` to the folder `<path to squadjs on the server>/squad-server/plugins/`

- Apply the patch while in the folder `<path to squadjs on the server>/` 

```
git apply <path to patch file> --verbose
```

- Add a new plugin to `config.json` (plugins section)

```
    {
      "plugin": "KickCheaters",
       "enabled": true
    },
```

- Change in the 'apply-explosive-damage-detector.js' three parameters

- minTimeBetweenExplosive - The minimum time in milliseconds between explosions, which is not considered cheating behavior

- maxExplosiveInRow - The maximum number of explosions in a row. In a row - when there are less than minTimeBetweenExplosive milliseconds between the explosion of n and n-1

- timeoutBetweenEmit - Timeout between emits in milliseconds. After the first emit and before the timeout expires, all messages about explosions of a particular cheater will be ignored

### Why are we starting to store player controllers separately with the patch

![image](https://github.com/user-attachments/assets/7b9a8f37-27e8-4669-9258-e8eb02e563ca )

The controllers of the players may well repeat themselves, here is a part of the log confirming this, the difference between the outputs of the players to the server is 30 minutes

## Russian

Детект и кик читеров использующих ApplyExplosiveDamage спам на сервер

Проверено на версии SquadJS 4.1.0

### Настройка

- Скачайте репозиторий 

```
git clone https://github.com/ar1ocker/SquadJS-cheater-detection
```

- Скопируйте файл `log-parser/apply-explosive-damage-detector.js` в папку `<путь до squadjs на сервере>/squad-server/log-parser/`

- Скопируйте файл `plugins/kick-cheaters.js` в папку `<путь до squadjs на сервере>/squad-server/plugins/`

- Примените патч находясь в папке `<путь до squadjs на сервере>/` 

```
git apply <путь до файла patch> --verbose
```

- Добавьте новый плагин в `config.json` (раздел plugins)

```
    {
      "plugin": "KickCheaters",
       "enabled": true
    },
```

- Измените в файле `apply-explosive-damage-detector.js` три параметра

- minTimeBetweenExplosive - Минимальное время в миллисекундах между взрывами, которое не считается читерским поведением

- maxExplosiveInRow - Максимальное количество взрывов подряд. Подряд - когда между взрывом n и n-1 меньше minTimeBetweenExplosive миллисекунд

- timeoutBetweenEmit - Таймаут между emit в миллисекундах. После первого emit и до истечения таймаута - все сообщения о взрывах конкретного читера будут проигнорированы

### Зачем патчем мы начинаем хранить player controllers отдельно

![изображение](https://github.com/user-attachments/assets/7b9a8f37-27e8-4669-9258-e8eb02e563ca)

Контроллеры у игроков вполне могут повторятся, вот часть лога это подтверждающая, разница между входами игроков на сервер - 30 минут
