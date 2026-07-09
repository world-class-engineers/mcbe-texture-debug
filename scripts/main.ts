import "./polyfills";
import { container } from "tsyringe";
import { system, world, ItemTypes } from "@minecraft/server";
import {
  TEXTURE_DEBUG_CREATE_ACTION_FORM_TOKEN,
  TEXTURE_DEBUG_CREATE_MESSAGE_FORM_TOKEN,
  TEXTURE_DEBUG_CREATE_MODAL_FORM_TOKEN,
  TEXTURE_DEBUG_SYSTEM_TOKEN,
  TEXTURE_DEBUG_WORLD_TOKEN,
  TEXTURE_DEBUG_ITEM_TYPES_TOKEN,
  TEXTURE_DEBUG_CONTAINER_TOKEN,
} from "./shared/global-tokens";
import { TEXTURE_DEBUG_DDUI_TOKEN } from "./ui/ui.tokens";
import { getLogSettings, TEXTURE_DEBUG_LOG_SETTINGS_TOKEN } from "./shared/logging/log-settings";
import { TextureDebugLogger } from "./shared/logging/logger";
import { TextureDebugAddOn } from "./system/texture-debug.add-on";
import {
  ActionFormData,
  ModalFormData,
  CustomForm,
  ObservableBoolean,
  ObservableNumber,
  ObservableString,
  MessageFormData,
} from "@minecraft/server-ui";

const addonContainer = container.createChildContainer();
addonContainer.registerInstance(TEXTURE_DEBUG_CONTAINER_TOKEN, addonContainer);

addonContainer.registerInstance(TEXTURE_DEBUG_DDUI_TOKEN, {
  CustomForm,
  ObservableBoolean,
  ObservableNumber,
  ObservableString,
});
addonContainer.registerInstance(TEXTURE_DEBUG_CREATE_MODAL_FORM_TOKEN, () => new ModalFormData());
addonContainer.registerInstance(TEXTURE_DEBUG_CREATE_MESSAGE_FORM_TOKEN, () => new MessageFormData());
addonContainer.registerInstance(TEXTURE_DEBUG_CREATE_ACTION_FORM_TOKEN, () => new ActionFormData());
addonContainer.registerInstance(TEXTURE_DEBUG_LOG_SETTINGS_TOKEN, getLogSettings);
addonContainer.registerInstance(TEXTURE_DEBUG_SYSTEM_TOKEN, system);
addonContainer.registerInstance(TEXTURE_DEBUG_WORLD_TOKEN, world);
addonContainer.registerInstance(TEXTURE_DEBUG_ITEM_TYPES_TOKEN, ItemTypes);

const logger = addonContainer.resolve(TextureDebugLogger);
const addon = addonContainer.resolve(TextureDebugAddOn);

logger.log("Initializing Texture Debug Add-On...");
system.beforeEvents.startup.subscribe((event) => {
  addon.startUp(event);
  system.run(() => {
    addon.run();
    logger.log("Texture Debug Add-On initialized successfully.");
  });
});
