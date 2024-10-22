import DiscordBasePlugin from "./discord-base-plugin.js";

export default class KickCheatersDiscord extends DiscordBasePlugin {
  static get description() {
    return "Kick cheaters and send info to discord";
  }

  static get defaultEnabled() {
    return false;
  }

  static get optionsSpecification() {
    return {
      ...DiscordBasePlugin.optionsSpecification,
      channelID: {
        required: true,
        description: "The ID of the channel to alert admins through.",
        default: "",
        example: "667741905228136459",
      },
    };
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
    await this.sendDiscordMessage(
      `Player \`${eosID}\` / \`${player.steamID}\` kick: An exploit has been detected.\n` +
        "Vulnerability type: *ApplyExplosiveDamage*\n" +
        "@here"
    );
  }

  async mount() {
    this.server.logParser.on("CHEATER-EXPLOSIVE-DAMAGE", this.kick_cheater);
  }

  async unmount() {
    this.server.logParser.removeEventListener(
      "CHEATER-EXPLOSIVE-DAMAGE",
      this.kick_cheater
    );
  }
}
