import BasePlugin from './base-plugin.js';

export default class KickCheaters extends BasePlugin {
  static get description() {
    return (
      'Кик читеров'
    );
  }

  static get defaultEnabled() {
    return false;
  }

  static get optionsSpecification() {
    return { };
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
      await this.server.rcon.kick(steamID, 'Автокик: подозрение на читы');
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
  }

  async mount() {
    this.server.logParser.on('CHEATER-EXPLOSIVE-DAMAGE', this.kick_cheater);
  }
}
