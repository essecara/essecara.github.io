# Pandemic Game - Code Structure

This document explains the modular code structure of the Pandemic game.

## File Organization

The game code has been split into the following modules:

- **main.js** - Entry point that initializes the game and sets up the main scene.
- **config.js** - Game configuration, colors, and constants.
- **assetLoader.js** - Asset loading and management.
- **bloodEffects.js** - Blood visual effects and animations.
- **uiElements.js** - UI components including start screen, game UI, game over, and victory screens.
- **gameState.js** - Game state and logic management.

## Module Descriptions

### main.js
The main entry point that initializes the Phaser game instance and sets up the main scene. This module coordinates the setup and initialization of all other modules.

### config.js 
Contains all the game's configuration settings, including colors, game parameters, and Phaser config. Centralizing these values makes it easy to tweak game settings without digging through code.

### assetLoader.js
Handles loading of all game assets and textures. Keeps asset loading code separate from game logic.

### bloodEffects.js
Contains all the logic for creating and updating blood visual effects, including waves, shimmer effects, and particles. This module encapsulates the visually complex blood simulation.

### uiElements.js
Contains UI creation and management functions. This includes:
- Start screen with name input
- Game UI with score display
- Game over screen
- Victory screen
- Button creation and interaction

### gameState.js
Manages the game's state and progression, including:
- Blood level tracking and updates
- Score management
- Button spawning and interaction
- Game win/loss condition checks

## Flow of Execution

1. The game starts by loading main.js which sets up the Phaser game instance.
2. The main scene's preload function loads all required assets.
3. The create function initializes the game state and UI, starting with the title screen.
4. When the player clicks 'Play', the game starts and the main gameplay UI is created.
5. The update function runs every frame, updating the game state and visuals.
6. When win/loss conditions are met, the appropriate end screen is displayed.

## Extending the Game

To add new features:
- Game parameters: modify config.js
- Visual effects: modify bloodEffects.js
- UI elements: modify uiElements.js
- Game mechanics: modify gameState.js 