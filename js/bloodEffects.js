// Blood effects module
import { COLORS } from './config.js';

/**
 * Initializes all blood-related graphics and particle systems
 * @param {Phaser.Scene} scene - The Phaser scene context
 * @returns {Object} Blood effect objects
 */
export function initializeBloodEffects(scene) {
    // Set up blood particles
    const bloodParticles = scene.add.particles('pixel');
    const bloodDroplets = scene.add.particles('droplet');
    
    // Create the main blood pool emitter
    const poolEmitter = bloodParticles.createEmitter({
        x: { min: 0, max: window.innerWidth },
        y: window.innerHeight,
        speed: { min: 10, max: 50 },
        angle: { min: 260, max: 280 },
        scale: { start: 2, end: 1 },
        alpha: { start: 0.8, end: 0.5 },
        tint: 0xbb0000,
        lifespan: 2000,
        quantity: 2,
        frequency: 10,
        blendMode: 'ADD'
    });
    
    // Create droplet emitter for when blood level rises
    const dropletEmitter = bloodDroplets.createEmitter({
        x: { min: 0, max: window.innerWidth },
        y: 0,
        speedY: { min: 100, max: 200 },
        speedX: { min: -20, max: 20 },
        angle: { min: 80, max: 100 },
        scale: { start: 1, end: 0.5 },
        alpha: { start: 0.8, end: 0 },
        tint: 0xaa0000,
        lifespan: { min: 1000, max: 2000 },
        quantity: 0,
        frequency: 100,
        blendMode: 'NORMAL',
        gravityY: 300
    });
    
    // Create the blood waves layers
    const bloodWaves1 = scene.add.graphics();
    const bloodWaves2 = scene.add.graphics();
    
    // Create the main blood pool
    const bloodPool = scene.add.graphics();
    
    // Create the blood shimmer effect
    const bloodShimmer = scene.add.graphics();
    
    return {
        bloodParticles,
        bloodDroplets,
        bloodWaves1,
        bloodWaves2,
        bloodPool,
        bloodShimmer,
        poolEmitter,
        dropletEmitter
    };
}

/**
 * Updates the blood visual effects based on current blood level
 * @param {Phaser.Scene} scene - The scene context
 * @param {Object} bloodEffects - Blood effect objects returned from initializeBloodEffects
 * @param {number} bloodLevel - Current blood level 
 * @param {number} previousLevel - Previous blood level
 * @param {Object} gameAreaBounds - Bounds of the game area
 */
export function updateBloodEffect(scene, bloodEffects, bloodLevel, previousLevel, gameAreaBounds) {
    const { 
        bloodWaves1, bloodWaves2, bloodPool, bloodShimmer, 
        bloodParticles, bloodDroplets 
    } = bloodEffects;
    
    const { 
        gameAreaLeft = 0, 
        gameAreaRight = window.innerWidth, 
        gameAreaBottom = window.innerHeight 
    } = gameAreaBounds || {};
    
    // If the blood level has changed significantly, emit droplets
    if (previousLevel - bloodLevel > 2) {
        emitDroplets(scene, bloodDroplets, bloodLevel, gameAreaBounds);
    }
    
    // Clear previous drawings
    bloodWaves1.clear();
    bloodWaves2.clear();
    bloodPool.clear();
    bloodShimmer.clear();
    
    // Set scroll factors
    bloodPool.setScrollFactor(0);
    bloodWaves1.setScrollFactor(0);
    bloodWaves2.setScrollFactor(0);
    bloodShimmer.setScrollFactor(0);
    
    // Draw the blood pool base layer (darker color)
    bloodPool.fillStyle(COLORS.bloodDark, 0.9);
    bloodPool.fillRect(gameAreaLeft, bloodLevel, gameAreaRight - gameAreaLeft, gameAreaBottom - bloodLevel);
    
    // Draw a second layer slightly above (mid color with some transparency)
    bloodPool.fillStyle(COLORS.bloodMid, 0.7);
    bloodPool.fillRect(gameAreaLeft, bloodLevel + 20, gameAreaRight - gameAreaLeft, gameAreaBottom - bloodLevel - 20);
    
    // Add a highlight line at the top of the blood
    bloodPool.lineStyle(2, COLORS.bloodLight, 0.7);
    bloodPool.beginPath();
    bloodPool.moveTo(gameAreaLeft, bloodLevel);
    bloodPool.lineTo(gameAreaRight, bloodLevel);
    bloodPool.strokePath();
    
    // Draw the blood waves layers within the game area boundaries
    drawWaveLayer(bloodWaves1, bloodLevel, 15, 12, COLORS.bloodMid, 0.7, scene.time.now / 1000, gameAreaLeft, gameAreaRight, gameAreaBottom);
    
    // Draw the second wave layer with different parameters for more complex effect
    drawWaveLayer(bloodWaves2, bloodLevel - 5, 8, 20, COLORS.bloodLight, 0.6, scene.time.now / 800, gameAreaLeft, gameAreaRight, gameAreaBottom);
    
    // Draw the shimmer effect
    drawShimmerEffect(bloodShimmer, bloodLevel, scene.time.now, gameAreaLeft, gameAreaRight);
    
    // Add some bubbles/particles rising from the blood (less frequent)
    if (Math.random() < 0.03) {
        // Only create particles within the game area
        const x = Phaser.Math.Between(gameAreaLeft, gameAreaRight);
        const y = Phaser.Math.Between(bloodLevel, gameAreaBottom);
        
        // Create enhanced particle emitter for bubbles
        const enhancedEmitter = bloodParticles.createEmitter({
            x: { min: 0, max: window.innerWidth },
            y: { min: 0, max: window.innerHeight },
            speed: { min: 50, max: 100 },
            scale: { start: 1, end: 0 },
            alpha: { start: 0.8, end: 0 },
            tint: [0xff0000, 0x00ff00, 0x0000ff],
            lifespan: 2000,
            quantity: 5,
            frequency: 50,
            blendMode: 'ADD'
        });
        enhancedEmitter.explode(Phaser.Math.Between(3, 8));
    }
}

