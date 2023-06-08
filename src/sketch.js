let player;

function setup() {
    createCanvas(800, 800);
    pixelDensity(1);

    player = new Ship(300, 300);
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