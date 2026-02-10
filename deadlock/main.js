const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// GAME STATE
let alive = true;
let speed = 6;
let gravity = 0.8;
let velocity = 0;
let mode = "cube"; // cube → wave

// INPUT
let holding = false;
document.addEventListener("mousedown", () => holding = true);
document.addEventListener("mouseup", () => holding = false);
document.addEventListener("keydown", e => {
  if (e.code === "Space") holding = true;
});
document.addEventListener("keyup", e => {
  if (e.code === "Space") holding = false;
});

// PLAYER
const player = {
  x: 120,
  y: 200,
  size: 20
};

// OBSTACLES (Deadlock-style)
const spikes = [];
for (let i = 0; i < 60; i++) {
  spikes.push({
    x: 500 + i * 150,
    y: i % 2 === 0 ? 220 : 160,
    w: 25,
    h: 25
  });
}

// GAME LOOP
function gameLoop() {
  if (!alive) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // MODE SWITCH (wave)
  if (spikes[20].x < player.x) {
    mode = "wave";
    gravity = 0;
  }

  // PLAYER PHYSICS
  if (mode === "cube") {
    velocity += gravity;
    player.y += velocity;

    if (player.y > 200) {
      player.y = 200;
      velocity = 0;
    }
    if (holding && player.y === 200) {
      velocity = -12;
    }
  } else {
    // WAVE MODE
    if (holding) player.y -= 5;
    else player.y += 5;
  }

  // DRAW PLAYER
  ctx.fillStyle = "#00ffff";
  ctx.fillRect(player.x, player.y, player.size, player.size);

  // DRAW & MOVE SPIKES
  ctx.fillStyle = "#ff00ff";
  spikes.forEach(s => {
    s.x -= speed;
    ctx.fillRect(s.x, s.y, s.w, s.h);

    // COLLISION
    if (
      player.x < s.x + s.w &&
      player.x + player.size > s.x &&
      player.y < s.y + s.h &&
      player.y + player.size > s.y
    ) {
      alive = false;
      alert("DEADLOCKED 💀");
      location.reload();
    }
  });

  // FAIL CONDITIONS
  if (player.y < 0 || player.y > canvas.height) {
    alive = false;
    alert("DEADLOCKED 💀");
    location.reload();
  }

  requestAnimationFrame(gameLoop);
}

// START GAME
gameLoop();
