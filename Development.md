# Development Guide

This document contains technical details for developers who want to work with or extend Texture Debug.

## Project Overview

Texture Debug is a Minecraft Bedrock add-on for debugging textures. It provides in-game utilities for inspecting texture IDs, item visualizations, and testing add-on configurations.

## Tech Stack

- **TypeScript** - Primary language
- **tsyringe** - Dependency injection
- **@minecraft/server** - Minecraft Bedrock API (v2.8.0)
- **@minecraft/server-ui** - Minecraft UI forms API (v2.1.0)
- **@minecraft/vanilla-data** - Minecraft vanilla data (v1.26.30)
- **Vitest** - Testing framework
- **Just Scripts** - Build tooling
- **esbuild** - Bundling

## Project Structure

```
texture_debug/
├── behavior_packs/          # Minecraft behavior pack files
│   └── texture-debug/
│       ├── manifest.json    # Behavior pack manifest
│       └── pack_icon.png   # Pack icon
├── resource_packs/          # Minecraft resource pack files
│   └── texture-debug/
│       ├── manifest.json    # Resource pack manifest
│       ├── textures/        # Texture files
│       └── ui/             # UI definitions
├── scripts/                 # TypeScript source code
│   ├── debug/              # Debug utilities and registration
│   ├── modals/             # UI modal implementations
│   │   ├── custom-data-form/
│   │   ├── texture-ids-modal.ts
│   │   ├── texture-ids-settings.modal.ts
│   │   └── item-texture.ts
│   ├── shared/             # Shared utilities and services
│   │   ├── logging/        # Logger and log settings
│   │   ├── storage.ts      # World storage wrapper
│   │   ├── global-tokens.ts # Dependency injection tokens
│   │   └── ...
│   ├── system/             # Core add-on system
│   │   ├── texture-debug.add-on.ts
│   │   ├── command-manager.ts
│   │   └── debug-commands/
│   ├── ui/                 # UI components and tokens
│   ├── data/               # Static data files
│   └── main.ts             # Entry point
├── dist/                   # Compiled output
├── docs/                   # Documentation and images
├── just.config.ts          # Build configuration
└── package.json
```

## Architecture

### Dependency Injection

The add-on uses [tsyringe](https://github.com/microsoft/tsyringe) for dependency injection:

```typescript
@scoped(Lifecycle.ContainerScoped)
export class TextureDebugAddOn {
  constructor(
    @inject(TextureDebugCommandManager) private commandManager: TextureDebugCommandManager,
    @inject(TextureDebugWorldStorage) private readonly worldStorage: TextureDebugWorldStorage
  ) {}
}
```

### Core Components

- **TextureDebugAddOn** - Main add-on class, coordinates startup
- **TextureDebugCommandManager** - Registers and manages chat commands
- **TextureDebugLogger** - Logging service with configurable levels
- **TextureDebugWorldStorage** - Persistent storage via Minecraft world properties

### UI System

Uses Minecraft's form APIs:

- `ModalFormData` - Modal form submissions
- `ActionFormData` - Action button forms
- `MessageFormData` - Message display forms
- `CustomForm` - Custom form with Observable types

## Building

### Prerequisites

- Node.js (v18+)
- npm

### Install Dependencies

```bash
npm install
```

### Build Commands

| Command                      | Description                       |
| ---------------------------- | --------------------------------- |
| `npm run build`              | Build the project                 |
| `npm run watch`              | Watch mode with auto-deploy       |
| `npm run watch:deploy`       | Watch mode for deployment only    |
| `npm run watch:test`         | Watch mode for tests only         |
| `npm run lint`               | Run ESLint                        |
| `npm run test`               | Run tests                         |
| `npm run clean`              | Clean build artifacts             |
| `npm run mcaddon`            | Create .mcaddon package           |
| `npm run mcaddon:production` | Create production .mcaddon        |
| `npm run local-deploy`       | Deploy to local development world |

### Build Output

- `dist/scripts/main.js` - Bundled script entry
- `dist/packages/` - Generated .mcaddon files and world pack manifests

## Testing

Tests are run with Vitest:

```bash
npm run test        # Run tests once
npm run watch:test  # Watch mode for tests
```

## Local Deployment

To deploy to a local Minecraft development world:

1. Run `npm run local-deploy`
2. Open Minecraft with a local world
3. The add-on will be automatically loaded

### Windows Loopback Exemption

If deploying to Minecraft Preview on Windows, you may need to enable loopback:

```bash
npm run enablemcpreviewloopback
```

## Creating Release Packages

```bash
npm run mcaddon:production
```

This creates a versioned `.mcaddon` file in `dist/packages/`.

## License

MIT License - See [LICENSE](../LICENSE) for details.
