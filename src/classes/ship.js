class Ship {
	constructor(x, y, isCurrentPlayer = false) {
        this.isCurrentPlayer = isCurrentPlayer
		this.r = 15;
		this.position = createVector(0, 0);
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
		this.cannonBallsFired = [];
        this.sprite = loadImage("media/images/ship_sprite.png");
	}

	fireCannonBall() {
        this.cannonBallsFired.push(new CannonBall(this, this.position.x, this.position.y, "cannonball"));
	}

	setup() {
		this.position = createVector(0, 0);
	}

	nextSailMode() {
		if (this.currentSailModeIndex < 3) ++this.currentSailModeIndex;
	}

	prevSailMode() {
		if (this.currentSailModeIndex > 0) --this.currentSailModeIndex;
		this.currentSailMode = "nosail";
	}

	render() 
    {
        if(this.isCurrentPlayer)
        {
		    push();
			noStroke();
            rotate(this.targetAngle - PI / 2);
            texture(this.sprite);
            rect(-25, -50, 50, 100);
    		pop();
        }
        else
        {
             // TODO   
        }

        // render the cannon balls here
        push();
        translate(-this.position.x, -this.position.y);
        
		for (let cannonBall of this.cannonBallsFired) {
		 	cannonBall.render();
		}
        
        pop();
	}

	update(x, y) {
		if (this.angle != this.targetAngle) {
			this.angle = lerp(this.angle, this.targetAngle, 0.05);
			this.headingVector = p5.Vector.fromAngle(radians(this.angle));
		}

		this.listenControls();

		this.currentSailMode = this.sailModes[this.currentSailModeIndex];

		this.position.add(this.velocity);

		if (this.currentSailMode == "anchor") {
			this.velocity.mult(0.97);
			if (this.velocity.mag() <= 0.1) this.velocity.mult(0);
			this.turnAngle = 0;
		} else if (this.currentSailMode == "nosail") {
			this.velocity.mult(0.999);
			if (this.velocity.mag() <= 0.1) this.velocity.mult(0);
			this.turnAngle = 0.003;
			// this.turnAngle = 0.01 / this.velocity.mag();
		} else if (this.currentSailMode == "halfsail") {
			this.velocity.mult(0.99);
			if (this.velocity.mag() < 2.0) this.boost(0.05);
			this.turnAngle = 0.009;
		} else if (this.currentSailMode == "fullsail") {
			if (this.velocity.mag() < 1.0) this.boost(0.1);
			else if (this.velocity.mag() < 2.0) this.boost(0.2);
			else this.boost(0.4);
			this.velocity.mult(0.91);
			this.turnAngle = 0.006;
		}

		for (let cannonBall of this.cannonBallsFired) 
        {
		 	cannonBall.update();
			if (cannonBall.life < 0) 
            {
                this.cannonBallsFired.splice(this.cannonBallsFired.indexOf(cannonBall), 1);
				break;
			}
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