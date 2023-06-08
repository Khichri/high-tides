let player;
let world;
let gl;

function preload() 
{
    world = new World();
    player = new Ship(300, 300, 50);
}

function setup() {
    // set the canvas a square for 2 reasons
    // first  : it's easier to work with as no calculations are needed for aspect ratio
    // second : we need a panel in the page for the ui of the game
    createCanvas(windowHeight, windowHeight, WEBGL);
    gl = this._renderer.GL;
    //pixelDensity(1);

    world.setup();
}

function draw() {
    // this color is for debugging as the background should be completely
    // hidden by the world and other objects so it shouldn't be visible
    background(242, 0, 255);

    world.update();
    player.update();

    world.render();
    player.render();
}

// better to move this to a seperate file called player controller for controllinjg current player
function keyPressed() {
    if (keyIsDown(87)) {
        player.nextSailMode();

    } else if (keyIsDown(83)) {
        player.prevSailMode();
    }
}