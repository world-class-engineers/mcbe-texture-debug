import { inject, singleton } from "tsyringe";
import type { Player } from "@minecraft/server";
import { DDUI, DDUI_TOKEN } from "../ui/ui.tokens";
import { Logger } from "../shared/logging/logger";
import { TextureIdsSettingsService } from "./texture-ids-settings.service";

const DEFAULT_MIN_ID = 0;
const DEFAULT_MAX_ID = 9999;

@singleton()
export class TextureIdsSettingsModal {
  constructor(
    @inject(DDUI_TOKEN) private readonly ddui: DDUI,
    @inject(TextureIdsSettingsService) private readonly settings: TextureIdsSettingsService,
    @inject(Logger) private readonly logger: Logger
  ) {}

  async show(player: Player): Promise<void> {
    const currentCount = this.settings.getCustomItemCount();
    const currentMinId = this.settings.getMinId();
    const currentMaxId = this.settings.getMaxId();

    const customItemCount = new this.ddui.ObservableString(String(currentCount), {
      clientWritable: true,
    });

    const minId = new this.ddui.ObservableString(String(currentMinId), {
      clientWritable: true,
    });

    const maxId = new this.ddui.ObservableString(String(currentMaxId), {
      clientWritable: true,
    });

    const form = new this.ddui.CustomForm(player, "Texture IDs Settings")
      .divider()
      .label("Custom Item Count")
      .textField("Count", customItemCount)
      .label(
        "The custom item count affects the encoding of item IDs > 255. This value should match the number of custom items registered before this add-on's items."
      )
      .divider()
      .label("ID Range")
      .textField("Min ID", minId)
      .textField("Max ID", maxId)
      .label("Configure the range of texture IDs to display. Default: -1500 - 1500")
      .divider();

    try {
      await form.show();
      const newCount = parseInt(customItemCount.getData(), 10);
      const newMinId = parseInt(minId.getData(), 10);
      const newMaxId = parseInt(maxId.getData(), 10);
      this.settings.setCustomItemCount(newCount);
      this.settings.setMinId(newMinId);
      this.settings.setMaxId(newMaxId);
    } catch (e) {
      this.logger.debug(e);
    }
  }
}
