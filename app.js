const TILE_SIZE = 24;
const SPARK_DURATION = 0.45;

function makeElement(tag, className, parent) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  return parent.appendChild(element);
}

function positionElement(element, x, y) {
  element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
}

class DOMDisplay {
  constructor(stage, level) {
    this.level = level;
    this.wrap = makeElement("div", "game", stage);
    this.wrap.setAttribute("aria-hidden", "true");
    this.world = makeElement("div", "world", this.wrap);
    this.width = level.width * TILE_SIZE;
    this.height = level.height * TILE_SIZE;
    this.world.style.width = `${this.width}px`;
    this.world.style.height = `${this.height}px`;
    this.drawBackground();
    this.actorLayer = makeElement("div", "actor-layer", this.world);
    this.effects = makeElement("div", "effects", this.world);
    this.sprites = new Map();
    this.sparks = [];
    this.drawFrame(0);
  }

  drawBackground() {
    const table = makeElement("table", "background", this.world);
    table.style.width = `${this.width}px`;
    table.style.height = `${this.height}px`;
    const rows = makeElement("tbody", "", table);
    this.level.grid.forEach((row, y) => {
      const line = makeElement("tr", "", rows);
      line.style.height = `${TILE_SIZE}px`;
      row.forEach((tile, x) => {
        const exposed = tile === "wall" && (y === 0 || this.level.grid[y - 1][x] !== "wall");
        makeElement("td", exposed ? "wall wall-top" : tile, line);
      });
    });
  }

  drawFrame(step) {
    this.sparks = this.sparks.filter(spark => {
      spark.remaining -= step;
      if (spark.remaining > 0) return true;
      spark.element.remove();
      return false;
    });

    const activeActors = new Set(this.level.actors);
    for (const [actor, sprite] of this.sprites) {
      if (activeActors.has(actor)) continue;
      const element = makeElement("div", "coin-spark", this.effects);
      positionElement(element, (actor.pos.x + actor.size.x / 2) * TILE_SIZE,
        (actor.pos.y + actor.size.y / 2) * TILE_SIZE);
      this.sparks.push({element, remaining: SPARK_DURATION});
      sprite.remove();
      this.sprites.delete(actor);
    }

    for (const actor of activeActors) {
      let sprite = this.sprites.get(actor);
      if (!sprite) {
        sprite = makeElement("div", `actor ${actor.type}`, this.actorLayer);
        if (actor.kind) sprite.classList.add(actor.kind);
        sprite.style.width = `${actor.size.x * TILE_SIZE}px`;
        sprite.style.height = `${actor.size.y * TILE_SIZE}px`;
        this.sprites.set(actor, sprite);
      }

      positionElement(sprite, actor.pos.x * TILE_SIZE, actor.pos.y * TILE_SIZE);
      if (actor.type === "player") {
        sprite.classList.toggle("facing-left", actor.facing < 0);
        sprite.classList.toggle("airborne", !actor.grounded);
        sprite.classList.toggle("running", actor.grounded && Math.abs(actor.speed.x) > 0.1);
      }
    }

    this.wrap.classList.toggle("lost", this.level.status === "lost");
    this.wrap.classList.toggle("won", this.level.status === "won");
    this.followPlayer(step);
  }

  followPlayer(step) {
    const {clientWidth: width, clientHeight: height} = this.wrap;
    const {pos, size} = this.level.player;
    const x = (pos.x + size.x / 2) * TILE_SIZE - width * 0.44;
    const y = (pos.y + size.y / 2) * TILE_SIZE - height * 0.58;
    const targetX = width >= this.width ? (this.width - width) / 2 :
      Math.max(0, Math.min(this.width - width, x));
    const targetY = height >= this.height ? this.height - height :
      Math.max(0, Math.min(this.height - height, y));

    if (this.cameraX === undefined || step === 0) {
      this.cameraX = targetX;
      this.cameraY = targetY;
    } else {
      const follow = 1 - Math.exp(-step * 12);
      this.cameraX += (targetX - this.cameraX) * follow;
      this.cameraY += (targetY - this.cameraY) * follow;
    }

    positionElement(this.world, -Math.round(this.cameraX), -Math.round(this.cameraY));
  }

  clear() {
    this.wrap.remove();
  }
}

