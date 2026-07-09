import { inject, Lifecycle, scoped, singleton } from "tsyringe";
import type { Player } from "@minecraft/server";
import { DDUI, TEXTURE_DEBUG_DDUI_TOKEN } from "../ui/ui.tokens";
import { TextureDebugLogger } from "../shared/logging/logger";
import { TextureIdsSettingsService } from "./texture-ids-settings.service";

@scoped(Lifecycle.ContainerScoped)
export class TextureIdsSettingsModal {
  constructor(
    @inject(TEXTURE_DEBUG_DDUI_TOKEN) private readonly ddui: DDUI,
    @inject(TextureIdsSettingsService) private readonly settings: TextureIdsSettingsService,
    @inject(TextureDebugLogger) private readonly logger: TextureDebugLogger
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
      .textField("Custom Item Count", customItemCount, {
        description:
          "The custom item count affects the encoding of item IDs > 255. This value should match the number of custom items registered before this add-on's items.",
      })
      .spacer()
      .header("ID Range")
      .textField("Min ID", minId, {
        description: "min vanilla id as of 26.32 is -1125. Future updates will have increasingly negative item IDs",
      })
      .textField("Max ID", maxId, {
        description:
          "max vanilla id as of 26.32 is 845. This number will be increased by the amount of custom items from other add-ons.",
      });

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
