let player;

function setup() {
    createCanvas(600, 600);

    player = new Ship(300, 300, 50);
}

function draw() {
    background(0);

    player.render();
    player.listenControls();
}