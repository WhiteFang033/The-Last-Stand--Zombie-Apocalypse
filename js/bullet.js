class BulletOperator{
    constructor(ctx){
        this.ctx = ctx;
        this.bullets  = [];
    }

    shoot(){
        const bulletPositionX = arguments[0];
        const bulletPositionY = arguments[1];
        this.bullets.push(new Bullet(this.ctx, bulletPositionX, bulletPositionY, angle, './assets/huntress/Sprites/Arrow/Static_left.png'));
        
    }

    draw(){
        this.bullets.forEach(bullet=>{
            bullet.draw();
            console.log(bullet.position)
            if((bullet.position.x < (-canvas.width) || bullet.position.x>(canvas.width) || bullet.position.y < (-canvas.height) || bullet.position.y>(canvas.height)) && this.bullets != undefined){
                const index = this.bullets.indexOf(bullet);
                if (index > -1) { 
                this.bullets.splice(index, 1);
                }
            }
        })

        
        
    }
}


class Bullet{
    constructor(){
        const [ctx, takeOffPositionX, takeOffPositionY, bulletAngle, imgSrc] = arguments;
        this.ctx = ctx;
        this.image = new Image();
        this.image.src = imgSrc;
        this.angle = bulletAngle;
        this.takeOffPositionX = takeOffPositionX;
        this.takeOffPositionY = takeOffPositionY;
        this.position = {x: 0, y: 0};
        this.gunVelocity = 8;
        this.bulletVelocityX = this.gunVelocity*Math.cos(this.angle);
        this.bulletVelocityY = this.gunVelocity*Math.sin(this.angle);
    }
    
    draw(){
        this.ctx.fillStyle = 'blue'
        this.ctx.save();
        this.ctx.translate(this.takeOffPositionX , this.takeOffPositionY);  
        if(this.angle>-Math.PI/2 && this.angle<Math.PI/2){
            this.image.src = './assets/huntress/Sprites/Arrow/Static.png'
        }
        this.ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height, this.position.x + 25, this.position.y + 30, 30, 10)
        this.ctx.restore();
        this.update();
    }

    update(){
        this.position.x+= this.bulletVelocityX;
        this.position.y+= this.bulletVelocityY;
        this.bulletVelocityY += gravity/5;
    }
}

