class Ship {
    constructor(x, y, npc=false) {
        this.npc = npc;
        this.r = 10;
        this.position = createVector(x, y);
        this.angle = 0;
        this.targetAngle = 0;
        this.headingVector = p5.Vector.fromAngle(radians(this.angle));
        this.velocity = createVector(0, 0);
        this.maxSpeed = 40;
        this.velocityDamping = 0.97;
        this.turnAngle = this.velocity.mag() / 100;
        this.poly = [];
        this.sailModes = ["anchor", "nosail", "halfsail", "fullsail"];
        this.currentSailModeIndex = 1;
        this.currentSailMode = this.sailModes[this.currentSailModeIndex];
    }

    nextSailMode() {
        if (this.currentSailModeIndex < 3) ++this.currentSailModeIndex;
    }

    prevSailMode() {
        if (this.currentSailModeIndex > 0) --this.currentSailModeIndex;
        this.currentSailMode = "nosail";
    }

    render() {



        this.poly[0] = createVector(-this.r, this.r);
        this.poly[1] = createVector(this.r, this.r);
        this.poly[2] = createVector(this.r / 2, -2 * this.r);
        this.poly[3] = createVector(-this.r / 2, -2 * this.r);

        for (let i = 0; i < this.poly.length; i++) {
          this.poly[i] = this.poly[i].rotate(this.targetAngle + PI / 2);
          this.poly[i].add(this.position);
        }

        push();
        fill(139,69,19);
        noStroke();
        beginShape();
        vertex(this.poly[0].x, this.poly[0].y);
        vertex(this.poly[1].x, this.poly[1].y);
        vertex(this.poly[2].x, this.poly[2].y);
        vertex(this.poly[3].x, this.poly[3].y);
        endShape(CLOSE);
        pop();
    }

    update(x, y) {
        if (this.angle != this.targetAngle) {
            this.angle = lerp(this.angle, this.targetAngle, 0.05);
            this.headingVector = p5.Vector.fromAngle(radians(this.angle));
        }


        if (!this.npc) this.listenControls();

        this.currentSailMode = this.sailModes[this.currentSailModeIndex];

        this.position.add(this.velocity);

        if (this.currentSailMode == "anchor") {
            this.velocity.mult(0.97);
            if (this.velocity.mag() <= 0.1) this.velocity.mult(0);
            this.turnAngle = 0;
        } else if (this.currentSailMode == "nosail") {
            this.velocity.mult(0.999);
            if (this.velocity.mag() <= 0.1) this.velocity.mult(0);
            // this.turnAngle = 0.003;
            this.turnAngle = 0.01 / this.velocity.mag();
        } else if (this.currentSailMode == "halfsail") {
            this.velocity.mult(0.99);
            if (this.velocity.mag() < 1.0) this.boost(0.05);
            this.turnAngle = 0.010;
        } else if (this.currentSailMode == "fullsail") {
            if (this.velocity.mag() < 1.0) this.boost(0.1);
            else if (this.velocity.mag() < 2.0) this.boost(0.2);
            else this.boost(0.3);
            this.velocity.mult(0.91);
            this.turnAngle = 0.015;
        }

        // console.log(this.velocity)
        // this.renderRipples();
      
    }

    
    // ripples will be done by world in shader
    renderRipples() {
        loadPixels();

        for (let i = 1; i < width - 1; ++i) {
            for (let j = 1; j < height - 1; ++j) {
                this.currentRippleLocations[i][j] = (
                    this.previousRippleLocations[i-1][j] + 
                    this.previousRippleLocations[i+1][j] + 
                    this.previousRippleLocations[i][j-1] +
                    this.previousRippleLocations[i][j+1]
                ) / 2.0 - this.currentRippleLocations[i][j];

                this.currentRippleLocations[i][j] *= 0.5;

                let index = (i + j * width) * 4;
                pixels[index + 0] = this.currentRippleLocations[i][j];
                pixels[index + 1] = this.currentRippleLocations[i][j];
                pixels[index + 2] = this.currentRippleLocations[i][j];
            }
        }

        updatePixels();

        let tmp = this.previousRippleLocations;
        this.previousRippleLocations = this.currentRippleLocations;
        this.currentRippleLocations = tmp;

        for (let i=0; i<width; ++i) {
           this.currentRippleLocations[i][0] = 0.0;
           this.currentRippleLocations[i][height-1] = 0.0;
           this.currentRippleLocations[0][i] = 0.0;
           this.currentRippleLocations[width-1][i] = 0.0;
        }
    }
    

    turn(angle) {
        this.targetAngle += angle;
    }

    boost(val) {
        let thrust = p5.Vector.fromAngle(this.angle).setMag(val);
        this.velocity.add(thrust);
        this.velocity.limit(this.maxSpeed);
    }

    listenControls() {

        if (keyIsDown(68)) {
            this.turn(this.turnAngle)
        } else if (keyIsDown(65)) {
            this.turn(-this.turnAngle);
        }
    }
}