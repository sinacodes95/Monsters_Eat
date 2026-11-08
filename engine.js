const simulationStep = 1 / 120;
const playerSpeed = 10;
const gravity = 30;
const jumpSpeed = 17;
const maxFallSpeed = 24;
const jumpBufferDuration = 0.12;
const coyoteDuration = 0.08;
const collisionEpsilon = 1e-8;

function Player(x, y) {
  this.type = "player";
  this.pos = { x: x + 0.1, y: y - 0.5 };
  this.size = { x: 0.8, y: 1.5 };
  this.speed = { x: 0, y: 0 };
  this.facing = 1;
  this.grounded = false;
  this.coyoteTime = 0;
  this.jumpBuffer = 0;
}

function Poison(x, y, tile) {
  this.type = "poison";
  this.kind = { "=": "horizontal", "|": "vertical", v: "drip" }[tile];
  this.pos = { x, y };
  this.size = { x: 1, y: 1 };
  this.speed = { x: tile === "=" ? 2 : 0, y: tile === "|" ? 2 : tile === "v" ? 3 : 0 };
  this.start = { x, y };
}

Poison.prototype.act = function (step, level) {
  const pos = { x: this.pos.x + this.speed.x * step, y: this.pos.y + this.speed.y * step };
  if (!level.obstacleAt(pos, this.size)) {
    this.pos = pos;
  } else if (this.kind === "drip") {
    this.pos = this.start;
  } else {
    this.speed.x *= -1;
    this.speed.y *= -1;
  }
};

function Coin(x, y) {
  this.type = "coin";
  this.pos = { x: x + 0.18, y: y + 0.18 };
  this.size = { x: 0.64, y: 0.64 };
}

function Level(plan) {
  this.width = Math.max(...plan.map(row => row.length));
  this.height = plan.length;
  this.actors = [];
  this.status = null;
  this.finishDelay = 0;
  this.stepRemainder = 0;
  this.upWasHeld = false;
  this.totalCoins = 0;

  this.grid = plan.map((row, y) => Array.from({ length: this.width }, (_, x) => {
    const tile = row[x];
    if (tile === "x") return "wall";
    if (tile === "!") return "poison";
    if (tile === "@") {
      this.player = new Player(x, y);
      this.actors.push(this.player);
    } else if (tile === "o") {
      this.actors.push(new Coin(x, y));
      this.totalCoins += 1;
    } else if (tile === "=" || tile === "|" || tile === "v") {
      this.actors.push(new Poison(x, y, tile));
    }
    return null;
  }));

  this.coinsRemaining = this.totalCoins;
}

Level.prototype.obstacleAt = function (pos, size) {
  const xStart = Math.floor(pos.x + collisionEpsilon);
  const xEnd = Math.ceil(pos.x + size.x - collisionEpsilon);
  const yStart = Math.floor(pos.y + collisionEpsilon);
  const yEnd = Math.ceil(pos.y + size.y - collisionEpsilon);

  if (yEnd > this.height) return "poison";
  if (xStart < 0 || xEnd > this.width || yStart < 0) return "wall";

  let wall = false;
  for (let y = yStart; y < yEnd; y++) {
    for (let x = xStart; x < xEnd; x++) {
      if (this.grid[y][x] === "poison") return "poison";
      if (this.grid[y][x] === "wall") wall = true;
    }
  }
  return wall ? "wall" : null;
};

Player.prototype.move = function (axis, step, level) {
  const distance = this.speed[axis] * step;
  if (!distance) return;

  const next = { ...this.pos };
  next[axis] += distance;
  const obstacle = level.obstacleAt(next, this.size);
  if (obstacle === "poison") {
    level.finish("lost");
  } else if (obstacle === "wall") {
    // A substep moves less than one tile, so the first blocking face is the next tile boundary.
    const near = this.pos[axis];
    const far = near + this.size[axis];
    this.pos[axis] = distance > 0
      ? Math.ceil(far - collisionEpsilon) - this.size[axis]
      : Math.floor(near + collisionEpsilon);
    this.speed[axis] = 0;
    if (axis === "y" && distance > 0) this.grounded = true;
  } else {
    this.pos[axis] = next[axis];
  }
};

