var LEVELS = [
  ["                                                                                ",
   "                                                                                ",
   "                                                                                ",
   "                                                                                ",
   "                                                                                ",
   "                                                                                ",
   "                                                    o             xxx           ",
   "                                                   xxx     xx    xx!xx          ",
   "                                    o o      xx                  x!!!x          ",
   "                                                                 xx!xx          ",
   "                                   xxxxx               xxxx       xvx           ",
   "                                                        ||                    xx",
   "  xxxxxx                                  o o                                x  ",
   "  x                     o                                                    x  ",
   "  x                                      xxxxx                             o x  ",
   "  x          xxxx       o                                                    x  ",
   "  x  @       x  x       x                                        xxxxx       x  ",
   "  xxxxxxxxxxxx  xxxxxxxxxxxxxxx   xxxxxxxxxxxxxxxxxxxx     xxxxxxx   xxxxxxxxx  ",
   "                              x   x                  x     x                    ",
   "                              x!!!x                  x!!!!!x                    ",
   "                              x!!!x                  x!!!!!x                    ",
   "                              xxxxx                  xxxxxxx                    ",
   "                                                                                ",
   "                                                                                "],
  ["                                                                                                              ",
   "                                                                                                              ",
   "                                                                          o                                   ",
   "                                                                         xxx    o                             ",
   "                                                                               xxx                            ",
   "                                                                              x!!!x                           ",
   "                                                                               xxx                            ",
   "                                                                                                              ",
   "                                                                            x x          o                    ",
   "                                                                           x!!!x         o                    ",
   "                                                                            xxx          o                    ",
   "                                                                    o                    o                    ",
   "                                           = = = = x               xxx                                        ",
   "                                                                  x!!!x       o                               ",
   "                                         = = = =x     o            xxx       xxx                              ",
   "                                                                            x!!!x  xxx   o                    ",
   "                              o   o                        xxxxx             xxv        xxx                   ",
   "                                                                     x                 x!!!x                  ",
   "                             xxx xxxx            o o xx!!!!!!!!!!!!!!x                   vx                   ",
   "                             x xxx xx               xxx!!!!!!!!!!!!!!x                                        ",
   "                             x           xxx   xxxxxxxxxxxxxxxxxxxxxxx                                        ",
   "                             xx           xx                                         xxx                      ",
   "  xxx                         x     xx    x                                         x!!!x                xxx  ",
   "  x x                         x    xxx    x                                          xxx                 x x  ",
   "  x                           x    xxx    xxxxxxx                        xxxxx                             x  ",
   "  x                           x           x                              x   x                             x  ",
   "  x       xxxx                xxx         x                              x x x xxx                         x  ",
   "  x         v                             x       |xxxx|    |xxxx|     xxx xxx                             x  ",
   "  x                xxx            o o     x                              x         xxx                     x  ",
   "  x               xxxxx       xx   xxx    x                             xxx       x!!!x          x         x  ",
   "  x             o  xxx  o     x    xxx    x                             xxx        xxx          xxx        x  ",
   "  x                xxx        xxxxxxxxxxxxx  x oo x    x oo x    x oo  xxxxx                    xxx        x  ",
   "  x      @          x         x           x!!x    x!!!!x    x!!!!x    xxxxxxx                    x    o o  x  ",
   "  xxxxxxxxxxxxxxxxxxxxxxxxxxxxx           xxxxxxxxxxxxxxxxxxxxxxxxxxxxx     xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  ",
   "                                                                                                              ",
   "                                                                                                              "],
  ["                                                                                                              ",
   "                                                                                             o o oxxx x       ",
   "              xxxxxxxx                                                                                x       ",
   "       !  o  !                                                xxxxx xxxxx xxxxx xxxxx xxxxx xxxxx xxxxx       ",
   "       x     x                                                x   x x   x x   x x   x x   x x   x x           ",
   "       x= o  x            x                                   xxx x xxx x xxx x xxx x xxx x xxx x xxxxx       ",
   "       x     x                                                  x x   x x   x x   x x   x x   x x     x       ",
   "       !  o  !            o                                  xxxx xxxxx xxxxx xxxxx xxxxx xxxxx xxxxxxx       ",
   "                                                                                                              ",
   "          o              xxx                              xx                                                  ",
   "                                                                                                              ",
   "                                                                                                              ",
   "                                                      xx                                                      ",
   "                   xxx         xxx                                                                            ",
   "                                                                                                              ",
   "                          o                                                     x      x                      ",
   "                                                          xx     xx                                           ",
   "             xxx         xxx         xxx                                 x                  x                 ",
   "                                                                                                              ",
   "                                                                 ||                                           ",
   "       xxxxxx                                                                                                 ",
   "  x         x o xxxxxxxxx o xxxxxxxxx o xx                                                x                   ",
   "  x         x   x       x   x       x   x                 ||                  x     x                         ",
   "  x  @      xxxxx   o   xxxxx   o   xxxxx                                                                     ",
   "  xxxxxxx                                     xxxxx     xxxx     xxx    xxx                                   ",
   "        x=                  =                =x   x                     xxx                                   ",
   "        xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx   x!!!!!!!!!!!!!!!!!!!!!xxx!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
   "                                                  xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
   "                                                                                                              "]
];
var arrowCodes = {37: "left", 38: "up", 39: "right"};
var scale = 15;
var maxStep = 0.05;
var playerXSpeed = 10;
var gravity = 30;
var jumpSpeed = 17;

