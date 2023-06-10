class CannonBall 
{
	constructor(parentShip, x, y, type) 
    {
		this.position = createVector(x, y);
        this.velocity = createVector(0, 0);
        this.parentShip = parentShip;
        this.shipVel = createVector(parentShip.velocity.x, parentShip.velocity.y);
        this.shipVel.mult(0.8);
        this.type = type;
        
        this.directionVector = p5.Vector.fromAngle(parentShip.targetAngle - HALF_PI);
        this.ballSpeed = 0.5;
        this.damageFactor = 1.0;
        this.life = 700.0
	}

	render() 
    {
		push();
		fill(0);
        translate(this.position.x, this.position.y);
		circle(0, 0, 10, 10);
		pop();
	}

    isColliding(otherShip)
    {
        var distance = dist(this.position.x, this.position.y, otherShip.position.x, otherShip.position.y);
        if (distance < otherShip.r)
        {
            return true;
        }
        return false;
    }

	update() 
    {
        this.directionVector.setMag(this.ballSpeed * deltaTime);
		this.position.add(this.directionVector);
        this.position.add(this.shipVel);
        this.life -= deltaTime;
	}
}