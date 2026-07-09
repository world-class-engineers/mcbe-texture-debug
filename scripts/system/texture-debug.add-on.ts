import { inject, Lifecycle, scoped, singleton } from "tsyringe";
import { TextureDebugCommandManager } from "./command-manager";
import type { StartupEvent } from "@minecraft/server";
import { TextureDebugWorldStorage } from "../shared/storage";
import { setLogSettings, TEXTURE_DEBUG_LOG_SETTINGS_STORAGE_KEY } from "../shared/logging/log-settings";

@scoped(Lifecycle.ContainerScoped)
export class TextureDebugAddOn {
  constructor(
    @inject(TextureDebugCommandManager) private commandManager: TextureDebugCommandManager,
    @inject(TextureDebugWorldStorage) private readonly worldStorage: TextureDebugWorldStorage
  ) {}

  startUp(event: StartupEvent) {
    this.commandManager.onStartUp(event);
  }

  run() {
    const stored = this.worldStorage.get<{
      levels: ("log" | "warn" | "error")[];
      logToConsole: boolean;
      logToChat: boolean;
    }>(TEXTURE_DEBUG_LOG_SETTINGS_STORAGE_KEY);
    if (stored) {
      setLogSettings(stored);
    }
  }
}
