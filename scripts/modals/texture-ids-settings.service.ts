import { inject, singleton } from "tsyringe";
import { WorldStorage } from "../shared/storage";
import { Logger } from "../shared/logging/logger";

const CUSTOM_ITEM_COUNT_KEY = "texture_debug:custom_item_count";
const MIN_ID_KEY = "texture_debug:min_id";
const MAX_ID_KEY = "texture_debug:max_id";

const DEFAULT_MIN_ID = -1500;
const DEFAULT_MAX_ID = 1500;

export interface TextureIdsSettings {
  customItemCount: number;
  minId: number;
  maxId: number;
}

@singleton()
export class TextureIdsSettingsService {
  constructor(
    @inject(WorldStorage) private readonly worldStorage: WorldStorage,
    @inject(Logger) private readonly logger: Logger
  ) {}

  getCustomItemCount(): number {
    return this.worldStorage.get<number>(CUSTOM_ITEM_COUNT_KEY) ?? 0;
  }

  setCustomItemCount(count: number): void {
    this.worldStorage.set(CUSTOM_ITEM_COUNT_KEY, count);
  }

  getMinId(): number {
    return this.worldStorage.get<number>(MIN_ID_KEY) ?? DEFAULT_MIN_ID;
  }

  setMinId(id: number): void {
    this.worldStorage.set(MIN_ID_KEY, id);
  }

  getMaxId(): number {
    return this.worldStorage.get<number>(MAX_ID_KEY) ?? DEFAULT_MAX_ID;
  }

  setMaxId(id: number): void {
    this.worldStorage.set(MAX_ID_KEY, id);
  }
}
