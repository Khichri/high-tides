let player;

function setup() {
    createCanvas(windowWidth, windowHeight);
    pixelDensity(1);

    player = new Ship(300, 300);
}

function draw() {
    background(0, 100, 200);

    player.update();
}

function keyPressed() {
    if (keyIsDown(49)) {
        player.currentSailMode = "anchor";
        console.log(key)
    } else if (keyIsDown(50)) {
        player.currentSailMode = "halfsail";
    } else if (keyIsDown(51)) {
        player.currentSailMode = "fullsail";
    } else if (keyIsDown(52)) {
        player.currentSailMode = "nosail";
    }
}