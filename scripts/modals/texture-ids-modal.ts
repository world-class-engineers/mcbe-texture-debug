import { inject, Lifecycle, scoped, singleton } from "tsyringe";
import type { ItemTypes, Player, System } from "@minecraft/server";
import {
  TEXTURE_DEBUG_CREATE_ACTION_FORM_TOKEN,
  CreateActionFormFn,
  TEXTURE_DEBUG_ITEM_TYPES_TOKEN,
  TEXTURE_DEBUG_SYSTEM_TOKEN,
} from "../shared/global-tokens";
import { TextureDebugLogger } from "../shared/logging/logger";
import itemNumericalIds from "./item-numerical-ids.json";
import { getItemTexture } from "./item-texture";
import { CollectionBrowserFormData } from "./custom-data-form/custom-data-form";
import { TextureIdsSettingsModal } from "./texture-ids-settings.modal";
import { TextureIdsSettingsService } from "./texture-ids-settings.service";
import { BOLD, GREEN, OBFUSCATED, RED, RESET } from "../shared/format-codes";

const GRID_COLUMNS = 17;
const GRID_ROWS = 7;
const MAX_ITEMS_PER_PAGE = GRID_COLUMNS * GRID_ROWS;

interface TextureCacheEntry {
  itemId: string;
  rawId: number;
  computedTexture: number;
}

@scoped(Lifecycle.ContainerScoped)
export class TextureIdsModal {
  private currentPage: number = 0;
  private textureCache = new Map<number, string>();

  constructor(
    @inject(TEXTURE_DEBUG_SYSTEM_TOKEN) private readonly system: System,
    @inject(TEXTURE_DEBUG_CREATE_ACTION_FORM_TOKEN) private readonly createActionForm: CreateActionFormFn,
    @inject(TextureIdsSettingsModal) private readonly settingsModal: TextureIdsSettingsModal,
    @inject(TextureIdsSettingsService) private readonly settingsService: TextureIdsSettingsService,
    @inject(TextureDebugLogger) private readonly logger: TextureDebugLogger,
    @inject(TEXTURE_DEBUG_ITEM_TYPES_TOKEN) private readonly itemTypes: typeof ItemTypes
  ) {}

  private invalidateCache(): void {
    this.textureCache.clear();
  }

  private lookupItem(id: number) {
    if (this.textureCache.has(id)) {
      return this.textureCache.get(id);
    }
    const item = Object.entries(itemNumericalIds).find((e) => e[1] === id);
    if (item) {
      this.textureCache.set(id, item[0]);
      return item[0];
    }
    return null;
  }

  async show(player: Player) {
    const all = this.itemTypes.getAll();
    const customItems = all.filter((i) => !i.id.startsWith("minecraft:"));

    let customItemCount = this.settingsService.getCustomItemCount();
    this.logger.log(
      `[texture_debug] detected items:\n\tall: ${all.length}\n\tcustom: ${customItems.length}\n\tsetting: ${customItemCount}`
    );
    let minId = this.settingsService.getMinId();
    let maxId = this.settingsService.getMaxId();

    if (!Number.isFinite(customItemCount)) customItemCount = 0;
    if (!Number.isFinite(minId)) minId = -1500;
    if (!Number.isFinite(maxId)) maxId = 1500;
    if (minId > maxId) [minId, maxId] = [maxId, minId];

    this.invalidateCache();

    const allIds: number[] = [];
    for (let id = minId; id <= maxId; id++) {
      allIds.push(id);
    }

    const totalItems = allIds.length;
    let totalPages = Math.ceil(totalItems / MAX_ITEMS_PER_PAGE);
    if (totalPages > 99) totalPages = 99;

    if (this.currentPage >= totalPages) {
      this.currentPage = 0;
    }

    const title = `Texture IDs (${minId}-${maxId})`;

    const collectionForm = new CollectionBrowserFormData(this.createActionForm, this.logger).title(title);

    const hasPrevious = this.currentPage > 0;
    const hasNext = this.currentPage < totalPages - 1;
    collectionForm.pagination(this.currentPage, totalPages, hasPrevious, hasNext);
    collectionForm.itemsCount(totalItems);

    const filler: Parameters<typeof collectionForm.button> = ["", [], "", 1, 0, undefined];
    collectionForm.button("Previous Page", [], "", 1, 0, "previous-page");
    collectionForm.button("Next Page", [], "", 1, 0, "next-page");
    collectionForm.button("Settings", [], "", 1, 0, "settings");

    for (let i = 0; i < 14; i++) {
      collectionForm.button(...filler);
    }

    const pageStartIndex = this.currentPage * MAX_ITEMS_PER_PAGE;
    const pageIds = allIds.slice(pageStartIndex, pageStartIndex + MAX_ITEMS_PER_PAGE);

    for (const id of pageIds) {
      const textureValue = id * 65536;
      const unmodifiedId = id < 256 ? id : id - customItemCount;
      const knownItem = this.lookupItem(unmodifiedId);

      let displayName: string;
      let descLines: string[];

      displayName = `${id}: ${knownItem ?? `${OBFUSCATED}unknown${RESET}`} (${unmodifiedId})`;
      descLines = [];
      if (knownItem) {
        const type = this.itemTypes.get(knownItem);
        descLines.push(type ? `${GREEN}${BOLD}OK${RESET}` : `${RED}${BOLD}INVALID${RESET}`);
      }

      collectionForm.button(displayName, descLines, textureValue, 1, 0, id.toString());
    }

    const result = await collectionForm.show(player);
    try {
      if (result.canceled || result.selectedButtonValue === undefined || result.selectedButtonValue === null) {
        return;
      }

      const selection = result.selectedButtonValue as string;

      if (selection === "previous-page" && this.currentPage > 0) {
        this.currentPage--;
        this.system.run(() => this.show(player));
      } else if (selection === "next-page") {
        this.currentPage++;
        this.system.run(() => this.show(player));
      } else if (selection === "settings") {
        this.system.run(async () => {
          await this.settingsModal.show(player);
          this.currentPage = 0;
          this.show(player);
        });
      }
    } catch (err) {
      this.logger.error("form.show() error:", err);
    }
  }
}