function startGame() {
  const stage = document.getElementById("stage");
  const levelNumber = document.getElementById("level-number");
  const levelName = document.getElementById("level-name");
  const coinCount = document.getElementById("coin-count");
  const status = document.getElementById("game-status");
  const result = document.getElementById("result");
  const resultKicker = document.getElementById("result-kicker");
  const resultTitle = document.getElementById("result-title");
  const resultDescription = document.getElementById("result-description");
  const resultAction = document.getElementById("result-action");
  const controls = Array.from(document.querySelectorAll("[data-control]"));
  const keys = trackKeys();
  const heldControls = new Map();

  let level;
  let levelIndex;
  let display;
  let frameId;
  let lastTime;
  let lastCoins;
  let nextLevel;

  function clearInput() {
    keys.reset();
    heldControls.clear();
    controls.forEach(button => button.classList.remove("pressed"));
  }

  function holdControl(id, button) {
    if (level.status !== null) return;
    heldControls.set(id, button);
    keys.setTouch(button.dataset.control, true);
    button.classList.add("pressed");
  }

  function releaseControl(id) {
    const button = heldControls.get(id);
    if (!button) return;
    heldControls.delete(id);
    if (Array.from(heldControls.values()).includes(button)) return;
    keys.setTouch(button.dataset.control, false);
    button.classList.remove("pressed");
  }

  controls.forEach(button => {
    button.addEventListener("pointerdown", event => {
      if (event.button !== 0 || level.status !== null) return;
      event.preventDefault();
      button.setPointerCapture(event.pointerId);
      holdControl(event.pointerId, button);
    });
    for (const eventName of ["pointerup", "pointercancel", "lostpointercapture"]) {
      button.addEventListener(eventName, event => releaseControl(event.pointerId));
    }

    button.addEventListener("keydown", event => {
      if (event.key !== " " && event.key !== "Enter") return;
      event.preventDefault();
      if (!event.repeat) holdControl(event.key, button);
    });
    button.addEventListener("keyup", event => releaseControl(event.key));
    button.addEventListener("blur", () => {
      releaseControl(" ");
      releaseControl("Enter");
    });
  });

  window.addEventListener("blur", clearInput);
  document.addEventListener("visibilitychange", () => {
    lastTime = null;
    if (document.hidden) clearInput();
  });
  window.addEventListener("resize", () => display.drawFrame(0));

  function updateCoins() {
    if (lastCoins === level.coinsRemaining) return;
    lastCoins = level.coinsRemaining;
    coinCount.textContent = `${level.totalCoins - lastCoins} / ${level.totalCoins}`;
  }

  function begin(requestedIndex, focusStage = false) {
    const afterDeath = level?.status === "lost";
    const index = afterDeath ? 0 : requestedIndex;
    cancelAnimationFrame(frameId);
    clearInput();
    result.hidden = true;
    if (display) display.clear();

    levelIndex = index;
    level = new Level(LEVELS[index]);
    levelNumber.textContent = String(index + 1).padStart(2, "0");
    levelName.textContent = LEVEL_NAMES[index];
    stage.dataset.level = String(index + 1);
    stage.dataset.state = "playing";
    display = new DOMDisplay(stage, level);
    lastTime = null;
    lastCoins = null;
    updateCoins();
    const stageMessage = `Level ${index + 1}. ${LEVEL_NAMES[index]}. Collect ${level.totalCoins} coins.`;
    status.textContent = afterDeath ? `Poisoned. Back to ${stageMessage}` : stageMessage;
    if (focusStage) stage.focus({preventScroll: true});
    frameId = requestAnimationFrame(frame);
  }

  function showResult() {
    if (levelIndex < LEVELS.length - 1) {
      resultKicker.textContent = `Level ${levelIndex + 1} complete`;
      resultTitle.textContent = "Every coin collected";
      resultDescription.textContent = `${LEVEL_NAMES[levelIndex + 1]} is up next.`;
      resultAction.textContent = "Next level";
      nextLevel = levelIndex + 1;
    } else {
      resultKicker.textContent = "Campaign complete";
      resultTitle.textContent = "You ate them all!";
      resultDescription.textContent = "Every coin collected across all three levels.";
      resultAction.textContent = "Play again";
      nextLevel = 0;
    }

    result.hidden = false;
    status.textContent = `${resultTitle.textContent} ${resultDescription.textContent}`;
    resultAction.focus({preventScroll: true});
  }

  function frame(time) {
    const step = lastTime === null || document.hidden ? 0 : Math.min((time - lastTime) / 1000, 0.1);
    lastTime = time;
    level.animate(step, keys);
    if (level.status !== null && stage.dataset.state === "playing") {
      stage.dataset.state = level.status;
      clearInput();
    }
    updateCoins();
    display.drawFrame(step);

    if (!level.isFinished()) frameId = requestAnimationFrame(frame);
    else if (level.status === "lost") begin(0);
    else showResult();
  }

  document.getElementById("restart").addEventListener("click", () => begin(levelIndex, true));
  resultAction.addEventListener("click", () => begin(nextLevel, true));
  begin(0);
}

startGame();
