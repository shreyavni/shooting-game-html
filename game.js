// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const gameOverDiv = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');
const restartBtn = document.getElementById('restartBtn');

// Set canvas size
canvas.width = canvas.offsetWidth;
canvas.height = 500;

// Game state
let score = 0;
let lives = 3;
let targets = [];
let gameRunning = true;
let targetSpeed = 2;
let spawnRate = 60;
let frameCount = 0;

// Target class
class Target {
    constructor() {
        this.radius = 20 + Math.random() * 20;
        this.x = Math.random() * (canvas.width - this.radius * 2) + this.radius;
        this.y = -this.radius;
        this.speed = targetSpeed + Math.random() * 2;
        this.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
    }

    update() {
        this.y += this.speed;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Draw crosshair on target
        ctx.beginPath();
        ctx.moveTo(this.x - 10, this.y);
        ctx.lineTo(this.x + 10, this.y);
        ctx.moveTo(this.x, this.y - 10);
        ctx.lineTo(this.x, this.y + 10);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    isOffScreen() {
        return this.y - this.radius > canvas.height;
    }

    isClicked(mouseX, mouseY) {
        const distance = Math.sqrt((mouseX - this.x) ** 2 + (mouseY - this.y) ** 2);
        return distance < this.radius;
    }
}

// Canvas click handler
canvas.addEventListener('click', (e) => {
    if (!gameRunning) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    let hit = false;
    for (let i = targets.length - 1; i >= 0; i--) {
        if (targets[i].isClicked(mouseX, mouseY)) {
            targets.splice(i, 1);
            score += 10;
            scoreElement.textContent = score;
            hit = true;
            break;
        }
    }
});

// Restart button handler
restartBtn.addEventListener('click', () => {
    gameOverDiv.classList.add('hidden');
    resetGame();
    gameLoop();
});

// Reset game
function resetGame() {
    score = 0;
    lives = 3;
    targets = [];
    gameRunning = true;
    frameCount = 0;
    targetSpeed = 2;
    scoreElement.textContent = score;
    livesElement.textContent = lives;
}

// Update game state
function update() {
    if (!gameRunning) return;
    
    frameCount++;
    
    // Spawn new targets
    if (frameCount % spawnRate === 0) {
        targets.push(new Target());
        
        // Gradually increase difficulty
        if (frameCount % 300 === 0) {
            targetSpeed += 0.5;
            spawnRate = Math.max(30, spawnRate - 5);
        }
    }
    
    // Update targets
    for (let i = targets.length - 1; i >= 0; i--) {
        targets[i].update();
        
        // Check if target escaped
        if (targets[i].isOffScreen()) {
            targets.splice(i, 1);
            lives--;
            livesElement.textContent = lives;
            
            if (lives <= 0) {
                gameOver();
            }
        }
    }
}

// Draw everything
function draw() {
    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw stars background
    for (let i = 0; i < 50; i++) {
        const x = (i * 123) % canvas.width;
        const y = (i * 456) % canvas.height;
        ctx.fillStyle = 'white';
        ctx.fillRect(x, y, 2, 2);
    }
    
    // Draw targets
    targets.forEach(target => target.draw());
}

// Game over
function gameOver() {
    gameRunning = false;
    finalScoreElement.textContent = score;
    gameOverDiv.classList.remove('hidden');
}

// Game loop
function gameLoop() {
    if (gameRunning) {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }
}

// Start the game
gameLoop();
