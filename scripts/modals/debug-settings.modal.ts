import { inject, Lifecycle, scoped, singleton } from "tsyringe";
import type { Player } from "@minecraft/server";
import { DDUI, TEXTURE_DEBUG_DDUI_TOKEN } from "../ui/ui.tokens";
import { TextureDebugWorldStorage } from "../shared/storage";
import { getLogSettings, setLogSettings, TEXTURE_DEBUG_LOG_SETTINGS_STORAGE_KEY } from "../shared/logging/log-settings";
import { TextureDebugLogger } from "../shared/logging/logger";

@scoped(Lifecycle.ContainerScoped)
export class DebugSettingsModal {
  constructor(
    @inject(TEXTURE_DEBUG_DDUI_TOKEN) private readonly ddui: DDUI,
    @inject(TextureDebugWorldStorage) private readonly worldStorage: TextureDebugWorldStorage,
    @inject(TextureDebugLogger) private readonly logger: TextureDebugLogger
  ) {}

  async show(player: Player): Promise<void> {
    const currentSettings = getLogSettings();

    const debug = new this.ddui.ObservableBoolean(currentSettings.levels.includes("debug"), {
      clientWritable: true,
    });
    const log = new this.ddui.ObservableBoolean(currentSettings.levels.includes("log"), {
      clientWritable: true,
    });
    const warn = new this.ddui.ObservableBoolean(currentSettings.levels.includes("warn"), {
      clientWritable: true,
    });
    const error = new this.ddui.ObservableBoolean(currentSettings.levels.includes("error"), {
      clientWritable: true,
    });
    const logToConsole = new this.ddui.ObservableBoolean(currentSettings.logToConsole, {
      clientWritable: true,
    });
    const logToChat = new this.ddui.ObservableBoolean(currentSettings.logToChat, {
      clientWritable: true,
    });

    const form = new this.ddui.CustomForm(player, "texture_debug Debug Settings")
      .header("Logging Levels")
      .toggle("debug", debug)
      .toggle("log", log)
      .toggle("warn", warn)
      .toggle("error", error)
      .divider()
      .header("Logging Destinations")
      .toggle("Log to Console", logToConsole)
      .toggle("Log to Chat", logToChat);

    try {
      await form.show();
      const levels: ("debug" | "log" | "warn" | "error")[] = [];
      if (debug.getData()) levels.push("debug");
      if (log.getData()) levels.push("log");
      if (warn.getData()) levels.push("warn");
      if (error.getData()) levels.push("error");

      const newSettings = {
        levels,
        logToConsole: logToConsole.getData(),
        logToChat: logToChat.getData(),
      };

      setLogSettings(newSettings);
      this.worldStorage.set(TEXTURE_DEBUG_LOG_SETTINGS_STORAGE_KEY, newSettings);
    } catch (e) {
      this.logger.debug(e);
    }
  }
}