Player.prototype.act = function (step, level, keys) {
  const direction = Number(Boolean(keys.right)) - Number(Boolean(keys.left));
  this.speed.x = direction * playerSpeed;
  if (direction) this.facing = direction;

  if (this.jumpBuffer > 0 && this.coyoteTime > 0) {
    this.speed.y = -jumpSpeed;
    this.coyoteTime = 0;
    this.jumpBuffer = 0;
  }

  this.move("x", step, level);
  if (level.status) return;

  this.grounded = false;
  this.speed.y = Math.min(this.speed.y + gravity * step, maxFallSpeed);
  this.move("y", step, level);

  this.coyoteTime = this.grounded ? coyoteDuration : Math.max(0, this.coyoteTime - step);
  this.jumpBuffer = Math.max(0, this.jumpBuffer - step);
};

function actorsOverlap(a, b) {
  return a.pos.x < b.pos.x + b.size.x - collisionEpsilon &&
    a.pos.x + a.size.x > b.pos.x + collisionEpsilon &&
    a.pos.y < b.pos.y + b.size.y - collisionEpsilon &&
    a.pos.y + a.size.y > b.pos.y + collisionEpsilon;
}

Level.prototype.finish = function (status) {
  this.status = status;
  this.finishDelay = status === "lost" ? 0.7 : 0.85;
};

Level.prototype.isFinished = function () {
  return this.status !== null && this.finishDelay <= 0;
};

Level.prototype.update = function (keys) {
  for (const actor of this.actors) {
    if (actor.type === "poison") actor.act(simulationStep, this);
  }

  this.player.act(simulationStep, this, keys);
  if (this.status) return;

  if (this.actors.some(actor => actor.type === "poison" && actorsOverlap(this.player, actor))) {
    this.finish("lost");
    return;
  }

  for (let index = this.actors.length - 1; index >= 0; index--) {
    const actor = this.actors[index];
    if (actor.type === "coin" && actorsOverlap(this.player, actor)) {
      this.actors.splice(index, 1);
      this.coinsRemaining -= 1;
      if (this.coinsRemaining === 0) this.finish("won");
    }
  }
};

Level.prototype.animate = function (elapsed, keys) {
  if (this.status) {
    this.finishDelay -= elapsed;
    return;
  }

  const jumpPressed = keys.consumeJump ? keys.consumeJump() : keys.up && !this.upWasHeld;
  this.upWasHeld = Boolean(keys.up);
  if (jumpPressed) this.player.jumpBuffer = jumpBufferDuration;

  this.stepRemainder += elapsed;
  while (this.stepRemainder + collisionEpsilon >= simulationStep && !this.status) {
    this.update(keys);
    this.stepRemainder = Math.max(0, this.stepRemainder - simulationStep);
  }
};

function trackKeys() {
  const bindings = new Map([
    ["ArrowLeft", "left"], ["KeyA", "left"],
    ["ArrowRight", "right"], ["KeyD", "right"],
    ["ArrowUp", "up"], ["KeyW", "up"], ["Space", "up"]
  ]);
  const keyboard = new Map();
  const touch = new Set();
  let jumpQueued = false;

  const keys = {
    left: false,
    right: false,
    up: false,
    setTouch(action, down) {
      if (down) touch.add(action);
      else touch.delete(action);
      refresh();
    },
    consumeJump() {
      const queued = jumpQueued;
      jumpQueued = false;
      return queued;
    },
    reset() {
      keyboard.clear();
      touch.clear();
      refresh();
      jumpQueued = false;
    }
  };

  function refresh() {
    const wasUp = keys.up;
    const held = new Set(keyboard.values());
    keys.left = touch.has("left") || held.has("left");
    keys.right = touch.has("right") || held.has("right");
    keys.up = touch.has("up") || held.has("up");
    if (keys.up && !wasUp) jumpQueued = true;
  }

  function onKey(event) {
    const action = bindings.get(event.code);
    if (!action) return;
    if (event.type === "keydown") {
      if (event.ctrlKey || event.altKey || event.metaKey) return;
      if (event.target?.closest?.("input, textarea, select, [contenteditable]")) return;
      if (event.code === "Space" && event.target?.closest?.("button, a")) return;
      if (!event.repeat) keyboard.set(event.code, action);
    } else {
      if (!keyboard.delete(event.code)) return;
    }
    event.preventDefault();
    refresh();
  }

  window.addEventListener("keydown", onKey);
  window.addEventListener("keyup", onKey);
  window.addEventListener("blur", keys.reset);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) keys.reset();
  });
  return keys;
}
