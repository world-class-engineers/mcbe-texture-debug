import { inject, Lifecycle, scoped, singleton } from "tsyringe";
import { addOnCommand, CommandHandler, customCommandStatuses } from "../../system/add-on-command";
import type { CustomCommandOrigin, CustomCommandResult, Player, System } from "@minecraft/server";
import { TEXTURE_DEBUG_SYSTEM_TOKEN } from "../../shared/global-tokens";
import { TextureIdsModal } from "../../modals/texture-ids-modal";

@scoped(Lifecycle.ContainerScoped)
export class DebugTextureIdsCommand implements CommandHandler {
  constructor(
    @inject(TEXTURE_DEBUG_SYSTEM_TOKEN) private readonly system: System,
    @inject(TextureIdsModal) private readonly textureIdsModal: TextureIdsModal
  ) {}

  handleCommand(origin: CustomCommandOrigin): CustomCommandResult {
    const player = origin.sourceEntity as Player | undefined;
    if (!player || !("commandPermissionLevel" in player)) {
      return { status: customCommandStatuses.Failure };
    }
    this.system.run(() => this.textureIdsModal.show(player));
    return { status: customCommandStatuses.Success };
  }
}

export const debugTextureIdsCommand = addOnCommand({
  name: "__debug_texture_ids",
  description: "Debug command to browse all texture IDs",
  handlerClass: DebugTextureIdsCommand,
});
