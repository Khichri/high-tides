class Ship {
	constructor(x, y, isControllable=false, renderData) {
		this.isControllable = isControllable;
		this.r = 35;
		this.position = createVector(x, y);
		this.angle = 0;
		this.targetAngle = 0;
		this.headingVector = p5.Vector.fromAngle(radians(this.angle));
		this.velocity = createVector(0, 0);
		this.maxSpeed = 4;
		this.turnAngle = 0;
		this.corners = [];
		this.sailModes = ["anchor", "nosail", "halfsail", "fullsail"];
		this.currentSailModeIndex = 1;
		this.currentSailMode = this.sailModes[this.currentSailModeIndex];
		this.cannonBallsFired = [];
		this.alias = "";
		this.sprite = loadImage("media/images/ship_sprite.png");
		this.turnSpeed = 50.32;
		this.thurstSpeed = 2.0;
		this.lastUpdated = 0;
	}
	
	updateShipState(data) {
		this.lastUpdated += 1;
		if(this.lastUpdated % 20 == 0) this.position = createVector(data.position.x, data.position.y);
		this.angle = data.angle;
		this.targetAngle = data.targetAngle;
		this.headingVector = p5.Vector.fromAngle(radians(this.angle));
		this.velocity = createVector(data.velocity.x, data.velocity.y);
		this.turnAngle = data.turnAngle;
		this.currentSailModeIndex = data.currentSailModeIndex;
		this.currentSailMode = this.sailModes[this.currentSailModeIndex];
		this.alias = data.alias;
	}
	
	fireCannonBall() {
		this.cannonBallsFired.push(new CannonBall(this, this.position.x, this.position.y, "cannonball"));
		if (this.isControllable) propagateCannonBallFired();
	}
	
	setup() {
		this.position = createVector(0, 0);
		// this.alias = user.is.alias;
		
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
		
		if(this.isControllable)
		{
			push();
			noStroke();
			rotate(this.targetAngle - PI / 2);
			
			push();
			texture(this.sprite);
			rect(-25, -50, 50, 100);
			pop(); 

			// circle(0, 0, this.r, this.r);
			
			pop();
			
			push();
			textSize(25);
			fill(255, 255, 0);
			text(this.alias, -30, -40);
			pop();
		}
		else
		{
			push();
			noStroke();
			translate(-player.position.x, -player.position.y);
			translate(this.position.x, this.position.y);			
			rotate(this.targetAngle - PI / 2);
			
			push();
			texture(this.sprite);
			rect(-25, -50, 50, 100);
			pop();
			
			// circle(0, 0, this.r, this.r);
			
			textSize(25);
			fill(0, 255, 0);
			// translate(this.position.x, this.position.y);	
			rotate(-(this.targetAngle - PI / 2));	
			text(this.alias, -45, -40);
			pop();
			
			push();
			
			pop();
			
			
		}
		
		if (this.isControllable)
		{
			push();
			translate(-this.position.x, -this.position.y);
			for (let cannonBall of this.cannonBallsFired) cannonBall.render();
			pop();
		}
		else
		{
			push();
			translate(-player.position.x, -player.position.y);
			// translate(this.position.x, this.position.y);	
			for (let cannonBall of this.cannonBallsFired) cannonBall.render();
			pop();
		}
	}
	
	update() {
		if (user.is && !this.alias) {
			this.alias = user.is.alias;
		}
		
		if (this.angle != this.targetAngle) {
			this.angle = lerp(this.angle, this.targetAngle, this.turnSpeed *  deltaTime / 1000.0);
			this.headingVector = p5.Vector.fromAngle(radians(this.angle));
		}
		
		if (this.isControllable) this.handleShipTurning();
		
		this.currentSailMode = this.sailModes[this.currentSailModeIndex];
		
		var tempVel = createVector(this.velocity.x, this.velocity.y);
		tempVel.mult(60 * deltaTime / 1000.0);
		this.position.add(tempVel);
		
		if (this.currentSailModeIndex == 0) { // anchor
			this.maxSpeed = 4;
			this.velocity.mult(0.95);
			if (this.velocity.mag() <= 0.1) this.velocity.mult(0);
			this.turnAngle = 0;
		} else if (this.currentSailModeIndex == 1) { // nosail
			this.maxSpeed = 4;
			this.velocity.mult(0.97);
			if (this.velocity.mag() <= 0.1) this.velocity.mult(0);
			this.turnAngle = 0.003;
			// this.turnAngle = 0.01 / this.velocity.mag();
		} else if (this.currentSailModeIndex == 2) { // halfsail
			this.maxSpeed = 4;
			this.boost(2.0 * this.thurstSpeed);
			this.velocity.mult(0.97);
			this.turnAngle = 0.009;
		} else if (this.currentSailModeIndex == 3) { // fullsail
			this.maxSpeed = 6;
			this.boost(4.0 * this.thurstSpeed);
			this.velocity.mult(0.98);
			this.turnAngle = 0.006;
		}
		// this.velocity.limit(this.maxSpeed);
		
		
		for (let cannonBall of this.cannonBallsFired) {
			cannonBall.update();
			if (cannonBall.life < 0) {
				this.cannonBallsFired.splice(this.cannonBallsFired.indexOf(cannonBall), 1);
				break;
			}
		}
		
		if (this.isControllable) 
		{
			for (let [index, cannonBall] of this.cannonBallsFired.entries()) 
			{
				for (const otherShip in peerConnections)
				{
					if(cannonBall.isColliding(peerConnections[otherShip].ship))
					{
						cannonBall.life = -1;
						propagateCannonBallCollision(cannonBall, peerConnections[otherShip].ship, index);
					}
				}
			}	
		}
	}
	
	turn(angle) {
		this.targetAngle += angle * 60.0 *  deltaTime / 1000.0;
	}
	
	boost(val) {
		const targetVel = p5.Vector.fromAngle(this.angle).setMag(val);
		if(this.velocity.mag() < val * 0.8) this.velocity = p5.Vector.lerp(this.velocity, targetVel, 0.1);
		// this.velocity.limit(this.maxSpeed);
	}
	
	applyForce(force) {
		this.velocity.add(force);
		this.position.add(this.velocity);
	}
	
	handleShipTurning(givenKeyCode) {
		if (this.isControllable) {
			if (keyIsDown(68)) this.turn(this.turnAngle)
			else if (keyIsDown(65)) this.turn(-this.turnAngle);
		} else {
			if (givenKeyCode == 68) this.turn(this.turnAngle);
			else if (givenKeyCode == 65) this.turn(-this.turnAngle);
		}	
	}
	
	handleSailModeSwitching(givenKeyCode) {
		if (this.isControllable) {
			if (keyIsDown(87)) this.nextSailMode();
			else if (keyIsDown(83)) this.prevSailMode();
			if (keyIsDown(66)) this.fireCannonBall();
		} else {
			if (givenKeyCode == 87) this.nextSailMode();
			else if (givenKeyCode == 83) this.prevSailMode();
			if (givenKeyCode == 66) this.fireCannonBall();
		}
	}
}