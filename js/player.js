class Player extends Sprite{
    constructor(ctx, playerDimensions, gunDimensions, position, velocity, acceleration, imageSrc){

        super(ctx, imageSrc, position, null , {x: 50, y: 150}, 10, 3, 3);

        this.ctx = ctx;
        this.width = playerDimensions.width;
        this.height = playerDimensions.height;
        this.gunDimensions = gunDimensions
        this.position = position;
        this.velocity = velocity;
        this.acceleration = acceleration;
        this.framesDrawn = 0
        this.initalFrame = 0;

        this.bulletOperator = new BulletOperator(this.ctx);
        this.zombieOperator = new ZombieOperator(this.ctx);
        this.zombieOperator.generate();
        
    }
    
    drawGun(){
        this.ctx.save();
        this.ctx.translate(this.position.x+25, this.position.y);
        this.ctx.rotate(this.gunDimensions.gunAngle);
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.gunDimensions.width, this.gunDimensions.height);
        this.ctx.rotate(0);
        this.ctx.restore();
    }
    shoot(){
        const bulletPositionX = arguments[0];
        const bulletPositionY = arguments[1];
        this.bulletOperator.shoot(bulletPositionX+30, bulletPositionY);
        
    }
    
    update(){

        this.draw();
        this.drawGun();
        this.framesDrawn++;

        if(this.framesDrawn % this.speed === 0){
            if(this.initalFrame < this.frames -1){
                this.initalFrame++;
            }
            else{
                this.initalFrame = 0;
            }
        }
        this.bulletOperator.draw();
        boxes.forEach(box=>{
            box.update(this.ctx);
        })
        this.zombieOperator.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.velocity.x += this.acceleration.x;
        if(this.position.y + this.height >= (canvas.height - this.velocity.y -10)){
            this.velocity.y = 0;
            onGround = true;
        }
        else if(boxes[0] != undefined && (this.position.y + this.height + boxes[0].height >= (canvas.height - this.velocity.y)) && (this.position.x-boxes[0].position.x)>=0 &&(this.position.x-boxes[0].position.x)<= boxDimensions.width){
            this.velocity.y = 0;
            onGround = true;
        }
        else if(boxes[1] != undefined &&(this.position.y + this.height + boxes[1].height >= (canvas.height - this.velocity.y)) && (this.position.x-boxes[1].position.x)>=0 &&(this.position.x-boxes[1].position.x)<= boxDimensions.width){
            this.velocity.y = 0;
            onGround = true;
        }
        else{
            this.velocity.y += this.acceleration.y;
            onGround = false;
        }

    }
}