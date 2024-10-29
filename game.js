// Variables to handle canvas and context
let canvas, ctx, character, backgroundImage;
let lastTimeStamp = 0, tick = 0;

// Game state variables
let gameInterval;
let isGameActive = false;
let score = 0;
let timer = 60; // This will track time in seconds

// Load audio files
const backgroundMusic = document.getElementById("background");
const failSound = document.getElementById("fail");
const successSound = document.getElementById("success");
const gameOverSound = document.getElementById("end");
const characterSpriteSheet = new Image();
characterSpriteSheet.src = "./assets/swim.png";
characterSpriteSheet.onload = loadAssets;

backgroundImage = new Image();
backgroundImage.src = "./assets/waterbg.jpg";
backgroundImage.onload = loadAssets;

const totalAssets = 2;
let loadedAssets = 0;

    // Ensure assets are loaded before initializing game
function loadAssets() {
    loadedAssets++;
    if (loadedAssets === totalAssets) {
        initializeGame();
        }
    }

    //Concept taken from examples from class (example 3 specifically :) 
function initializeGame() {
    canvas = document.getElementById('gameCanvas'); // create the canvas
    ctx = canvas.getContext('2d');

    document.getElementById('timer').innerText = `Timer: ${timer}`;

    character = createCharacter(
        characterSpriteSheet,
            [56, 48], // Sprite size (width, height)
            [
                [ // Swimming Up
                    [0, 144], [56, 144], [112, 144]
                ],
                [ // Swimming Down
                    [0, 0], [56, 0], [112, 0]
                ],
                [ // Swimming Left
                    [0, 48], [56, 48], [112, 48]
                ],
                [ // Swimming Right
                    [0, 96], [56, 96], [112, 96]
                ]
            ],
            1 // Scale factor
        );

        // Set the character's initial position to the center of the canvas
        character.position = [
            (canvas.width - character.canvasSize[0]) / 2,
            (canvas.height - character.canvasSize[1]) / 2
        ];

        character.init();

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);

        // Initialize toys
        initToys(5); // Create 5 toys
        window.requestAnimationFrame(gameLoop);
    }

    function gameLoop(timeStamp) {
        tick = (timeStamp - lastTimeStamp);
        lastTimeStamp = timeStamp;
    
        if (isGameActive) {
            // Decrement timer based on delta time (in seconds)
            timer -= tick / 1000;
    
            // Update the timer display
            document.getElementById('timer').innerText = `Timer: ${Math.max(Math.floor(timer), 0)}`;
    
            // Check if the timer reaches 0 seconds
            if (timer <= 0) {
                stopGame();
                return; // Stop game loop
            }
        }
    
        updateGame(tick);
        renderGame();
    
        window.requestAnimationFrame(gameLoop);
    }

    function updateGame(deltaTime) {
        character.update(deltaTime);

        // Boundary checks to ensure the character stays within the canvas
        character.position[0] = Math.max(0, Math.min(character.position[0], canvas.width - character.canvasSize[0]));
        character.position[1] = Math.max(0, Math.min(character.position[1], canvas.height - character.canvasSize[1]));

        // Update toys and check for collisions
        toys.forEach(toy => {
            toy.update();
        });
    }

    function renderGame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // Adjust background size if necessary
        character.draw(ctx);
        toys.forEach(toy => toy.draw(ctx)); // Draw each toy
    }

    function handleKeyDown(e) {
        e.preventDefault();
        if (character) { 
            character.handleInput(e.key, true); 
            // Check for space key to collect toys
            if (e.key === " ") {
                checkForToyCollection();
            }
        }
    }

    function handleKeyUp(e) {
        e.preventDefault();
        if (character) { character.handleInput(e.key, false); }
    }

    // Function to check and collect toy when space is pressed