function Vector(x, y) {
	this.x = x; this.y = y;
}

Vector.prototype.plus = function(other) {
	return new Vector(this.x + other.x, this.y + other.y);
};

Vector.prototype.times = function(scale) {
	return new Vector(this.x * scale, this.y * scale);
};

var actorchars =  {
	"@": Player,
	"o": Coin,
	"=": Poison,
	"|": Poison,
	"v": Poison
};

function Player(pos) {
	this.pos = pos.plus(new Vector(0, -0.5));
	this.size = new Vector(0.8, 1.5);
	this.speed = new Vector(0, 0);
}
Player.prototype.type = "player";

function Poison(pos, char) {
	this.pos = pos;
	this.size = new Vector(1, 1);
	if (char === "=")
		this.speed = new Vector(2, 0);
	else if (char === '|')
		this.speed = new Vector(0, 2);
	else if (char === 'v'){
		this.speed = new Vector(0, 3); 		   
		this.repeatPos = pos;
	}
}
Poison.prototype.type = "poison";

function Coin(pos) {
	this.basePos = this.pos = pos;
	this.size = new Vector(.6, .6);
	this.wobble = Math.random() * Math.PI * 2;
}
Coin.prototype.type = "coin";

Level.prototype.isFinished = function() {
  return this.status != null && this.finishDelay < 0;
};

function Level(plan) {
	this.width = plan[0].length;
	this.height = plan.length;
	this.grid = [];
	this.actors = [];
	
	for (var y = 0; y < this.height; y++) {
		var line = plan[y],  gridLine = [];
		for (var x = 0; x < this.width; x++) {
			var char = line[x], fieldType = null;
			var Actor = actorchars[char];
			if (Actor)
				this.actors.push(new Actor(new Vector(x, y), char));
			else if (char === "x")
				fieldType = "wall";
			else if (char === "!")
				fieldType = "poison";
			else if (char === "|")
				fieldType = "poison";
			else if (char === "=")
				fieldType = "poison";
			else if (char === "v"){
				fieldType = "poison";
				console.log(fieldType);
			}
			gridLine.push(fieldType)
		}
		this.grid.push(gridLine);
	}
	this.player = this.actors.filter(function(actor) {
		return actor.type === "player"
	})[0];	
	this.status = this.finishDelay = null;
}

function element(name, className) {
	var elem = document.createElement(name);
	if(className) elem.className = className;
	return elem;
}