/**
 * Helper function to draw a wave layer
 */
function drawWaveLayer(graphics, baseLevel, waveHeight, waveFrequency, color, alpha, timeOffset, leftX, rightX, bottomY) {
    graphics.fillStyle(color, alpha);
    
    graphics.beginPath();
    graphics.moveTo(leftX, baseLevel);
    
    for (let x = leftX; x < rightX; x += 5) {
        const y = baseLevel + Math.sin(x / waveFrequency + timeOffset) * waveHeight;
        graphics.lineTo(x, y);
    }
    
    graphics.lineTo(rightX, baseLevel);
    graphics.lineTo(rightX, bottomY);
    graphics.lineTo(leftX, bottomY);
    graphics.closePath();
    graphics.fill();
}

/**
 * Helper function to draw shimmer effect
 */
function drawShimmerEffect(graphics, baseLevel, time, leftX, rightX) {
    const shimmerTime = time / 1000;
    const width = rightX - leftX;
    
    // Draw several highlight lines that move with time
    for (let i = 0; i < 5; i++) {
        const offset = (shimmerTime * 0.5 + i * 0.2) % 1;
        const x = leftX + offset * width;
        
        graphics.lineStyle(2, 0xff3333, 0.3);
        graphics.beginPath();
        graphics.moveTo(x - 50, baseLevel + 10);
        graphics.lineTo(x + 50, baseLevel - 5);
        graphics.stroke();
    }
    
    // Add some random highlights
    for (let i = 0; i < 10; i++) {
        const x = leftX + ((shimmerTime * 0.2 + i * 0.1) % 1) * width;
        const y = baseLevel + Math.sin(x / 20 + shimmerTime) * 10;
        
        graphics.fillStyle(0xff5555, 0.2);
        graphics.fillCircle(x, y, Phaser.Math.Between(2, 5));
    }
}

/**
 * Helper function to emit droplets when blood level rises
 */
function emitDroplets(scene, emitter, level, gameAreaBounds) {
    const { gameAreaLeft = 0, gameAreaRight = window.innerWidth } = gameAreaBounds || {};
    
    // Create random droplets along the blood surface
    for (let i = 0; i < 5; i++) {
        const x = Phaser.Math.Between(gameAreaLeft, gameAreaRight);
        
        emitter.createEmitter({
            x: x,
            y: level,
            speedY: { min: -150, max: -50 },
            speedX: { min: -30, max: 30 },
            scale: { start: 0.5, end: 0.2 },
            alpha: { start: 0.8, end: 0 },
            tint: 0xbb0000,
            lifespan: { min: 500, max: 1000 },
            quantity: 1,
            frequency: -1,
            gravityY: 400
        }).explode(Phaser.Math.Between(1, 3));
    }
} 