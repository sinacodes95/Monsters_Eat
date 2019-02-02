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


var scale = 15;


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


