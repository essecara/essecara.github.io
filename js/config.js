// Game configuration and constants

// Define a consistent color palette for the game
export const COLORS = {
    background: 0x120808,
    bloodDark: 0x880000,
    bloodMid: 0xaa0000,
    bloodLight: 0xcc0000,
    buttonIdle: 0x006640,
    buttonHover: 0x008855,
    buttonActive: 0x004430,
    buttonGlow: 0x00bb77,
    uiFrame: 0x220000,
    uiHighlight: 0xff5533,
    textLight: 0xffeedd
};

// Game parameters
export const GAME_PARAMS = {
    riseDuration: 30000, // 30 seconds to rise to the top
    viscosityFactor: 0.05, // Controls how "sticky" the blood appears
    playAreaPadding: 20, // Padding around the game area
    topBarHeight: 60, // Top UI bar height
    maxButtons: 12, // Maximum number of syringe buttons on screen
    buttonSpawnRate: 0.1, // Probability of spawning new buttons each frame
    bloodRiseOffset: 0.04, // % of screen height to push blood down per click
    scorePerClick: 12, // Score gained per syringe click
};

// Difficulty Settings
export const DIFFICULTY_SETTINGS = {
    easy: { bloodRiseOffset: 0.04 },
    medium: { bloodRiseOffset: 0.03 },
    hard: { bloodRiseOffset: 0.02 }
};

// Phaser game configuration
export const PHASER_CONFIG = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#000000',
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    dom: {
        createContainer: true
    }
}; 