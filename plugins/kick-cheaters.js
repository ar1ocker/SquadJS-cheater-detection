import BasePlugin from "./base-plugin.js";

export default class KickCheaters extends BasePlugin {
  static get description() {
    return "Kick cheaters";
  }

  static get defaultEnabled() {
    return false;
  }

  static get optionsSpecification() {
    return {};
  }

  constructor(server, options, connectors) {
    super(server, options, connectors);

    this.kickCheater = this.kickCheater.bind(this);
  }

  async kickCheater({ eosID }) {
    const player = await this.server.getPlayerByEOSID(eosID);

    this.verbose(
      1,
      `${eosID} / ${player.steamID} will be kicked: registered ApplyExplosiveDamage exploit usage...`
    );
    try {
      await this.server.rcon.kick(eosID, "Autokick: Suspicion of cheats");
      this.verbose(1, `${eosID} was successfully kicked.`);
    } catch (err) {
      this.verbose(1, `${eosID} was FAILED to kick.`, err);
    }
  }

  async mount() {
    this.server.logParser.on("EXCEEDING_EXPLOSIVE_LIMIT", this.kickCheater);
  }
}
