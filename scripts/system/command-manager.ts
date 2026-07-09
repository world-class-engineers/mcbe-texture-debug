import { DependencyContainer, inject, injectAll, Lifecycle, registry, scoped } from "tsyringe";
import {
  TEXTURE_DEBUG_ADD_ON_COMMANDS_TOKEN,
  AddOnCommand,
  CommandHandler,
  customCommandStatuses,
} from "./add-on-command";
import { debugTextureIdsCommand } from "./debug-commands/debug-texture-ids.command";
import { debugSettingsCommand } from "./debug-commands/debug-settings.command";
import type { CustomCommandOrigin, CustomCommandResult, StartupEvent, System } from "@minecraft/server";
import { TEXTURE_DEBUG_CONTAINER_TOKEN, TEXTURE_DEBUG_SYSTEM_TOKEN } from "../shared/global-tokens";
import { Disposable } from "../shared/disposable";
import { TextureDebugLogger } from "../shared/logging/logger";

@registry([
  { token: TEXTURE_DEBUG_ADD_ON_COMMANDS_TOKEN, useValue: debugTextureIdsCommand },
  { token: TEXTURE_DEBUG_ADD_ON_COMMANDS_TOKEN, useValue: debugSettingsCommand },
])
@scoped(Lifecycle.ContainerScoped)
export class TextureDebugCommandManager implements Disposable {
  constructor(
    @inject(TEXTURE_DEBUG_CONTAINER_TOKEN) private readonly container: DependencyContainer,
    @inject(TextureDebugLogger) private readonly logger: TextureDebugLogger,
    @inject(TEXTURE_DEBUG_SYSTEM_TOKEN) private readonly system: System,
    @injectAll(TEXTURE_DEBUG_ADD_ON_COMMANDS_TOKEN) private readonly commands: AddOnCommand<CommandHandler>[]
  ) {}

  onStartUp(event: StartupEvent) {
    this.logger.log("registering commands...", JSON.stringify(this.commands));
    for (let command of this.commands) {
      this.logger.log(`registering command ${command.name}...`);
      event.customCommandRegistry.registerCommand(command, (origin, ...args) => this.onCommand(origin, command, args));
    }
    this.logger.log("all commands registered");
  }

  onCommand(origin: CustomCommandOrigin, command: AddOnCommand<CommandHandler>, args: any[]): CustomCommandResult {
    try {
      const handler = this.container.resolve(command.handlerClass as any) as CommandHandler;
      return handler.handleCommand(origin, args);
    } catch (err) {
      return {
        message: `Error while executing command ${command.name}: ${err} ${(err as Error).stack}`,
        status: customCommandStatuses.Failure,
      };
    }
  }

  dispose(): void {
    this.system.beforeEvents.startup.unsubscribe(this.onStartUp);
  }
}
