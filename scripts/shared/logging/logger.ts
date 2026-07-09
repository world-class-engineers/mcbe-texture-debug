import { Lifecycle, scoped, inject } from "tsyringe";
import {
  TEXTURE_DEBUG_PLAYER_TOKEN as TEXTURE_DEBUG_PLAYER_TOKEN,
  TEXTURE_DEBUG_SYSTEM_TOKEN as TEXTURE_DEBUG_SYSTEM_TOKEN,
  TEXTURE_DEBUG_WORLD_TOKEN as TEXTURE_DEBUG_WORLD_TOKEN,
} from "../global-tokens";
import { TEXTURE_DEBUG_LOG_SETTINGS_TOKEN as TEXTURE_DEBUG_LOG_SETTINGS_TOKEN, LogSettings } from "./log-settings";
import type { Player, System, World } from "@minecraft/server";
import { BLUE, DARK_AQUA, DARK_GRAY, GRAY, GREEN, MINECOIN_GOLD, RED, RESET } from "../format-codes";
import { NAMESPACE } from "../constants";

@scoped(Lifecycle.ContainerScoped)
export class TextureDebugLogger {
  constructor(
    @inject(TEXTURE_DEBUG_SYSTEM_TOKEN) private readonly system: System,
    @inject(TEXTURE_DEBUG_WORLD_TOKEN) private readonly world: World,
    @inject(TEXTURE_DEBUG_LOG_SETTINGS_TOKEN) private readonly settings: LogSettings
  ) {}

  debug(...messages: any[]) {
    if (!this.settings().levels.includes("debug")) return;
    this.output(`${this.brackets(GRAY + "debug")} ${this.concat(messages)}`);
  }

  log(...messages: any[]) {
    if (!this.settings().levels.includes("log")) return;
    this.output(`${this.brackets(DARK_AQUA + "log")} ${this.concat(messages)}`);
  }

  warn(...messages: any[]) {
    if (!this.settings().levels.includes("warn")) return;
    this.output(`${this.brackets(MINECOIN_GOLD + "warn")} ${this.concat(messages)}`);
  }

  error(...messages: any[]) {
    if (!this.settings().levels.includes("error")) return;
    this.output(`${this.brackets(RED + "error")} ${this.concat(messages)}`);
  }

  private brackets(message: any) {
    return `${GRAY}[${RESET}${message}${GRAY}]${RESET}`;
  }

  private concat(messages: any[]) {
    return messages.map((m) => String(m)).join("; ");
  }

  private prefix() {
    return [this.brackets(DARK_GRAY + NAMESPACE), this.brackets(DARK_GRAY + this.system.currentTick)].join("");
  }

  private output(message: string) {
    const fullMessage = `${this.prefix()}${RESET}${message}`;
    if (this.settings().logToConsole) {
      console.log(fullMessage);
    }
    if (this.settings().logToChat) {
      try {
        for (const player of this.world.getPlayers()) {
          if (player.commandPermissionLevel >= 1) {
            player.sendMessage(fullMessage);
          }
        }
      } catch (err) {
        console.warn(`can't send world message in early execution: ${fullMessage}`);
      }
    }
  }
}
