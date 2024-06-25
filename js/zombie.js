class ZombieOperator{
    constructor(ctx){
        this.ctx = ctx;
        this.zombies = [];
    }

    async generate(){
        let zombiePosition;
        let zombieVelocity;
        let number =Math.random()*10
        let direction = (number>5)? 'left': 'right';

        if(direction === 'left'){
            zombiePosition = {x:0, y: canvas.height - zombieDimensions.height};
            zombieVelocity = {x: 1, y: 0};
        }
        else if(direction === 'right'){
            zombiePosition = {x: canvas.width, y: canvas.height - zombieDimensions.height};
            zombieVelocity = {x: -1, y: 0};
        }
        await sleep(1000);
        this.zombies.push(new Zombie(ctx, zombieDimensions, zombiePosition, direction, zombieVelocity));
    }

    draw(){
        this.zombies.forEach(zombie=>{
            zombie.draw();
        })
    }
}


class Zombie{
    constructor(ctx,zombieDimensions, zombiePosition, direction, zombieVelocity){
        this.dimensions = zombieDimensions;
        this.position = zombiePosition;
        this.direction = direction;
        this.velocity = zombieVelocity;
        this.ctx = ctx;
        this.image = new Image();
        if(this.direction === 'left'){
            this.image.src = './assets/images/zom-B.gif'
        }
        else{
            this.image.src = './assets/images/zom-B_right.gif'
        }
    }

    draw(){
        this.ctx.drawImage(this.image, 0,0, this.image.width, this.image.height, this.position.x, this.position.y - 30, this.dimensions.width, this.dimensions.height);
        this.update();
    }

    update(){
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        // if(this.position.y >= (canvas.height - this.height - this.velocity.y)){
        //     this.velocity.y = 0;
        //     onGround = true;
        // }
        // else{
        //     this.velocity.y += this.acceleration.y;
        //     onGround = false;
        // }
    }
}