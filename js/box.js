class Box{
    constructor(ctx, positionX, positionY, dimensions){
        this.ctx = ctx;
        this.position = {x: positionX,
                         y: positionY
                        };
        this.width = dimensions.width;
        this.height = dimensions.height;
        this.velocity = {x: 0, y: 100};
        this.acceleration = {x: 0, y: gravity/5};
        this.health = 100;

        this.image = new Image();
        this.image.src = './assets/images/boulder.png'
    }

    draw(ctx){
        // ctx.fillStyle = 'green';
        // ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height, this.position.x, this.position.y + 15, this.width, this.height);
    }

    drawHealth(){
        ctx.fillStyle = 'rgb(1, 185, 1)';
        ctx.fillRect(this.position.x+ 25, this.position.y -25, this.health, 10);
    }
    update(ctx){
        this.draw(ctx);
        this.drawHealth();
        if(this.position.y + this.height>=(canvas.height - this.velocity.y - 33)){
            this.velocity.y = 0;
        }
        else{
            this.velocity.y  += this.acceleration.y;
        }
        this.position.y += this.velocity.y;
    }
}