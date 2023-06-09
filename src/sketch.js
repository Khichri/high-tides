let player;
let world;
let gl;
let players = {};

function preload() {
    world = new World();
    player = new Ship(0, 0, true);
}

function setup() {
    // second : we need a panel in the page for the ui of the game
    createCanvas(windowHeight, windowHeight, WEBGL);
    gl = this._renderer.GL;

    world.setup();
    player.setup();

    setInterval(() => {
        propagateShipStateUpdate(player);
    }, 50);
}

function draw() {
    // this color is for debugging as the background should be completely
    // hidden by the world and other objects so it shouldn't be visible
    background(242, 0, 255);

    world.update(player.position);



    player.update();
    for (const peerConn in peerConnections)
        peerConnections[peerConn].ship.update();

    world.render();
    player.render();
    for (const peerConn in peerConnections)
        peerConnections[peerConn].ship.render();



    push();
    textSize(32);
    fill(255, 255, 0);
    text(`sail_mode: ${player.currentSailMode}`, -width / 2 + 10, -height / 2 + 30);
    pop();

    push();
    textSize(32);
    fill(255, 255, 0);
    text(`ship_speed: ${player.velocity.mag()}`, -width / 2 + 400, -height / 2 + 30);
    pop();

  
}

// better to move this to a seperate file called player controller for controllinjg current player
function keyPressed() {
    player.handleSailModeSwitching();

    // shipStateUpdate(player)

}