function checkForToyCollection() {
    let collected = false; // Flag to track if a toy was collected

    toys.forEach(toy => {
        const dx = character.position[0] - toy.x;
        const dy = character.position[1] - toy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Check if the character is near enough to collect the toy
        if (distance < (character.canvasSize[0] / 2 + toy.radius)) {
            // Collect the toy
            toy.reset();
            score++;
            successSound.currentTime = 0; // Reset the audio to the start
            successSound.play(); // Play success sound
            collected = true; // Mark that a toy was collected

            // Update score display
            document.getElementById('score').innerText = `Score: ${score}`;
            console.log(`Score: ${score}`); // Log score
        }
    });

    // Play fail sound if no toy was collected in this attempt
    if (!collected) {
        failSound.currentTime = 0; // Reset the audio to the start
        failSound.play(); // Play fail sound
    }
}


    function createCharacter(spriteSheet, spriteSize, spriteFrames, scale) {
        return {
            spriteSheet,
            spriteSize,
            spriteFrames,
            scale,
            canvasSize: spriteSize,
            position: [0, 0],
            direction: [0, 0],
            velocity: 0.2,
            animationTrack: 0,
            animationFrame: 0,
            frameDuration: 125,
            timeSinceLastFrame: 0,
            lastAction: "",

            init() {
                this.canvasSize = [
                    this.spriteSize[0] * this.scale,
                    this.spriteSize[1] * this.scale
                ];
            },

            handleInput(key, isKeyDown) {
                // Check for movement keys
                if (isKeyDown) {
                    switch (key) {
                        case "w":
                            this.action("moveUp");
                            break;
                        case "a":
                            this.action("moveLeft");
                            break;
                        case "s":
                            this.action("moveDown");
                            break;
                        case "d":
                            this.action("moveRight");
                            break;
                    }
                }

                if (!isKeyDown) {
                    switch (key) {
                        case "w":
                        case "s":
                            this.action("stopVertical");
                            break;
                        case "a":
                        case "d":
                            this.action("stopHorizontal");
                            break;
                    }
                }
            },

            action(action) {
                if (action === this.lastAction) return;

                switch (action) {
                    case "moveLeft":
                        this.setAnimation(2, -this.velocity, 0);
                        break;
                    case "moveRight":
                        this.setAnimation(3, this.velocity, 0);
                        break;
                    case "moveUp":
                        this.setAnimation(0, 0, -this.velocity);
                        break;
                    case "moveDown":
                        this.setAnimation(1, 0, this.velocity);
                        break;
                    case "stopHorizontal":
                        this.stopAnimation(0);
                        break;
                    case "stopVertical":
                        this.stopAnimation(1);
                        break;
                }

                this.lastAction = action;
            },

            setAnimation(track, velocityX, velocityY) {
                this.animationTrack = track;
                this.animationFrame = 0;
                this.direction = [velocityX, velocityY];
            },

            stopAnimation(axis) {
                this.direction[axis] = 0;
            },

            update(deltaTime) {
                this.timeSinceLastFrame += deltaTime;

                if (this.timeSinceLastFrame >= this.frameDuration) {
                    this.timeSinceLastFrame = 0;

                    if (this.direction[0] !== 0 || this.direction[1] !== 0) {
                        this.animationFrame = (this.animationFrame + 1) % this.spriteFrames[this.animationTrack].length;
                    }
                }

                this.position[0] += this.direction[0] * deltaTime;
                this.position[1] += this.direction[1] * deltaTime;
            },

            draw(ctx) {
                const frame = this.spriteFrames[this.animationTrack][this.animationFrame];
                ctx.drawImage(
                    this.spriteSheet,
                    frame[0], frame[1],
                    this.spriteSize[0], this.spriteSize[1],
                    this.position[0], this.position[1],
                    this.canvasSize[0], this.canvasSize[1]
                );
            }
        };
    }



// Toy behavior 
class Toy {
    constructor() {
        this.originalRadius = 30; // Set the original radius
        this.reset(); // Initialize the toys properties
    }

    // Reset toys position, target, and state
    reset() {
        // Start from random edge (either left or right)
        this.x = Math.random() < 0.5 ? 0 : canvas.width;
        this.y = Math.random() * canvas.height; // Random vertical position
        this.radius = this.originalRadius; // Start with the full size radius
        this.targetX = Math.random() * canvas.width; // Random target point
        this.targetY = Math.random() * canvas.height;
        this.speed = 1 + Math.random(); // Random speed for movement
        this.stage = 1; // Stage 1 = moving towards target
        this.timer = 0;

        // Set random colors for the gradient only once per reset
        this.centerColor = this.randomColor(); // Color for the center
        this.edgeColor = this.randomColor();   // Color for the edge
    }

