import DiscordBasePlugin from "./discord-base-plugin.js";

export default class KickCheatersDiscord extends DiscordBasePlugin {
  static get description() {
    return (
      'Кик читеров по сигналам в логах с отправкой информации в дискорд'
    );
  }

  static get defaultEnabled() {
    return false;
  }

  static get optionsSpecification() {
    return {
      ...DiscordBasePlugin.optionsSpecification,
      channelID: {
        required: true,
        description: 'The ID of the channel to alert admins through.',
        default: '',
        example: '667741905228136459'
      },
    };
  }

  constructor(server, options, connectors) {
    super(server, options, connectors);

    this.kick_cheater = this.kick_cheater.bind(this);
  }

  async kick_cheater({steamID}) {
    this.verbose(
        1,
        `${steamID} will be kicked: registered ApplyExplosiveDamage exploit usage...`
    );
    try {
      await this.server.rcon.kick(steamID, 'Подозрение на читы');
      this.verbose(
          1,
          `${steamID} was successfully kicked.`
      )
    } catch (err) {
      this.verbose(
          1,
          `${steamID} was FAILED to kick.`,
          err
      )
    }
    await this.sendDiscordMessage(
        `Игрок \`${steamID}\` кикнут: был обнаружен эксплойт.\n` +
        "Тип уязвимости: *ApplyExplosiveDamage*\n" +
        "@here"
    );
  }

  async mount() {
    this.server.logParser.on('CHEATER-EXPLOSIVE-DAMAGE', this.kick_cheater);
  }

  async unmount() {
    this.server.logParser.removeEventListener('CHEATER-EXPLOSIVE-DAMAGE', this.kick_cheater);
  }
}
