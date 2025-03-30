// Audio manager module

/**
 * Creates and initializes the audio manager with all game sounds
 * @param {Phaser.Scene} scene - The Phaser scene context
 * @returns {Object} Audio manager object
 */
export function createAudioManager(scene) {
    // Create audio objects
    const menuMusic = scene.sound.add('bgmusic2', { loop: true, volume: 0.4 });
    const gameMusic = scene.sound.add('bgmusic1', { loop: true, volume: 0.4 });
    const gameOverSound = scene.sound.add('game-over', { loop: false, volume: 0.5 });
    const victorySound = scene.sound.add('victory', { loop: false, volume: 0.5 });
    const buttonSound = scene.sound.add('game-snare', { loop: false, volume: 0.4 });
    const syringeSound = scene.sound.add('syringe', { loop: false, volume: 0.3 });
    
    return {
        currentMusic: null,
        
        // Play menu music (initial screen)
        playMenuMusic: function() {
            // Stop any currently playing music
            if (this.currentMusic) {
                this.currentMusic.stop();
            }
            
            // Play and store reference to menu music
            menuMusic.play();
            this.currentMusic = menuMusic;
        },
        
        // Play game music (during gameplay)
        playGameMusic: function() {
            // Stop any currently playing music
            if (this.currentMusic) {
                this.currentMusic.stop();
            }
            
            // Play and store reference to game music
            gameMusic.play();
            this.currentMusic = gameMusic;
        },
        
        // Play game over sound
        playGameOverSound: function() {
            // Stop any currently playing music
            if (this.currentMusic) {
                this.currentMusic.stop();
            }
            
            // Play game over sound
            gameOverSound.play();
        },
        
        // Play victory sound
        playVictorySound: function() {
            // Stop any currently playing music
            if (this.currentMusic) {
                this.currentMusic.stop();
            }
            
            // Play victory sound
            victorySound.play();
        },
        
        // Play button sound (for start, replay buttons)
        playButtonSound: function() {
            buttonSound.play();
        },
        
        // Play syringe sound
        playSyringeSound: function() {
            syringeSound.play();
        },
        
        // Stop all sounds
        stopAll: function() {
            menuMusic.stop();
            gameMusic.stop();
            
            // Set current music to null
            this.currentMusic = null;
        }
    };
} 