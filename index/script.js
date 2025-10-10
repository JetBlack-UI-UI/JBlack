const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const restartBtn = document.getElementById("restartBtn");

canvas.width = 360;
canvas.height = 540;

// Bird setup
const bird = {
  x: 60,
  y: 250,
  width: 34,
  height: 26,
  gravity: 0.4,
  lift: -7.5,
  velocity: 0,
};

// Pipes setup
let pipes = [];
const pipeWidth = 60;
const gap = 120;
const pipeSpeed = 2.5;
let frame = 0;
let score = 0;
let gameOver = false;

// Draw bird (yellow circle + beak)
function drawBird() {
  ctx.beginPath();
  ctx.arc(bird.x + bird.width / 2, bird.y + bird.height / 2, 14, 0, Math.PI * 2);
  ctx.fillStyle = "#ffeb3b";
  ctx.fill();
  ctx.closePath();

  // Beak
  ctx.beginPath();
  ctx.moveTo(bird.x + bird.width / 2 + 10, bird.y + bird.height / 2 - 3);
  ctx.lineTo(bird.x + bird.width / 2 + 18, bird.y + bird.height / 2);
  ctx.lineTo(bird.x + bird.width / 2 + 10, bird.y + bird.height / 2 + 3);
  ctx.fillStyle = "#ff9800";
  ctx.fill();
  ctx.closePath();

  // Eye
  ctx.beginPath();
  ctx.arc(bird.x + 8, bird.y + 8, 3, 0, Math.PI * 2);
  ctx.fillStyle = "#000";
  ctx.fill();
}

// Create pipes
function createPipe() {
  const topHeight = Math.floor(Math.random() * (canvas.height - gap - 100)) + 40;
  const bottomY = topHeight + gap;
  pipes.push({ x: canvas.width, topHeight, bottomY });
}

// Draw pipes
function drawPipes() {
  ctx.fillStyle = "#2ecc71";
  pipes.forEach((pipe) => {
    // top pipe
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
    // bottom pipe
    ctx.fillRect(pipe.x, pipe.bottomY, pipeWidth, canvas.height - pipe.bottomY);
  });
}

// Update game logic
function update() {
  if (gameOver) return;
  frame++;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Bird movement
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  // Add new pipes
  if (frame % 90 === 0) {
    createPipe();
  }

  // Move pipes
  pipes.forEach((pipe) => (pipe.x -= pipeSpeed));

  // Remove old pipes
  pipes = pipes.filter((pipe) => pipe.x + pipeWidth > 0);

  // Check collision
  for (let pipe of pipes) {
    if (
      bird.x + bird.width > pipe.x &&
      bird.x < pipe.x + pipeWidth &&
      (bird.y < pipe.topHeight || bird.y + bird.height > pipe.bottomY)
    ) {
      return endGame();
    }
  }

  // Ground or ceiling collision
  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    return endGame();
  }

  // Score increase
  pipes.forEach((pipe) => {
    if (!pipe.passed && pipe.x + pipeWidth < bird.x) {
      score++;
      pipe.passed = true;
      scoreDisplay.textContent = score;
    }
  });

  drawPipes();
  drawBird();

  requestAnimationFrame(update);
}

// Game over
function endGame() {
  gameOver = true;
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.font = "28px Poppins";
  ctx.textAlign = "center";
  ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2);
  ctx.font = "20px Poppins";
  ctx.fillText("Score: " + score, canvas.width / 2, canvas.height / 2 + 40);
}

// Flap when clicked
canvas.addEventListener("click", () => {
  if (gameOver) return;
  bird.velocity = bird.lift;
});

// Restart
restartBtn.addEventListener("click", () => {
  resetGame();
});

function resetGame() {
  bird.y = 250;
  bird.velocity = 0;
  pipes = [];
  frame = 0;
  score = 0;
  scoreDisplay.textContent = 0;
  gameOver = false;
  update();
}

// Start game
resetGame();
