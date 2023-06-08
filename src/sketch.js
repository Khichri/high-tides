let player;

function setup() {
    createCanvas(800, 800);
    pixelDensity(1);

    player = new Ship(300, 300);
}

function draw() {
    background(0, 100, 200);


    push();
    textSize(32);
    text(`sail_mode: ${player.currentSailMode}`, 10, 30);
    pop();

    push();
    textSize(32);
    text(`ship_speed: ${player.velocity.mag()}`, 400, 30);
    pop();

    player.update();
    // shipStateUpdate();
}

function keyPressed() {
    if (keyIsDown(87)) {
        player.nextSailMode();

    } else if (keyIsDown(83)) {
        player.prevSailMode();
    }
}