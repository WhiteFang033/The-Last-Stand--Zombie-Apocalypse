class Sprite{
    constructor(ctx, imageSrc, position, dimensions, offset = {x: 0, y: 0},  frames = 1, speed = 1, scale = 1){
        this.ctx = ctx;
        this.position = position;
        this.image = new Image();
        this.image.src = imageSrc;

        if(dimensions === null){
            console.log(dimensions);
            this.width = this.image.width;
            this.height = this.image.height;
        }else{ 
            this.width = dimensions.width;
            this.height = dimensions.height;
        }
        this.offset = offset;
        this.scale = scale
        this.frames = frames;
        this.framesDrawn = 0
        this.initalFrame = 0;
        this.speed = speed;
    }

    draw(){
        this.ctx.drawImage(this.image, 
            this.initalFrame*(this.image.width/this.frames), 
            0,
            this.image.width/this.frames,
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            this.width*this.scale, 
            this.height*this.scale);
    }
    update(){
        this.draw();
        this.framesDrawn++;

        if(this.framesDrawn % this.speed === 0){
            if(this.initalFrame < this.frames -1){
                this.initalFrame++;
            }
            else{
                this.initalFrame = 0;
            }
        }
    }
}