import type { ItemComponentTypes, ItemStack, ItemTypes, Player, System, World } from "@minecraft/server";
import type { ActionFormData, MessageFormData, ModalFormData } from "@minecraft/server-ui";
import { DependencyContainer, InjectionToken } from "tsyringe";

export const TEXTURE_DEBUG_CONTAINER_TOKEN: InjectionToken<DependencyContainer> = Symbol(
  "the injection container for this add-on specifically"
);
export const TEXTURE_DEBUG_SYSTEM_TOKEN: InjectionToken<System> = Symbol("global @minecraft/server `system`");
export const TEXTURE_DEBUG_WORLD_TOKEN: InjectionToken<World> = Symbol("global @minecraft/server `world`");
export const TEXTURE_DEBUG_PLAYER_TOKEN: InjectionToken<Player> = Symbol("current @minecraft/server `Player` in scope");

export type PlayerSession = { startTick: number };
export const TEXTURE_DEBUG_PLAYER_SESSION_TOKEN: InjectionToken<PlayerSession> = Symbol(
  "information about the player's current session"
);

export const TEXTURE_DEBUG_ITEM_TYPES_TOKEN: InjectionToken<typeof ItemTypes> = Symbol(
  "ItemTypes class from @minecraft/server"
);
export const ITEM_COMPONENT_TYPES_TOKEN: InjectionToken<typeof ItemComponentTypes> = Symbol(
  "ItemComponentTypes from @minecraft/server"
);

export type CreateModalFormFn = () => ModalFormData;
export const TEXTURE_DEBUG_CREATE_MODAL_FORM_TOKEN: InjectionToken<CreateModalFormFn> =
  Symbol("modal form creation function");

export type CreateActionFormFn = () => ActionFormData;
export const TEXTURE_DEBUG_CREATE_ACTION_FORM_TOKEN: InjectionToken<CreateActionFormFn> = Symbol(
  "action form creation function"
);

export type CreateMessageFormFn = () => MessageFormData;
export const TEXTURE_DEBUG_CREATE_MESSAGE_FORM_TOKEN: InjectionToken<CreateMessageFormFn> = Symbol(
  "message form creation function"
);

export const TEXTURE_DEBUG_ITEM_STACK_TOKEN: InjectionToken<typeof ItemStack> = Symbol(
  "ItemStack class from @minecraft/server"
);
