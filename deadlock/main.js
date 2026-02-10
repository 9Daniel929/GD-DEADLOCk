const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let mode = "cube"; // cube → wave
let gravity = 0.9;
let velocity = 0;
let speed = 6;
let alive = true;

const player = {
  x: 100,
  y: 200,
  size: 20
};

const spikes = [];
for (let i = 0; i < 40; i++) {
  spikes.push({
    x: 400 + i * 200,
    y: i % 2 === 0 ? 220 : 180,
    w: 25,
    h: 25
  });
}

function jump() {
  if (!alive) return;

  if (mode === "cube" && player.y >= 200) {
    velocity = -13;
  }
}

document.addEventListener("keydown", e => {
  if (e.code === "Space") jump();
});

document.addEventListener("click", jump);

function gameLoop() {
  if (!alive) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Switch to wave mode halfway
  if (spikes[15].x < player.x) {
    mode = "wave";
    gravity = 0;
  }

  if (mode === "cube") {
    velocity += gravity;
    player.y += velocity;

    if (player.y > 200) {
      player.y = 200;
      velocity = 0;
    }
  } else {
    // Wave mode
    if (keys.down) player.y -= 6;
    else player.y += 6;
  }

  // Player
  ctx.fillStyle = "#00ffff";
  ctx.fillRect(player.x, player.y, player.size, player.size);

  // Spikes
  ctx.fillStyle = "#ff00ff";
  spikes.forEach(s => {
    s.x -= speed;
    ctx.fillRect(s.x, s.y, s.w, s.h);

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

  requestAnimationFrame(gameLoop);
}

const keys = { down: false };
document.addEventListener("mousedown", () => keys.down = true);
document.addEventListener("mouseup", () => keys.down = false);

gameLoop();