function DOMDisplay(parent, level) {
	this.wrap = parent.appendChild(element("div", "game"));
	this.level = level;
	
	this.wrap.appendChild(this.drawBackground());
	this.actorLayer = null;
	this.drawFrame();
}

DOMDisplay.prototype.drawBackground = function() {
	var table = element("table", "background");
	table.style.width = this.level.width * scale + "px";
	table.style.height = this.level.height * scale + "px";
	this.level.grid.forEach(function(row) {
  var rowElement = table.appendChild(element("tr"));
		rowElement.style.height = scale + "px";
		row.forEach(function(type) {
			rowElement.appendChild(element("td", type));
		});
	});
	return table;
};

DOMDisplay.prototype.drawActors = function() {
	var wrap = element("div");
	this.level.actors.forEach(function(actor) {
		var rect = wrap.appendChild(element("div", "actor " + actor.type));
		rect.style.width = actor.size.x * scale + "px";
		rect.style.height = actor.size.y * scale + "px";
		rect.style.left = actor.pos.x * scale + "px";
		rect.style.top = actor.pos.y * scale + "px";
	});
	return wrap;
}

DOMDisplay.prototype.drawFrame = function() {
	if (this.actorLayer)
		this.wrap.removeChild(this.actorLayer);
	this.actorLayer = this.wrap.appendChild(this.drawActors());
	this.wrap.className = "game " + (this.level.status || "");
	this.scrollPlayerIntoView();
};

DOMDisplay.prototype.scrollPlayerIntoView = function() {
  var width = this.wrap.clientWidth;
  var height = this.wrap.clientHeight;
  var margin = width / 3;

  var left = this.wrap.scrollLeft, right = left + width;
  var top = this.wrap.scrollTop, bottom = top + height;

  var player = this.level.player;
  var center = player.pos.plus(player.size.times(1))
                 .times(scale);

  if (center.x < left + margin)
    this.wrap.scrollLeft = center.x - margin;
  else if (center.x > right - margin)
    this.wrap.scrollLeft = center.x + margin - width;
  if (center.y < top + margin)
    this.wrap.scrollTop = center.y - margin;
  else if (center.y > bottom - margin)
    this.wrap.scrollTop = center.y + margin - height;
};

DOMDisplay.prototype.clear = function() {
	this.wrap.parentNode.removeChild(this.wrap);
};

Level.prototype.obstacleAt = function(pos, size) {
  var xStart = Math.floor(pos.x);
  var xEnd = Math.ceil(pos.x + size.x);
  var yStart = Math.floor(pos.y);
  var yEnd = Math.ceil(pos.y + size.y);

  if (xStart < 0 || xEnd > this.width || yStart < 0)
    return "wall";
  if (yEnd > this.height)
    return "poison";
  for (var y = yStart; y < yEnd; y++) {
    for (var x = xStart; x < xEnd; x++) {
      var fieldType = this.grid[y][x];
      if (fieldType) return fieldType;
    }
  }
};

Level.prototype.actorAt = function(actor) {
  for (var i = 0; i < this.actors.length; i++) {
    var other = this.actors[i];
    if (other != actor &&
        actor.pos.x + actor.size.x > other.pos.x &&
        actor.pos.x < other.pos.x + other.size.x &&
        actor.pos.y + actor.size.y > other.pos.y &&
        actor.pos.y < other.pos.y + other.size.y)
      return other;
  }
};

Level.prototype.animate = function(step, keys) {
  if (this.status != null)
    this.finishDelay -= step;

  while (step > 0) {
    var thisStep = Math.min(step, maxStep);
    this.actors.forEach(function(actor) {
      actor.act(thisStep, this, keys);
    }, this);
    step -= thisStep;
  }
};

Poison.prototype.act = function(step, level) {
  var newPos = this.pos.plus(this.speed.times(step));
  if (!level.obstacleAt(newPos, this.size))
    this.pos = newPos;
  else if (this.repeatPos)
    this.pos = this.repeatPos;
  else
    this.speed = this.speed.times(-1);
};

