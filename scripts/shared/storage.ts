import type { Player, World } from "@minecraft/server";
import { inject, Lifecycle, scoped, singleton } from "tsyringe";
import { TEXTURE_DEBUG_PLAYER_TOKEN, TEXTURE_DEBUG_WORLD_TOKEN as TEXTURE_DEBUG_WORLD_TOKEN } from "./global-tokens";
import { TextureDebugLogger } from "./logging/logger";

export abstract class StorageBase {
  constructor(
    private readonly storageSource: World | Player,
    private readonly logger?: TextureDebugLogger
  ) {}

  get<T>(key: string): T | undefined {
    const value = this.storageSource.getDynamicProperty(key);
    if (value !== undefined && typeof value === "string") {
      return JSON.parse(value) as T;
    }
    return value as T | undefined;
  }
  set<T>(key: string, value: T | undefined): void {
    const text = JSON.stringify(value);
    this.storageSource.setDynamicProperty(key, text);
    this.logger?.debug(`saved ${key}: ${text.length} characters`);
  }
  keys(): string[] {
    return (this.storageSource as World).getDynamicPropertyIds();
  }
  deleteKey(key: string): void {
    this.storageSource.setDynamicProperty(key);
  }
}

@scoped(Lifecycle.ContainerScoped)
export class TextureDebugWorldStorage extends StorageBase {
  constructor(@inject(TEXTURE_DEBUG_WORLD_TOKEN) world: World, @inject(TextureDebugLogger) logger: TextureDebugLogger) {
    super(world, logger);
  }
}

@scoped(Lifecycle.ContainerScoped)
export class PlayerStorage extends StorageBase {
  constructor(
    @inject(TEXTURE_DEBUG_PLAYER_TOKEN) player: Player,
    @inject(TextureDebugLogger) logger: TextureDebugLogger
  ) {
    super(player, logger);
  }
}
