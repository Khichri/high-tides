class Ship {
    constructor(x, y, r) {
        this.pos = createVector(x, y);
        this.radius = r;
        this.direction = createVector(this.pos.x + this.radius, y);
        this.facingDirection = "right";
        this.vel = 1;
    }

    render() {
        if (this.facingDirection == "up") {
            this.direction.x = this.pos.x;
            this.direction.y = this.pos.y - this.radius;
        } 
        if (this.facingDirection == "right") {
            this.direction.x = this.pos.x + this.radius;
            this.direction.y = this.pos.y;
        }
        if (this.facingDirection == "down") {
            this.direction.x = this.pos.x;
            this.direction.y = this.pos.y + this.radius;
        } 
        if (this.facingDirection == "left") {
            this.direction.x = this.pos.x - this.radius;
            this.direction.y = this.pos.y;
        }

        fill(255);
        ellipse(this.pos.x, this.pos.y, this.radius, this.radius);
    }

    update(x, y) {
        this.pos.x += x;
        this.pos.y += y;
    }

    listenControls() {
        if (keyIsDown(87)) { // W
            console.log(this.pos)
            this.update(0, -this.vel);
            this.facingDirection = "up";
        }
        if (keyIsDown(68)) { // D
            this.update(this.vel, 0);
            this.facingDirection = "right"
        }
        if (keyIsDown(83)) { // S
            this.update(0, this.vel);
            this.facingDirection = "down";
        }
        if (keyIsDown(65)) { // A
            this.update(-this.vel, 0);
            this.facingDirection = "left"
        }
    }
}