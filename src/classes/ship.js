class Ship {
	constructor(x, y) {
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

	render() {
		this.poly[0] = createVector(-this.r, this.r);
		this.poly[1] = createVector(this.r, this.r);
		this.poly[2] = createVector(this.r / 2, -2 * this.r);
		this.poly[3] = createVector(-this.r / 2, -2 * this.r);

		for (let i = 0; i < this.poly.length; i++) {
			this.poly[i] = this.poly[i].rotate(this.targetAngle + PI / 2);
			//this.poly[i].add(this.position);
		}

		push();
		//translate(this.position.x, this.position.y);
		fill(139, 69, 19);
		noStroke();
		beginShape();
		vertex(this.poly[0].x, this.poly[0].y);
		vertex(this.poly[1].x, this.poly[1].y);
		vertex(this.poly[2].x, this.poly[2].y);
		vertex(this.poly[3].x, this.poly[3].y);
		endShape(CLOSE);

		// TODO: render the ship as a rect


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
			if (this.velocity.mag() < 4.0) this.boost(0.05);
			this.turnAngle = 0.010;
		} else if (this.currentSailMode == "fullsail") {
			if (this.velocity.mag() < 2.0) this.boost(0.2);
			else if (this.velocity.mag() < 4.0) this.boost(0.4);
			else this.boost(0.8);
			this.velocity.mult(0.91);
			this.turnAngle = 0.015;
		}

		// console.log(this.velocity)
		// this.renderRipples();

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