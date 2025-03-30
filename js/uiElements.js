// UI Elements module
import { COLORS, GAME_PARAMS, DIFFICULTY_SETTINGS } from './config.js';

/**
 * Creates the game start screen with title, input field, and play button
 * @param {Phaser.Scene} scene - The Phaser scene context
 * @returns {Object} Start screen elements 
 */
export function createStartScreen(scene) {
    // Create a transparent overlay for the start screen
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const width = Math.min(500, window.innerWidth * 0.8);
    const height = 350;
    
    // Create a dark background overlay
    const bgOverlay = scene.add.rectangle(
        window.innerWidth / 2,
        window.innerHeight / 2,
        window.innerWidth,
        window.innerHeight,
        0x000000,
        0.6
    );
    
    // Make the panel more futuristic with neon green border
    const panel = scene.add.rectangle(centerX, centerY, width, height, 0x001500, 0.7);
    panel.setStrokeStyle(3, 0x00ff00, 0.8);
    // Add rounded corners
    panel.setInteractive();
    
    // Create a neon glow effect around the panel
    const panelGlow = scene.add.rectangle(centerX, centerY, width + 15, height + 15, 0x00ff00, 0.2);
    panelGlow.setInteractive();
    
    // Animate panel with fade-in effect
    scene.tweens.add({
        targets: [panel, panelGlow],
        alpha: { from: 0, to: panel.alpha },
        duration: 1000,
        ease: 'Power2'
    });
    
    // Subtle pulse animation for the glow
    scene.tweens.add({
        targets: panelGlow,
        alpha: 0.3,
        duration: 1500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
    });
    
    // Add the title with horror style and blood drips
    const title = scene.add.text(centerX, centerY - 120, 'Pandemic!', {
        fontFamily: 'Nosifer, cursive',
        fontSize: '48px',
        color: '#ff0000',
        fontStyle: 'bold',
        stroke: '#880000',
        strokeThickness: 6,
        shadow: {
            offsetX: 2,
            offsetY: 2,
            color: '#000',
            blur: 5,
            stroke: true,
            fill: true
        }
    }).setOrigin(0.5);
    
    // Add Twitter button beneath the title
    const twitterButton = scene.add.dom(centerX + width/2 - 60, centerY + height/2 - 20)
        .createFromHTML('<a href="https://twitter.com/intent/tweet?screen_name=peeterc&ref_src=twsrc%5Etfw" class="twitter-mention-button" data-show-count="false" style="color: white; font-size: 14px;">Tweet to @peeterc</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>');
    twitterButton.setAlpha(0);
    scene.tweens.add({
        targets: twitterButton,
        alpha: 1,
        duration: 1000,
        ease: 'Power2',
        delay: 1200
    });
    
    // Animate the title
    title.setAlpha(0);
    title.setScale(0.5);
    scene.tweens.add({
        targets: title,
        alpha: 1,
        scale: 1,
        duration: 1000,
        ease: 'Back.out',
        delay: 500
    });
    
    // Add a subtle pulse animation to the title
    scene.tweens.add({
        targets: title,
        scale: 1.05,
        duration: 1500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: 1500
    });
    
    // Add blood drips from the title
    const dripsCount = 5;
    const drips = [];
    
    const createDrips = () => {
        // Clear any existing drips
        drips.forEach(drip => drip.destroy());
        drips.length = 0;
        
        // Create new drips only if the panel is visible
        if (panel.visible) {
            for (let i = 0; i < dripsCount; i++) {
                const x = centerX - title.width/3 + (title.width/2 / (dripsCount-1)) * i;
                const height = Phaser.Math.Between(20, 40);
                const drip = scene.add.rectangle(x, centerY - 90, 4, 0, 0xaa0000, 0.8);
                
                // Animate the drip growing downward
                scene.tweens.add({
                    targets: drip,
                    height: height,
                    duration: 1000 + Phaser.Math.Between(0, 1000),
                    ease: 'Power2',
                    delay: i * 200
                });
                
                drips.push(drip);
            }
        }
    };
    
    // Create the initial drips
    scene.time.delayedCall(1500, createDrips);
    
    // Function to periodically add a random drip
    const addRandomDrip = () => {
        if (scene.gameState && !scene.gameState.gameStarted && title.text === 'Pandemic!' && panel.visible) {
            const offset = Phaser.Math.Between(-title.width/3, title.width/3);
            const x = centerX + offset;
            const dripHeight = Phaser.Math.Between(15, 30);
            const drip = scene.add.rectangle(x, centerY - 90, 3, 0, 0xdd0000, 0.7);
            
            // Animate the drip growing downward
            scene.tweens.add({
                targets: drip,
                height: dripHeight,
                duration: 1500,
                ease: 'Power2',
                onComplete: () => {
                    // Create a small blood splatter at the bottom of the drip
                    const splatterSize = Phaser.Math.Between(5, 8);
                    const splatter = scene.add.circle(x, centerY - 90 + dripHeight, splatterSize, 0xaa0000, 0.6);
                    
                    // Animate the splatter fading out
                    scene.tweens.add({
                        targets: [drip, splatter],
                        alpha: 0,
                        duration: 1000,
                        ease: 'Power2',
                        onComplete: () => {
                            drip.destroy();
                            splatter.destroy();
                        }
                    });
                }
            });
            
            drips.push(drip);
            
            // Schedule the next random drip
            scene.time.delayedCall(Phaser.Math.Between(3000, 6000), addRandomDrip);
        }
    };
    
    // Start the random drip effect after a delay
    scene.time.delayedCall(4000, addRandomDrip);
    
    // Create input field with fade-in animation
    const inputField = scene.add.dom(centerX, centerY - 40).createFromCache('startScreen');
    inputField.setAlpha(0);
    scene.tweens.add({
        targets: inputField,
        alpha: 1,
        duration: 1000,
        ease: 'Power2',
        delay: 800
    });
    
    // Create difficulty selection radio buttons
    const difficultyOptionsHTML = `
        <div id="difficulty-options" style="text-align: center; margin-top: 20px;">
            <label style="color: #00ff00; margin-right: 15px;">
                <input type="radio" name="difficulty" value="easy" checked> Easy
            </label>
            <label style="color: #00ff00; margin-right: 15px;">
                <input type="radio" name="difficulty" value="medium"> Medium
            </label>
            <label style="color: #00ff00;">
                <input type="radio" name="difficulty" value="hard"> Hard
            </label>
        </div>
    `;
    const difficultySelector = scene.add.dom(centerX, centerY - 15).createFromHTML(difficultyOptionsHTML);
    difficultySelector.setAlpha(0);
     scene.tweens.add({
        targets: difficultySelector,
        alpha: 1,
        duration: 1000,
        ease: 'Power2',
        delay: 900 // Delay slightly after input field
    });
    
    // Create Credits button
    const createButton = (x, y, text) => {
        const buttonWidth = 150;
        const buttonHeight = 40;
        const buttonGlow = scene.add.rectangle(x, y, buttonWidth + 10, buttonHeight + 10, 0x00ff00, 0.2);
        const button = scene.add.rectangle(x, y, buttonWidth, buttonHeight, 0x003300);
        button.setStrokeStyle(2, 0x00ff00, 1);
        
        const buttonText = scene.add.text(x, y, text, {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: '#ffffff',
            fontStyle: 'bold',
            shadow: {
                offsetX: 1,
                offsetY: 1,
                color: '#000',
                blur: 2,
                stroke: true,
                fill: true
            }
        }).setOrigin(0.5);
        
        // Animate the button
        button.setAlpha(0);
        buttonText.setAlpha(0);
        buttonGlow.setAlpha(0);
        
        scene.tweens.add({
            targets: [button, buttonText],
            alpha: 1,
            duration: 1000,
            ease: 'Power2',
            delay: 1000
        });
        
        scene.tweens.add({
            targets: buttonGlow,
            alpha: 0.2,
            duration: 1000,
            ease: 'Power2',
            delay: 1200
        });
        
        // Make the button interactive
        button.setInteractive();
        button.on('pointerover', () => {
            button.fillColor = 0x005500;
            buttonGlow.alpha = 0.4;
        });
        button.on('pointerout', () => {
            button.fillColor = 0x003300;
            buttonGlow.alpha = 0.2;
        });
        
        return { button, buttonText, buttonGlow };
    };
    
    // Create Credits button
    const creditsButtonObj = createButton(centerX - 85, centerY + 40, 'Credits Page');
    
    // Create Sponsors button
    const sponsorsButtonObj = createButton(centerX + 85, centerY + 40, 'Sponsors');
    
    // Create play button
    const playButtonObj = createButton(centerX, centerY + 75, 'Play');
    
    // Add pulse animation to the play button
    scene.tweens.add({
        targets: [playButtonObj.button, playButtonObj.buttonGlow, playButtonObj.buttonText],
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: 2000
    });
    
    // Create an overlay for the credits content that can be clicked to go back
    const createContentOverlay = (contentName, content) => {
        // Create a background that can be clicked to return
        const overlayBg = scene.add.rectangle(
            centerX, 
            centerY, 
            width, 
            height, 
            0x000000, 
            0
        );
        overlayBg.setInteractive();
        
        // Create container for the content
        const container = scene.add.container(centerX, centerY);
        
        // Add title
        const title = scene.add.text(0, -120, contentName, {
            fontFamily: 'Arial',
            fontSize: '28px',
            color: '#00ff00',
            fontStyle: 'bold',
            align: 'center',
            stroke: '#003300',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Add content text
        const contentText = scene.add.text(0, 0, content, {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: width - 80 }
        }).setOrigin(0.5);
        
        // Adjust positioning based on content height
        const contentHeight = contentText.height;
        // If content is too tall, adjust the panel height and container position
        const minHeight = height;
        const adjustedHeight = Math.max(minHeight, contentHeight + 280); // 280 is space for title + buttons + padding
        
        // Center the content vertically
        contentText.setPosition(0, (adjustedHeight - minHeight) / 4);
        
        // Add back button
        const backButtonWidth = 150;
        const backButtonHeight = 40;
        const backButtonGlow = scene.add.rectangle(
            -80, 
            adjustedHeight / 2 - 60, 
            backButtonWidth + 10, 
            backButtonHeight + 10, 
            0x00ff00, 
            0.2
        );
        const backButton = scene.add.rectangle(
            -80, 
            adjustedHeight / 2 - 60, 
            backButtonWidth, 
            backButtonHeight, 
            0x003300
        );
        backButton.setStrokeStyle(2, 0x00ff00, 1);
        
        const backText = scene.add.text(
            -80, 
            adjustedHeight / 2 - 60, 
            'Back to Main Menu', 
            {
                fontFamily: 'Arial',
                fontSize: '16px',
                color: '#ffffff',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5);
        
        // Make back button interactive
        backButton.setInteractive();
        backButton.on('pointerover', () => {
            backButton.fillColor = 0x005500;
            backButtonGlow.alpha = 0.4;
        });
        backButton.on('pointerout', () => {
            backButton.fillColor = 0x003300;
            backButtonGlow.alpha = 0.2;
        });
        
        // Optional Stripe link button (will be added for sponsors only)
        let stripeButton, stripeButtonGlow, stripeText;
        
        // Add components to container
        const containerElements = [title, contentText, backButton, backButtonGlow, backText];
        container.add(containerElements);
        
        // Set initial visibility
        container.setAlpha(0);
        container.setVisible(false);
        overlayBg.setAlpha(0);
        overlayBg.setVisible(false);
        
        // Return the created elements with adjusted size panel
        return {
            container,
            overlayBg,
            backButton,
            adjustedHeight,
            containerElements,
            
            // Method to add Stripe button
            addStripeButton: function() {
                const stripeButtonWidth = 150;
                const stripeButtonHeight = 40;
                stripeButtonGlow = scene.add.rectangle(
                    80, 
                    adjustedHeight / 2 - 60, 
                    stripeButtonWidth + 10, 
                    stripeButtonHeight + 10, 
                    0x00ff00, 
                    0.2
                );
                stripeButton = scene.add.rectangle(
                    80, 
                    adjustedHeight / 2 - 60, 
                    stripeButtonWidth, 
                    stripeButtonHeight, 
                    0x003300
                );
                stripeButton.setStrokeStyle(2, 0x00ff00, 1);
                
                stripeText = scene.add.text(
                    80, 
                    adjustedHeight / 2 - 60, 
                    'Sponsor me', 
                    {
                        fontFamily: 'Arial',
                        fontSize: '16px',
                        color: '#ffffff',
                        fontStyle: 'bold'
                    }
                ).setOrigin(0.5);
                
                // Make stripe button interactive
                stripeButton.setInteractive();
                stripeButton.on('pointerover', () => {
                    stripeButton.fillColor = 0x005500;
                    stripeButtonGlow.alpha = 0.4;
                });
                stripeButton.on('pointerout', () => {
                    stripeButton.fillColor = 0x003300;
                    stripeButtonGlow.alpha = 0.2;
                });
                stripeButton.on('pointerup', () => {
                    // Open Stripe website in a new tab
                    window.open('https://buy.stripe.com/8wMcO6akS9k0eOs3cg', '_blank');
                });
                
                // Add to container and elements list
                container.add([stripeButton, stripeButtonGlow, stripeText]);
                this.containerElements.push(stripeButton, stripeButtonGlow, stripeText);
            },
            
            show: () => {
                container.setVisible(true);
                overlayBg.setVisible(true);
                
                // Adjust the panel size based on content
                panel.setSize(width, adjustedHeight);
                panelGlow.setSize(width + 15, adjustedHeight + 15);
                
                scene.tweens.add({
                    targets: [container, overlayBg],
                    alpha: 1,
                    duration: 500,
                    ease: 'Power2'
                });
            },
            hide: () => {
                scene.tweens.add({
                    targets: [container, overlayBg],
                    alpha: 0,
                    duration: 500,
                    ease: 'Power2',
                    onComplete: () => {
                        container.setVisible(false);
                        overlayBg.setVisible(false);
                        
                        // Reset panel size to original
                        panel.setSize(width, height);
                        panelGlow.setSize(width + 15, height + 15);
                    }
                });
            }
        };
    };
    
    // Create credits content
    const creditsText = 
        'Game developed by: @peeterc\n\n' +
        'Music by: Electronic Symphony Team\n\n' +
        'Sound Effects: Pandemic Audio Labs\n\n' +
        'Additional Programming: AI Assistants Inc.\n\n' +
        'Quality Testing: Virus Hunters Group\n\n' +
        '© 2023 Pandemic Game Studios \n\n' +
        '(all assets have permissive licensing and are from freesound.org opengameart.org/)';
    
    const creditsScreen = createContentOverlay('', creditsText);
    
    // Create sponsors content
    const sponsorsText = 
        'Special thanks to GreenVirus Labs for their support!\n\n' +
        'Outbreak Management Corporation\n\n' +
        'Infection Control Systems Inc.\n\n' +
        'Vector Transmission Technologies\n\n' +
        'Global Pandemic Response Team\n\n' +
        'Biomedical Virtual Reality Group';
    
    const sponsorsScreen = createContentOverlay('', sponsorsText);
    
    // Add Stripe button to sponsors screen
    sponsorsScreen.addStripeButton();
    
    // Function to show content overlay
    const showContent = (contentOverlay, sectionName) => {
        // Hide main elements
        inputField.setVisible(false);
        twitterButton.setVisible(false);
        creditsButtonObj.button.setVisible(false);
        creditsButtonObj.buttonText.setVisible(false);
        creditsButtonObj.buttonGlow.setVisible(false);
        sponsorsButtonObj.button.setVisible(false);
        sponsorsButtonObj.buttonText.setVisible(false);
        sponsorsButtonObj.buttonGlow.setVisible(false);
        playButtonObj.button.setVisible(false);
        playButtonObj.buttonText.setVisible(false);
        playButtonObj.buttonGlow.setVisible(false);
        
        // Update the title to show the section name if provided
        if (sectionName) {
            title.setText(sectionName);
            title.setStyle({
                fontFamily: 'Arial, sans-serif',
                fontSize: '42px',
                color: '#00ff00',
                fontStyle: 'bold',
                stroke: '#003300',
                strokeThickness: 4,
                shadow: {
                    offsetX: 0,
                    offsetY: 0,
                    color: '#00ff00',
                    blur: 10,
                    stroke: true,
                    fill: true
                }
            });
        }
        
        // Remove blood drips when showing section
        drips.forEach(drip => {
            if (drip && drip.active) {
                scene.tweens.add({
                    targets: drip,
                    alpha: 0,
                    duration: 300,
                    ease: 'Power2',
                    onComplete: () => {
                        drip.destroy();
                    }
                });
            }
        });
        drips.length = 0;
        
        // Show the content overlay
        contentOverlay.show();
    };
    
    // Function to hide content and show main menu
    const hideContent = () => {
        // Hide any visible content
        if (creditsScreen.container.visible) {
            creditsScreen.hide();
        }
        if (sponsorsScreen.container.visible) {
            sponsorsScreen.hide();
        }
        
        // Restore the title to "Pandemic!" with horror style
        title.setText('Pandemic!');
        title.setStyle({
            fontFamily: 'Nosifer, cursive',
            fontSize: '48px',
            color: '#ff0000',
            fontStyle: 'bold',
            stroke: '#880000',
            strokeThickness: 6,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000',
                blur: 5,
                stroke: true,
                fill: true
            }
        });
        
        // Recreate the blood drips
        createDrips();
        
        // Show main elements
        inputField.setVisible(true);
        twitterButton.setVisible(true);
        creditsButtonObj.button.setVisible(true);
        creditsButtonObj.buttonText.setVisible(true);
        creditsButtonObj.buttonGlow.setVisible(true);
        sponsorsButtonObj.button.setVisible(true);
        sponsorsButtonObj.buttonText.setVisible(true);
        sponsorsButtonObj.buttonGlow.setVisible(true);
        playButtonObj.button.setVisible(true);
        playButtonObj.buttonText.setVisible(true);
        playButtonObj.buttonGlow.setVisible(true);
    };
    
    // Set up back button handlers
    creditsScreen.backButton.on('pointerup', hideContent);
    sponsorsScreen.backButton.on('pointerup', hideContent);
    
    // Set up Credits button click handler
    creditsButtonObj.button.on('pointerup', () => {
        showContent(creditsScreen, 'Credits');
    });
    
    // Set up Sponsors button click handler
    sponsorsButtonObj.button.on('pointerup', () => {
        showContent(sponsorsScreen, 'Sponsors');
    });
    
    // Set up Play button click handler
    playButtonObj.button.on('pointerup', () => {
        const nameInput = inputField.getChildByName('playerName');
        const playerName = nameInput ? nameInput.value.trim() || 'Player' : 'Player';

        const selectedDifficultyInput = difficultySelector.node.querySelector('input[name="difficulty"]:checked');
        const selectedDifficulty = selectedDifficultyInput ? selectedDifficultyInput.value : 'easy'; // Default to easy
        
        console.log(`Starting game for ${playerName} on ${selectedDifficulty}`); // Debug log

        // Play button sound
        if (scene.gameState && scene.gameState.audioManager) {
            scene.gameState.audioManager.playButtonSound();
        }

        // Emit startGame event with player name and difficulty
        scene.events.emit('startGame', playerName, selectedDifficulty);

        // Hide start screen elements with fade-out animation
        const elementsToHide = [
            panel, panelGlow, bgOverlay,
            creditsButtonObj.button, creditsButtonObj.buttonText, creditsButtonObj.buttonGlow,
            sponsorsButtonObj.button, sponsorsButtonObj.buttonText, sponsorsButtonObj.buttonGlow,
            playButtonObj.button, playButtonObj.buttonText, playButtonObj.buttonGlow,
            twitterButton,
            creditsScreen.container, creditsScreen.overlayBg,
            sponsorsScreen.container, sponsorsScreen.overlayBg
        ];
        scene.tweens.add({
            targets: [...elementsToHide, inputField, difficultySelector, title, ...drips],
            alpha: 0,
            duration: 500,
            ease: 'Power1',
            onComplete: () => {
                // Actually remove elements after fade out
                elementsToHide.forEach(el => { if (el) el.destroy(); });
                if (inputField) inputField.destroy();
                if (difficultySelector) difficultySelector.destroy();
                if (title) title.destroy();
                drips.forEach(drip => { if (drip) drip.destroy(); });
                
                // Mark start screen as removed
                //startScreenElements.visible = false;
                
                // Stop random drips if they are running
                scene.time.removeAllEvents(); 
                
                // Stop title pulse animation
                scene.tweens.killTweensOf(title); 
                scene.tweens.killTweensOf(panelGlow);
            }
        });
    });
    
    // Store references to the start screen elements
    const startScreen = {
        bgOverlay,
        panel,
        panelGlow,
        title,
        inputField,
        twitterButton,
        playButton: playButtonObj.button,
        playText: playButtonObj.buttonText,
        playButtonGlow: playButtonObj.buttonGlow,
        creditsButton: creditsButtonObj.button,
        creditsText: creditsButtonObj.buttonText,
        creditsButtonGlow: creditsButtonObj.buttonGlow,
        sponsorsButton: sponsorsButtonObj.button,
        sponsorsText: sponsorsButtonObj.buttonText,
        sponsorsButtonGlow: sponsorsButtonObj.buttonGlow,
        creditsScreen,
        sponsorsScreen,
        drips,
        
        // Add repositioning method
        reposition: function() {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const width = Math.min(500, window.innerWidth * 0.8);
            const height = 350;
            
            this.panel.setPosition(centerX, centerY);
            this.panel.setSize(width, height);
            this.panelGlow.setPosition(centerX, centerY);
            this.panelGlow.setSize(width + 15, height + 15);
            this.title.setPosition(centerX, centerY - 120);
            this.twitterButton.setPosition(centerX - width/2 + 20, centerY + height/2 - 20);
            this.inputField.setPosition(centerX, centerY - 40);
            this.difficultySelector.setPosition(centerX, centerY - 5);
            this.playButton.setPosition(centerX, centerY + 75);
            this.playText.setPosition(centerX, centerY + 75);
            this.playButtonGlow.setPosition(centerX, centerY + 75);
            this.creditsButton.setPosition(centerX - 85, centerY + 40);
            this.creditsText.setPosition(centerX - 85, centerY + 40);
            this.creditsButtonGlow.setPosition(centerX - 85, centerY + 40);
            this.sponsorsButton.setPosition(centerX + 85, centerY + 40);
            this.sponsorsText.setPosition(centerX + 85, centerY + 40);
            this.sponsorsButtonGlow.setPosition(centerX + 85, centerY + 40);
            this.creditsScreen.container.setPosition(centerX, centerY);
            this.sponsorsScreen.container.setPosition(centerX, centerY);
            
            // Reposition any active drips
            if (this.title.text === 'Pandemic!') {
                createDrips();
            }
        }
    };
    
    return startScreen;
}

/**
 * Creates the in-game UI elements when the game starts
 * @param {Phaser.Scene} scene - The Phaser scene context
 * @param {string} playerName - The player's name
 * @returns {Object} Game UI elements
 */
export function createGameUI(scene, playerName) {
    const playAreaPadding = GAME_PARAMS.playAreaPadding;
    const topBarHeight = GAME_PARAMS.topBarHeight;
    const gameAreaWidth = window.innerWidth - (playAreaPadding * 2);
    const gameAreaHeight = window.innerHeight - (playAreaPadding * 2);
    
    // Create UI bar at the top
    const topUIBar = scene.add.rectangle(
        window.innerWidth / 2,
        playAreaPadding + (topBarHeight / 2),
        gameAreaWidth,
        topBarHeight,
        COLORS.uiFrame,
        0.7
    );
    topUIBar.setStrokeStyle(2, COLORS.uiHighlight, 0.8);
    
    // Add scoreboard in top-right portion of UI bar
    const scoreText = scene.add.text(
        window.innerWidth - playAreaPadding - 80,
        playAreaPadding + (topBarHeight / 2),
        'SCORE: 0',
        {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: '#ffffff',
            fontStyle: 'bold'
        }
    ).setOrigin(1, 0.5);
    
    // Add player's pandemic name in top-left portion of UI bar
    const playerNameText = scene.add.text(
        playAreaPadding + 10,
        playAreaPadding + (topBarHeight / 2),
        playerName,
        {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: '#ffffff',
            fontStyle: 'bold'
        }
    ).setOrigin(0, 0.5);
    
    // Add UI frame around the game area with padding
    const uiFrame = scene.add.graphics();
    uiFrame.lineStyle(3, COLORS.uiHighlight, 0.7);
    uiFrame.strokeRect(
        playAreaPadding, 
        playAreaPadding + topBarHeight, 
        gameAreaWidth, 
        gameAreaHeight - topBarHeight
    );
    
    // Return the UI elements
    return {
        topUIBar,
        scoreText,
        playerNameText,
        uiFrame,
        // Include game area measurements for easy access
        dimensions: {
            playAreaPadding,
            topBarHeight,
            gameAreaWidth,
            gameAreaHeight,
            gameAreaTop: playAreaPadding + topBarHeight,
            gameAreaBottom: window.innerHeight - playAreaPadding,
            gameAreaLeft: playAreaPadding,
            gameAreaRight: window.innerWidth - playAreaPadding
        }
    };
}

/**
 * Create a single fight button (syringe) at a random position
 * @param {Phaser.Scene} scene - The Phaser scene context
 * @param {Object} gameAreaBounds - Game area boundaries
 * @param {Function} onClickCallback - Function to call when button is clicked
 * @returns {Object} The created syringe button
 */
export function createFightButton(scene, gameAreaBounds, onClickCallback) {
    // Define the syringe size
    const syringeWidth = 66; // Triple the original SVG width (was 44)
    const syringeHeight = 21; // Triple the original SVG height (was 14)
    
    const { 
        gameAreaTop, 
        gameAreaBottom, 
        gameAreaLeft, 
        gameAreaRight 
    } = gameAreaBounds;
    
    // Random position within the gameplay area
    const x = Phaser.Math.Between(
        gameAreaLeft + syringeWidth/2, 
        gameAreaRight - syringeWidth/2
    );
    const y = Phaser.Math.Between(
        gameAreaTop + syringeHeight/2, 
        gameAreaBottom - syringeHeight/2
    );
    
    // Create the syringe sprite
    const syringe = scene.add.image(x, y, 'syringe');
    syringe.setDisplaySize(syringeWidth, syringeHeight);
    // Add random rotation (in radians)
    const randomAngle = Phaser.Math.FloatBetween(0, Math.PI * 2);
    syringe.setRotation(randomAngle);
    
    // Add glow effect
    const glow = scene.add.image(x, y, 'syringe');
    glow.setDisplaySize(syringeWidth + 8, syringeHeight + 8);
    glow.setTint(0x39ff00);
    glow.setAlpha(0.3);
    // Match the syringe rotation
    glow.setRotation(randomAngle);
    
    // Make syringe interactive
    syringe.setInteractive();
    syringe.on('pointerover', () => {
        glow.setAlpha(0.6);
    });
    
    syringe.on('pointerout', () => {
        glow.setAlpha(0.3);
    });
    
    syringe.on('pointerdown', () => {
        glow.setAlpha(0.2);
    });
    
    syringe.on('pointerup', () => {
        // Add visual feedback for successful click
        const clickEffect = scene.add.image(x, y, 'syringe');
        clickEffect.setDisplaySize(syringeWidth + 12, syringeHeight + 12);
        clickEffect.setTint(0x39ff00);
        clickEffect.setAlpha(0.4);
        // Match the syringe rotation for the effect
        clickEffect.setRotation(randomAngle);
        
        scene.tweens.add({
            targets: clickEffect,
            scaleX: 1.5,
            scaleY: 1.5,
            alpha: 0,
            duration: 300,
            onComplete: () => clickEffect.destroy()
        });
        
        // Call the click callback
        if (onClickCallback) {
            onClickCallback(syringe);
        }
        
        // Remove the syringe and its glow
        glow.destroy();
        syringe.destroy();
    });
    
    // Store button elements
    syringe.buttonElements = {
        glow: glow
    };
    
    return syringe;
}

/**
 * Create the game over screen
 * @param {Phaser.Scene} scene - The Phaser scene context
 * @param {number} score - The player's final score
 * @param {Function} onReplayCallback - Function to call when replay button is clicked
 * @returns {Object} Game over screen elements
 */
export function createGameOverScreen(scene, score) {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const width = Math.min(500, window.innerWidth * 0.8);
    const height = 300;
    
    // Create a darkened background overlay
    const overlay = scene.add.rectangle(
        window.innerWidth / 2,
        window.innerHeight / 2,
        window.innerWidth,
        window.innerHeight,
        0x000000,
        0.7
    );
    
    // Create a semi-transparent panel with blood drips
    const panel = scene.add.rectangle(centerX, centerY, width, height, 0x220000, 0.8);
    panel.setStrokeStyle(2, 0xff3333, 0.8);
    
    // Add dripping blood from the Game Over text
    const dripsCount = 8;
    const drips = [];
    
    // Add "Game Over" text with blood drip effect
    const gameOverText = scene.add.text(centerX, centerY - 70, 'GAME OVER', {
        fontFamily: 'Nosifer, cursive',
        fontSize: '48px',
        color: '#ff0000',
        fontStyle: 'bold',
        stroke: '#880000',
        strokeThickness: 6,
        shadow: {
            offsetX: 2,
            offsetY: 2,
            color: '#000',
            blur: 5,
            stroke: true,
            fill: true
        }
    }).setOrigin(0.5);
    
    // Add blood drips beneath the text
    for (let i = 0; i < dripsCount; i++) {
        const offset = (i - dripsCount/2) * (gameOverText.width / dripsCount);
        const x = centerX + offset + Phaser.Math.Between(-10, 10);
        const dripHeight = Phaser.Math.Between(30, 80);
        const drip = scene.add.rectangle(x, centerY - 40, 6, 0, 0xdd0000, 0.8);
        
        // Animate the drip growing downward
        scene.tweens.add({
            targets: drip,
            height: dripHeight,
            duration: 2000 + Phaser.Math.Between(0, 1000),
            ease: 'Power2',
            delay: i * 150
        });
        
        drips.push(drip);
    }
    
    // Show final score
    const scoreText = scene.add.text(
        centerX, 
        centerY + 20, 
        `FINAL SCORE: ${score || 0}`, 
        {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff',
            fontStyle: 'bold'
        }
    ).setOrigin(0.5);
    
    // Create replay button
    const replayButtonWidth = 120;
    const replayButtonHeight = 40;
    const replayButtonGlow = scene.add.rectangle(
        centerX, 
        centerY + 80, 
        replayButtonWidth + 10, 
        replayButtonHeight + 10, 
        0x00ff00, 
        0.2
    );
    
    const replayButton = scene.add.rectangle(
        centerX, 
        centerY + 80, 
        replayButtonWidth, 
        replayButtonHeight, 
        0x006600
    );
    replayButton.setStrokeStyle(2, 0x00ff00, 1);
    
    const replayText = scene.add.text(centerX, centerY + 80, 'REPLAY', {
        fontFamily: 'Arial',
        fontSize: '20px',
        color: '#ffffff',
        fontStyle: 'bold',
        shadow: {
            offsetX: 1,
            offsetY: 1,
            color: '#000',
            blur: 2,
            stroke: true,
            fill: true
        }
    }).setOrigin(0.5);
    
    // Add pulse animation to the button
    scene.tweens.add({
        targets: [replayButton, replayButtonGlow, replayText],
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
    });
    
    // Make the button interactive
    replayButton.setInteractive();
    replayButton.on('pointerover', () => {
        replayButton.fillColor = 0x008800;
        replayButtonGlow.alpha = 0.4;
    });
    replayButton.on('pointerout', () => {
        replayButton.fillColor = 0x006600;
        replayButtonGlow.alpha = 0.2;
    });
    replayButton.on('pointerdown', () => {
        replayButton.fillColor = 0x004400;
        replayButtonGlow.alpha = 0.1;
    });
    replayButton.on('pointerup', () => {
        // Fire the game restart event
        scene.events.emit('restartGame');
        
        // Remove game over screen
        overlay.destroy();
        panel.destroy();
        gameOverText.destroy();
        scoreText.destroy();
        replayButton.destroy();
        replayText.destroy();
        replayButtonGlow.destroy();
        drips.forEach(drip => drip.destroy());
    });
    
    return {
        overlay,
        panel,
        gameOverText,
        scoreText,
        replayButton,
        replayText,
        replayButtonGlow,
        drips
    };
}

/**
 * Create the victory screen
 * @param {Phaser.Scene} scene - The Phaser scene context
 * @param {number} score - The player's final score
 * @returns {Object} Victory screen elements
 */
export function createVictoryScreen(scene, score) {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const width = Math.min(500, window.innerWidth * 0.8);
    const height = 300;
    
    // Create a darkened background overlay
    const overlay = scene.add.rectangle(
        window.innerWidth / 2,
        window.innerHeight / 2,
        window.innerWidth,
        window.innerHeight,
        0x000000,
        0.7
    );
    
    // Create a semi-transparent panel
    const panel = scene.add.rectangle(centerX, centerY, width, height, 0x002200, 0.8);
    panel.setStrokeStyle(2, 0x00ff00, 0.8);
    
    // Add victory text with neon green glow
    const victoryText = scene.add.text(centerX, centerY - 70, 'VICTORY!', {
        fontFamily: 'Nosifer, cursive',
        fontSize: '48px',
        color: '#00ff00',
        fontStyle: 'bold',
        stroke: '#008800',
        strokeThickness: 6,
        shadow: {
            offsetX: 2,
            offsetY: 2,
            color: '#000',
            blur: 10,
            stroke: true,
            fill: true
        }
    }).setOrigin(0.5);
    
    // Add shine effect to victory text
    scene.tweens.add({
        targets: victoryText,
        alpha: 0.8,
        duration: 500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
    });
    
    // Show final score
    const scoreText = scene.add.text(
        centerX, 
        centerY + 20, 
        `FINAL SCORE: ${score || 0}`, 
        {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff',
            fontStyle: 'bold'
        }
    ).setOrigin(0.5);
    
    // Create replay button
    const replayButtonWidth = 120;
    const replayButtonHeight = 40;
    const replayButtonGlow = scene.add.rectangle(
        centerX, 
        centerY + 80, 
        replayButtonWidth + 10, 
        replayButtonHeight + 10, 
        0x00ff00, 
        0.3
    );
    
    const replayButton = scene.add.rectangle(
        centerX, 
        centerY + 80, 
        replayButtonWidth, 
        replayButtonHeight, 
        0x006600
    );
    replayButton.setStrokeStyle(2, 0x00ff00, 1);
    
    const replayText = scene.add.text(centerX, centerY + 80, 'PLAY AGAIN', {
        fontFamily: 'Arial',
        fontSize: '18px',
        color: '#ffffff',
        fontStyle: 'bold',
        shadow: {
            offsetX: 1,
            offsetY: 1,
            color: '#000',
            blur: 2,
            stroke: true,
            fill: true
        }
    }).setOrigin(0.5);
    
    // Add pulse animation to the button
    scene.tweens.add({
        targets: [replayButton, replayButtonGlow, replayText],
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
    });
    
    // Make the button interactive
    replayButton.setInteractive();
    replayButton.on('pointerover', () => {
        replayButton.fillColor = 0x008800;
        replayButtonGlow.alpha = 0.5;
    });
    replayButton.on('pointerout', () => {
        replayButton.fillColor = 0x006600;
        replayButtonGlow.alpha = 0.3;
    });
    replayButton.on('pointerdown', () => {
        replayButton.fillColor = 0x004400;
        replayButtonGlow.alpha = 0.2;
    });
    replayButton.on('pointerup', () => {
        // Fire the game restart event
        scene.events.emit('restartGame');
        
        // Remove victory screen
        overlay.destroy();
        panel.destroy();
        victoryText.destroy();
        scoreText.destroy();
        replayButton.destroy();
        replayText.destroy();
        replayButtonGlow.destroy();
    });
    
    return {
        overlay,
        panel,
        victoryText,
        scoreText,
        replayButton,
        replayText,
        replayButtonGlow
    };
} 