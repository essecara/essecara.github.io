// Game state module
import { GAME_PARAMS, DIFFICULTY_SETTINGS } from './config.js';
import { updateBloodEffect } from './bloodEffects.js';
import { createFightButton, createGameOverScreen, createVictoryScreen } from './uiElements.js';

/**
 * Creates and initializes the game state
 * @param {Phaser.Scene} scene - The Phaser scene context
 * @returns {Object} Game state object
 */
export function createGameState(scene) {
    return {
        bloodLevel: window.innerHeight * 0.9, // Start at 90% of screen height (10% from bottom)
        bloodLevelOffset: 0, // Player's impact on blood level
        previousLevel: window.innerHeight * 0.9,
        startTime: 0,
        bloodRiseSpeed: 0,
        gameStarted: false,
        playerName: '',
        score: 0,
        difficulty: 'easy', // Default difficulty
        bloodRiseOffsetConfig: DIFFICULTY_SETTINGS.easy.bloodRiseOffset, // Default value
        fightButtons: [],
        ui: null, // Will hold UI references
        bloodEffects: null, // Will hold blood effect references
        
        // Setup listeners for game events
        setupEventListeners: function() {
            // Listen for window resize
            window.addEventListener('resize', () => {
                if (this.ui && this.ui.startScreen && !this.gameStarted) {
                    this.ui.startScreen.reposition();
                }
            });
            
            // Listen for game start event
            scene.events.on('startGame', (playerName, difficulty) => {
                this.startGame(playerName, difficulty);
            });
            
            // Listen for restart game event
            scene.events.on('restartGame', () => {
                // Play button sound when restarting
                if (scene.gameState && scene.gameState.audioManager) {
                    scene.gameState.audioManager.playButtonSound();
                    scene.gameState.audioManager.playGameMusic();
                }
                this.startGame(this.playerName);
            });
        },
        
        // Start the game with the given player name and difficulty
        startGame: function(playerName, difficulty = 'easy') { // Default to easy if not provided
            this.gameStarted = true;
            this.playerName = playerName;
            this.difficulty = difficulty;
            this.bloodRiseOffsetConfig = DIFFICULTY_SETTINGS[this.difficulty].bloodRiseOffset;
            
            this.startTime = scene.time.now;
            this.score = 0;
            
            // Reset blood level to 90% of screen height
            this.bloodLevel = window.innerHeight * 0.9;
            this.bloodLevelOffset = 0;
            this.previousLevel = this.bloodLevel;
            
            // Calculate blood rise speed
            const gameAreaHeight = this.ui && this.ui.dimensions ? 
                this.ui.dimensions.gameAreaBottom - this.ui.dimensions.gameAreaTop : 
                window.innerHeight;
            this.bloodRiseSpeed = gameAreaHeight / GAME_PARAMS.riseDuration;
            
            // Clear any existing fight buttons
            this.clearFightButtons();
            
            // Update the UI score display
            this.updateScore(0);
        },
        
        // End the game with either victory or game over
        endGame: function(victory) {
            this.gameStarted = false;
            
            // Remove all fight buttons
            this.clearFightButtons();
            
            // Play appropriate sound
            if (scene.gameState && scene.gameState.audioManager) {
                if (victory) {
                    scene.gameState.audioManager.playVictorySound();
                } else {
                    scene.gameState.audioManager.playGameOverSound();
                }
            }
            
            // Show appropriate end screen
            if (victory) {
                createVictoryScreen(scene, this.score);
            } else {
                createGameOverScreen(scene, this.score);
            }
        },
        
        // Update the blood level based on elapsed time and player actions
        updateBloodLevel: function() {
            if (!this.gameStarted) return;
            
            const elapsed = scene.time.now - this.startTime;
            
            // Get gameplay area dimensions from UI if available
            const gameAreaTop = this.ui && this.ui.dimensions ? this.ui.dimensions.gameAreaTop : 0;
            const gameAreaBottom = this.ui && this.ui.dimensions ? this.ui.dimensions.gameAreaBottom : window.innerHeight;
            const gameAreaHeight = gameAreaBottom - gameAreaTop;
            
            // Calculate the current blood level based on elapsed time and rise speed
            // Blood rises from bottom to top (decreases in value)
            const timeBasedLevel = gameAreaBottom - (gameAreaHeight * 0.1) - (this.bloodRiseSpeed * elapsed);
            
            // Apply player's offset (clicks push blood back down/increase the level value)
            const targetLevel = timeBasedLevel + this.bloodLevelOffset;
            
            // Apply viscosity - blood doesn't move instantly but has some "stickiness"
            this.bloodLevel = Phaser.Math.Linear(
                this.previousLevel, 
                targetLevel, 
                GAME_PARAMS.viscosityFactor
            );
            
            // Store current level for next frame
            this.previousLevel = this.bloodLevel;
            
            // Check for win/lose conditions
            this.checkGameEndConditions();
        },
        
        // Check if the game should end due to victory or loss
        checkGameEndConditions: function() {
            if (!this.gameStarted) return;
            
            // Get gameplay area dimensions from UI if available
            const gameAreaTop = this.ui && this.ui.dimensions ? this.ui.dimensions.gameAreaTop : 0;
            const gameAreaBottom = this.ui && this.ui.dimensions ? this.ui.dimensions.gameAreaBottom : window.innerHeight;
            const gameAreaHeight = gameAreaBottom - gameAreaTop;
            
            // Blood level thresholds for victory and game over
            const victoryLevel = gameAreaBottom - (gameAreaHeight * 0.05);
            const gameOverLevel = gameAreaTop + (gameAreaHeight * 0.05);
            
            // Check if blood has reached the bottom (victory condition)
            if (this.bloodLevel >= victoryLevel) {
                this.endGame(true); // Victory
            }
            // Check if blood has reached the top (game over condition)
            else if (this.bloodLevel <= gameOverLevel) {
                this.endGame(false); // Game over
            }
        },
        
        // Update the visual blood effects
        updateBloodVisuals: function() {
            if (!this.bloodEffects) return;
            
            // Get gameplay area bounds from UI if available
            const gameAreaBounds = this.ui && this.ui.dimensions ? {
                gameAreaLeft: this.ui.dimensions.gameAreaLeft,
                gameAreaRight: this.ui.dimensions.gameAreaRight,
                gameAreaTop: this.ui.dimensions.gameAreaTop,
                gameAreaBottom: this.ui.dimensions.gameAreaBottom
            } : null;
            
            // Update the blood effect
            updateBloodEffect(
                scene, 
                this.bloodEffects,
                this.bloodLevel,
                this.previousLevel,
                gameAreaBounds
            );
        },
        
        // Update the game state each frame
        update: function() {
            // Always update the blood effect, even before the game starts
            this.updateBloodVisuals();
            
            // If the game has started, update game logic
            if (this.gameStarted) {
                this.updateBloodLevel();
                this.spawnFightButtons();
            }
        },
        
        // Spawn new fight buttons randomly 
        spawnFightButtons: function() {
            if (!this.gameStarted) return;
            
            // Generate 1-6 new buttons randomly each frame with a certain probability
            // Only generate new buttons if there are fewer than maximum on screen
            if (this.fightButtons.length < GAME_PARAMS.maxButtons && 
                Math.random() < GAME_PARAMS.buttonSpawnRate) {
                
                const maxButtonsToAdd = Math.min(6, GAME_PARAMS.maxButtons - this.fightButtons.length);
                const numButtonsToAdd = Phaser.Math.Between(1, maxButtonsToAdd);
                
                for (let i = 0; i < numButtonsToAdd; i++) {
                    this.addFightButton();
                }
            }
        },
        
        // Add a single fight button to the game
        addFightButton: function() {
            if (!this.ui || !this.ui.dimensions) return;
            
            const button = createFightButton(
                scene, 
                this.ui.dimensions, 
                this.handleButtonClick.bind(this)
            );
            
            this.fightButtons.push(button);
        },
        
        // Handle click on a fight button
        handleButtonClick: function(button) {
            // Play syringe sound
            if (scene.gameState && scene.gameState.audioManager) {
                scene.gameState.audioManager.playSyringeSound();
            }
            
            // Increase score
            this.updateScore(this.score + GAME_PARAMS.scorePerClick);
            
            // Increase the blood level offset to push blood down
            this.bloodLevelOffset += window.innerHeight * this.bloodRiseOffsetConfig;
            console.log(this.bloodRiseOffsetConfig);
            
            
            // Remove from the buttons array
            const index = this.fightButtons.indexOf(button);
            if (index > -1) {
                this.fightButtons.splice(index, 1);
            }
        },
        
        // Update the score display
        updateScore: function(newScore) {
            this.score = newScore;
            
            // Update the score display if UI is available
            if (this.ui && this.ui.scoreText) {
                this.ui.scoreText.setText(`SCORE: ${this.score}`);
            }
        },
        
        // Clear all fight buttons
        clearFightButtons: function() {
            this.fightButtons.forEach(button => {
                if (button && button.buttonElements) {
                    if (button.buttonElements.glow) {
                        button.buttonElements.glow.destroy();
                    }
                    button.destroy();
                }
            });
            
            this.fightButtons = [];
        }
    };
} 