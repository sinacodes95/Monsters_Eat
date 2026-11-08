var LEVEL_NAMES = ["Mosslight Hollow", "Dripstone Works", "The Spore Forge"];

// @ spawn, o coin, x rock, ! poison, = horizontal patrol, | vertical patrol, v drip
var LEVELS = [
  // Low ledges and small pools introduce the jump before the final climb.
  [
    "                                                                  ",
    "                                                                  ",
    "                                                                  ",
    "                                                                  ",
    "                                                                  ",
    "                                                                  ",
    "                                                                  ",
    "                                                                  ",
    "                                          o                       ",
    "                                        xxxx                      ",
    "                                   xxxx xxxx      o               ",
    "               o             o    oxxxx         xxxxxxx           ",
    "   @    o   xxxxxx    o    xxxxxxxxxxxx         xxxxxxx     o     ",
    "xxxxxxxxxxxxxxxxxxxxxxxx   xxxxxxxxxxxx         xxxxxxxxxxxxxxxxxx",
    "xxxxxxxxxxxxxxxxxxxxxxxx!!!xxxxxxxxxxxx!!!!!!!!!xxxxxxxxxxxxxxxxxx",
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  ],
  // Drips and a bouncing hazard cross the gaps between raised platforms.
  [
    "                                                                      ",
    "                                                                      ",
    "                                                                      ",
    "                                                                      ",
    "                                                                      ",
    "                                     |                                ",
    "                                                                      ",
    "                       v                                              ",
    "                                           o o                        ",
    "                                 o       xxxxxx                    o  ",
    "                               xxxx      xxxxxx           o    xxxxxxx",
    "                  o          o xxxx               o     xxxx   xxxxxxx",
    "            o    xxxx     xxxxxxxxx             xxxxxx  xxxx          ",
    "          xxxxx  xxxx     xxxxxxxxx             xxxxxx                ",
    "  @   o                                                               ",
    "xxxxxxxxxxxxx                                                         ",
    "xxxxxxxxxxxxx                                                         ",
    "xxxxxxxxxxxxx!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  ],
  // Cross the vats, then climb back left through the narrow gantry.
  [
    "                                                                         ",
    "                                                                         ",
    "                                                                         ",
    "                                                                         ",
    "           o                                                             ",
    "          xxxx                 o                                 |       ",
    "   o      xxxx        o       xxxx             |                         ",
    "  xxxx             x=    x    xxxx       o                               ",
    "  xxxx              xxxxx               xxxx                             ",
    "      !!!           xxxxx               xxxx       o                     ",
    "                                                  xxxx     o             ",
    "                                                  xxxx   xxxx   o        ",
    "                                                     v                   ",
    "                                                       o                 ",
    "                      v                   v                           o  ",
    "                                                                   xxxxxx",
    "                                               x          o        xxxxxx",
    "                                                         xxx             ",
    "                                                o        xxx             ",
    "                                     o        xxxx               x       ",
    "                                   xxxx       xxxx                       ",
    "                          o        xxxx                                  ",
    "                         xxx                                             ",
    "                 o       xxx                                             ",
    "  @   o        xxxx                                                      ",
    "xxxxxxxxxx     xxxx                                                      ",
    "xxxxxxxxxx                                                               ",
    "xxxxxxxxxx!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  ]
];
