import { container, inject, injectAll, registry, singleton } from "tsyringe";
import { ADD_ON_COMMANDS_TOKEN, AddOnCommand, CommandHandler, customCommandStatuses } from "./add-on-command";
import { debugTextureIdsCommand } from "./debug-commands/debug-texture-ids.command";
import { debugSettingsCommand } from "./debug-commands/debug-settings.command";
import type { CustomCommandOrigin, CustomCommandResult, StartupEvent, System } from "@minecraft/server";
import { SYSTEM_TOKEN } from "../shared/global-tokens";
import { Disposable } from "../shared/disposable";
import { Logger } from "../shared/logging/logger";

@registry([
  { token: ADD_ON_COMMANDS_TOKEN, useValue: debugTextureIdsCommand },
  { token: ADD_ON_COMMANDS_TOKEN, useValue: debugSettingsCommand },
])
@singleton()
export class CommandManager implements Disposable {
  constructor(
    @inject(Logger) private readonly logger: Logger,
    @inject(SYSTEM_TOKEN) private readonly system: System,
    @injectAll(ADD_ON_COMMANDS_TOKEN) private readonly commands: AddOnCommand<CommandHandler>[]
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
      const handler = container.resolve(command.handlerClass as any) as CommandHandler;
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