    // Draw the toy on canvas
    draw() {
        let gradient = ctx.createRadialGradient(
            this.x, this.y, this.radius * 0.1, // Inner circle
            this.x, this.y, this.radius // Outer circle
        );

        gradient.addColorStop(0, this.centerColor); // Center color
        gradient.addColorStop(1, this.edgeColor); // Edge color

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    // Generate a random vibrant color with a specified brightness range
randomColor() {
    const r = Math.floor(Math.random() * 100 + 155); // Red range: 155-255
    const g = Math.floor(Math.random() * 80 + 175);  // Green range: 175-255
    const b = Math.floor(Math.random() * 100 + 155); // Blue range: 155-255
    return `rgb(${r},${g},${b})`;
}


    // Update toys position based on its current stage
    update() {
        if (this.stage === 1) { // Moving towards target
            this.moveToTarget();
            this.radius = Math.max(this.originalRadius / 2, this.radius - 0.1); // Gradually shrink radius
            
            // Check if close enough to target
            if (Math.abs(this.x - this.targetX) < 2 && Math.abs(this.y - this.targetY) < 2) {
                this.stage = 2; // Reached the target, now staying
                this.timer = 100; // Stay for 100 frames
            }
        } else if (this.stage === 2) { // Staying at the target
            this.timer--; // Decrease timer
            // Keep the radius constant while pausing
            if (this.timer <= 0) {
                this.stage = 3; // After timer ends move off the screen
            }
        } else if (this.stage === 3) { // Leaving the screen
            this.moveOffScreen();
            this.radius = Math.min(this.originalRadius, this.radius + 0.1); // Gradually grow radius back
            
            // If toy has moved off the screen, reset it
            if (this.x <= 0 || this.x >= canvas.width || this.y <= 0 || this.y >= canvas.height) {
                this.reset();
            }
        }
    }

    // Move toy towards target
    moveToTarget() {
        this.x += (this.targetX - this.x) * this.speed * 0.01;
        this.y += (this.targetY - this.y) * this.speed * 0.01;
    }

    // Move toy off the screen
    moveOffScreen() {
        const edgeX = this.x < canvas.width / 2 ? -this.speed : this.speed;
        const edgeY = this.y < canvas.height / 2 ? -this.speed : this.speed;
        this.x += edgeX;
        this.y += edgeY;
    }
}


// Initialize array to hold toys
let toys = [];
function initToys(count) {
    for (let i = 0; i < count; i++) {
        toys.push(new Toy());
    }
}

// Start game button
document.getElementById('startButton').onclick = () => {
    if (!isGameActive) { // Prevent multiple game starts
        isGameActive = true;
        score = 0;
        timer = 60;
        document.getElementById('score').innerText = `Score: ${score}`;
        document.getElementById('timer').innerText = `Timer: ${timer}`;
        backgroundMusic.currentTime = 0;
        backgroundMusic.play();
        initializeGame(); // Start the game setup
        
        // Enable the restart button
        document.getElementById('restartButton').disabled = false;
    }
};


// Stop game function
function stopGame() {
    
    isGameActive = false;
    gameOverSound.play(); // Play game over sound
    backgroundMusic.pause(); // Stop background music
    alert("Game Over! Final Score: " + score);
}

// Restart game button
document.getElementById('restartButton').onclick = () => {
    // Reset score and timer
    score = 0;
    timer = 60;

    // Update display
    document.getElementById('score').innerText = `Score: ${score}`;
    document.getElementById('timer').innerText = `Timer: ${timer}`;

    // Restart background music
    backgroundMusic.currentTime = 0;
    backgroundMusic.play();

    toys = []; // Clear the toy array
    initToys(5); // Reinitialize toys with the desired count

    // Ensure game is active and restart 
    isGameActive = true;
};


