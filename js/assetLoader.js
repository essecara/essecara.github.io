// Asset loader module

/**
 * Loads all game assets and prepares them for use
 * @param {Phaser.Scene} scene - The Phaser scene context
 */
export function preloadAssets(scene) {
    // Load a simple white pixel that we'll tint red for the blood effect
    scene.textures.addBase64('pixel', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==');
    
    // Load blood droplet texture
    scene.textures.addBase64('droplet', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFHGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTktMDEtMzFUMTk6NTU6MDgrMDE6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE5LTAxLTMxVDE5OjU4OjQyKzAxOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE5LTAxLTMxVDE5OjU4OjQyKzAxOjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmIzMzBlMWI0LTk5ZDctNGU2NS05MGQ2LTNmYjFiYmE2ZTE0MCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpiMzMwZTFiNC05OWQ3LTRlNjUtOTBkNi0zZmIxYmJhNmUxNDAiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpiMzMwZTFiNC05OWQ3LTRlNjUtOTBkNi0zZmIxYmJhNmUxNDAiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmIzMzBlMWI0LTk5ZDctNGU2NS05MGQ2LTNmYjFiYmE2ZTE0MCIgc3RFdnQ6d2hlbj0iMjAxOS0wMS0zMVQxOTo1NTowOCswMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKE1hY2ludG9zaCkiLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+wGOOvQAAAIJJREFUCJlFzbENQjEQRNHnOUdEDhE0QAkUQh1UQB9UQheEFEBCJI5gExxCBvuX9qVdaWY1b5SmqprSilhjtGBrjDHADvbujqoKSJKkpKq4O2ZGjJGIwMwWdisz2yVJIElm9vP9zN2JCNwdSQDspmx+PXCSU4AkufulPJJ0k1z+/tF/MR/KbNXy1S4AAAAASUVORK5CYII=');
    
    // Load the syringe SVG
    scene.load.svg('syringe', 'assets/images/syringe.svg');
    
    // Load audio assets
    scene.load.audio('bgmusic2', 'assets/audio/bgmusic2.wav');
    scene.load.audio('bgmusic1', 'assets/audio/bgmusic1.mp3');
    scene.load.audio('game-over', 'assets/audio/game-over.wav');
    scene.load.audio('game-snare', 'assets/audio/game-snare.wav');
    scene.load.audio('syringe', 'assets/audio/syringe.wav');
    scene.load.audio('victory', 'assets/audio/victory.mp3');
}

/**
 * Creates HTML elements for the start screen
 * @param {Phaser.Scene} scene - The Phaser scene context 
 * @returns {Object} - The created DOM element
 */
export function createDOMElements(scene) {
    // This would be called only once at the beginning to create DOM elements
    // that the game will use (like the start screen input field)
    
    // Add code here if needed to create additional DOM elements
} 