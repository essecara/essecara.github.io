// Main entry point for the Pandemic game
import { PHASER_CONFIG } from './config.js';
import { preloadAssets } from './assetLoader.js';
import { initializeBloodEffects } from './bloodEffects.js';
import { createStartScreen, createGameUI } from './uiElements.js';
import { createGameState } from './gameState.js';
import { createAudioManager } from './audioManager.js';

// Create the Phaser game instance
const gameConfig = {
    ...PHASER_CONFIG,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Initialize the game
const game = new Phaser.Game(gameConfig);

// Preload assets
function preload() {
    // Load all game assets
    preloadAssets(this);
}

// Create game objects and setup
function create() {
    // Create the game state object
    this.gameState = createGameState(this);
    
    // Initialize blood effects
    this.gameState.bloodEffects = initializeBloodEffects(this);
    
    // Initialize audio manager
    this.gameState.audioManager = createAudioManager(this);
    
    // Create the start screen
    this.gameState.ui = {
        startScreen: createStartScreen(this)
    };
    
    // Start playing menu music
    this.gameState.audioManager.playMenuMusic();
    
    // Record the start time
    this.gameState.startTime = this.time.now;
    
    // Setup listeners for game events
    this.gameState.setupEventListeners();
    
    // Listen for the startGame event
    this.events.on('startGame', (playerName, difficulty) => {
        // Play the button sound
        this.gameState.audioManager.playButtonSound();
        
        // Switch to game music
        this.gameState.audioManager.playGameMusic();
        
        // Start the game state with selected difficulty
        this.gameState.startGame(playerName, difficulty);
        
        // Create game UI
        const gameUI = createGameUI(this, playerName);
        
        // Store UI references
        this.gameState.ui = {
            ...gameUI
        };
    });
    
    // Make the game responsive
    window.addEventListener('resize', () => {
        game.scale.resize(window.innerWidth, window.innerHeight);
    });
}

// Update game state
function update() {
    // Update the game state
    if (this.gameState) {
        this.gameState.update();
    }
} 