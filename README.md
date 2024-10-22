# SquadJS-cheater-detection

Детект и кик читеров использующих ApplyExplosiveDamage спам на сервер

Проверено на версии SquadJS 4.0.0 с патчем от https://github.com/fantinodavide/SquadJS/tree/eos-integration

## Настройка

- Скачайте репозиторий 

```
git clone https://github.com/ar1ocker/SquadJS-cheater-detection
```

- Скопируйте файл `log-parser/cheater-explosive.js` в папку `<путь до squadjs на сервере>/squad-server/log-parser/`

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

- Измените в файле `cheater-explosive.js` три параметра

- minTimeBetweenExplosive - Минимальное время в миллисекундах между взрывами, которое не считается читерским поведением

- maxExplosiveInRow - Максимальное количество взрывов подряд. Подряд - когда между взрывом n и n-1 меньше minTimeBetweenExplosive миллисекунд

- timeoutBetweenEmit - Таймаут между emit в миллисекундах. После первого emit и до истечения таймаута - все сообщения о взрывах конкретного читера будут проигнорированы

## Зачем player controllers хранятся отдельно

![изображение](https://github.com/user-attachments/assets/7b9a8f37-27e8-4669-9258-e8eb02e563ca)

Контроллеры у игроков вполне могут повторятся, вот часть лога это подтверждающая, разница между входами игроков на сервер - 30 минут
