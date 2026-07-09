import "./polyfills";
import { container } from "tsyringe";
import { system, world, ItemTypes } from "@minecraft/server";
import {
  CREATE_ACTION_FORM_TOKEN,
  CREATE_MESSAGE_FORM_TOKEN,
  CREATE_MODAL_FORM_TOKEN,
  SYSTEM_TOKEN,
  WORLD_TOKEN,
  ITEM_TYPES_TOKEN,
} from "./shared/global-tokens";
import { DDUI_TOKEN } from "./ui/ui.tokens";
import { getLogSettings, LOG_SETTINGS_TOKEN } from "./shared/logging/log-settings";
import { Logger } from "./shared/logging/logger";
import { CommandManager } from "./system/command-manager";
import {
  ActionFormData,
  ModalFormData,
  CustomForm,
  ObservableBoolean,
  ObservableNumber,
  ObservableString,
  MessageFormData,
} from "@minecraft/server-ui";

container.registerInstance(DDUI_TOKEN, { CustomForm, ObservableBoolean, ObservableNumber, ObservableString });
container.registerInstance(CREATE_MODAL_FORM_TOKEN, () => new ModalFormData());
container.registerInstance(CREATE_MESSAGE_FORM_TOKEN, () => new MessageFormData());
container.registerInstance(CREATE_ACTION_FORM_TOKEN, () => new ActionFormData());
container.registerInstance(LOG_SETTINGS_TOKEN, getLogSettings);
container.registerInstance(SYSTEM_TOKEN, system);
container.registerInstance(WORLD_TOKEN, world);
container.registerInstance(ITEM_TYPES_TOKEN, ItemTypes);

const logger = container.resolve(Logger);
const commandManager = container.resolve(CommandManager);

logger.log("Initializing Texture Debug Add-On...");
system.beforeEvents.startup.subscribe((event) => {
  commandManager.onStartUp(event);
  logger.log("Texture Debug Add-On initialized successfully.");
});
