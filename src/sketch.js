let player;

function setup() {
    createCanvas(windowWidth, windowHeight);
    pixelDensity(1);

    player = new Ship(300, 300, 50);
}

function draw() {
    background(0, 100, 200);

    player.update();
}

function keyPressed() {
    if (keyIsDown(87)) {
        player.nextSailMode();

    } else if (keyIsDown(83)) {
        player.prevSailMode();
    }
}