# Texture Debug

A Minecraft Bedrock add-on for debugging textures.

![Texture Debug](docs/images/texture_debug.png)

## Features

- **Texture ID Browser**: Browse and inspect texture IDs with visual feedback
- **Debug Settings**: Configurable debug options including logging levels

## Requirements

- Minecraft Bedrock Edition (version 1.26.30 or higher)

## Installation

1. Download the `.mcaddon` file from CurseForge
2. Open it with Minecraft Bedrock or extract and install packs in your installation folder
3. Create or edit a world
4. Enable the add-on's resource pack either at the world level or the global level (enabling the resource pack should automatically enable the behavior pack, but double check just to make sure).

## Usage

### Texture Browser

Use the `/__debug_texture_ids` command in-game to access the texture browser. Requires admin privileges on the world.

Browse available textures and view their IDs for reference when creating add-ons.

### Texture Debug Settings

You can configure the range of integers rendered, as well as the
custom add-on items count to make the item descriptions line up. Use the settings button at the top of the texture browser to configure them.

![Debug Settings](docs/images/settings_count.png)
![Settings Range](docs/images/settings_range.png)

## Troubleshooting

**Command not found**: Make sure the add-on is properly enabled in your world settings, and that you are at least Game Director permission level.

## Support

If you encounter issues, please report them on the CurseForge or GitHub page.

## License

MIT License - See [LICENSE](LICENSE) for details.

---

_For developers interested in the source code, see [Development.md](Development.md)._