var wobbleSpeed = 8, wobbleDist = 0.07;

Coin.prototype.act = function(step) {
  this.wobble += step * wobbleSpeed;
  var wobblePos = Math.sin(this.wobble) * wobbleDist;
  this.pos = this.basePos.plus(new Vector(0, wobblePos));
};

Player.prototype.moveX = function(step, level, keys) {
  this.speed.x = 0;
  if (keys.left) this.speed.x -= playerXSpeed;
  if (keys.right) this.speed.x += playerXSpeed;

  var motion = new Vector(this.speed.x * step, 0);
  var newPos = this.pos.plus(motion);
  var obstacle = level.obstacleAt(newPos, this.size);
  if (obstacle)
    level.pCollision(obstacle);
  else
    this.pos = newPos;
};

Player.prototype.moveY = function(step, level, keys) {
  this.speed.y += step * gravity;
  var motion = new Vector(0, this.speed.y * step);
  var newPos = this.pos.plus(motion);
  var obstacle = level.obstacleAt(newPos, this.size);
  if (obstacle) {
    level.pCollision(obstacle);
    if (keys.up && this.speed.y > 0)
      this.speed.y = -jumpSpeed;
    else
      this.speed.y = 0;
  } else {
    this.pos = newPos;
  }
};

Player.prototype.act = function(step, level, keys) {
  this.moveX(step, level, keys);
  this.moveY(step, level, keys);

  var otherActor = level.actorAt(this);
  if (otherActor)
    level.pCollision(otherActor.type, otherActor);

  if (level.status == "lost") {
    this.pos.y += step;
    this.size.y -= step;
  }
};

Level.prototype.pCollision = function(type, actor) {
  if (type == "poison" && this.status == null) {
    this.status = "lost";
    this.finishDelay = 1;
  } else if (type == "coin") {
    this.actors = this.actors.filter(function(other) {
      return other != actor;
    });
    if (!this.actors.some(function(actor) {
      return actor.type == "coin";
    })) {
      this.status = "won";
      this.finishDelay = 1;
    }
  }
};

function trackKeys(codes) {
  var pressed = Object.create(null);
  function handler(event) {
    if (codes.hasOwnProperty(event.keyCode)) {
      var down = event.type == "keydown";
      pressed[codes[event.keyCode]] = down;
      event.preventDefault();
    }
  }
  addEventListener("keydown", handler);
  addEventListener("keyup", handler);
  return pressed;
}

function runAnimation(frameFunc) {
  var lastTime = null;
  function frame(time) {
    var stop = false;
    if (lastTime != null) {
      var timeStep = Math.min(time - lastTime, 100) / 1000;
      stop = frameFunc(timeStep) === false;
    }
    lastTime = time;
    if (!stop)
      requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

var arrows = (function (a) {
  var pressed = Object.create(null);
  function handler(event) {
    if (a.hasOwnProperty(event.keyCode)) {
      var down = event.type == "keydown";
      pressed[a[event.keyCode]] = down;
      event.preventDefault();
    }
  }
  addEventListener("keydown", handler);
  addEventListener("keyup", handler);
  return pressed;
})(arrowCodes);

function playLevel(level, Display, andThen) {
  var display = new Display(document.body, level);
  runAnimation(function(step) {
    level.animate(step, arrows);
    display.drawFrame(step);
    if (level.isFinished()) {
      display.clear();
      if (andThen)
        andThen(level.status);
      return false;
    }
  });
}

function app(plans, Display) {
  function startLevel(n) {
    playLevel(new Level(plans[n]), Display, function(status) {
      if (status == "lost")
        startLevel(n);
      else if (n < plans.length - 1)
        startLevel(n + 1);
      else
        alert("You win!");
    });
  }
  startLevel(0);
}

app(LEVELS, DOMDisplay);