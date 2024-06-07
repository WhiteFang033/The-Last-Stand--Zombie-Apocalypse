var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

//dimensions of the canvas
canvas.width = 1024;
canvas.height = 576;

//set the value of gravity
const gravity = .8;

//set player properties
var playerDimensions = {width: 50, height: 150};
var playerPosition = {x: 500, y: 0};
var playerVelocity = {x: 0, y: 0};
var playerAcceleration = {x: 0, y: gravity};

//set gun properties
var gunDimension = { width: 130, height: 10, gunAngle: 0}

ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

var lastKeyPressed;
var onGround;
var angle = 0;
var hotKeys ={
    w:{
        pressed: false
    },
    s:{
        pressed: false
    },
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    space: {
        pressed: false
    },
    rightClick: {
        clicked: false
    }
}

class Sprite{
    constructor(playerDimensions, gunDimensions, position, velocity, acceleration){
        this.width = playerDimensions.width;
        this.height = playerDimensions.height;
        this.gunDimensions = gunDimension
        this.position = position;
        this.velocity = velocity;
        this.acceleration = acceleration;
    }

    draw(){
        ctx.fillStyle = 'red';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        ctx.save();
        ctx.translate(this.position.x+18, this.position.y+30);
        ctx.rotate(this.gunDimensions.gunAngle);
        ctx.fillStyle = 'blue';
        ctx.fillRect(0, 0, this.gunDimensions.width, this.gunDimensions.height);
        ctx.rotate(0);
        ctx.restore();
    }

    shootBullet(){
        ctx.save();
        ctx.translate(this.position.x, this.position.y+30);
        ctx.rotate(this.gunDimensions.gunAngle)
        ctx.fillRect(this.gunDimensions.width, this.gunDimensions.height, 10, 10);
        ctx.rotate(0);
        ctx.restore();
    }

    update(){
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        this.velocity.x += this.acceleration.x;
        if(this.position.y >= (canvas.height - this.height - this.velocity.y)){
            this.velocity.y = 0;
            onGround = true;
        }
        else{
            this.velocity.y += this.acceleration.y;
            onGround = false;
        }

        if(hotKeys.rightClick.pressed === true){
            this.shootBullet();
            hotKeys.rightClick.pressed = false;
        }

    }
}

const player = new Sprite(playerDimensions, gunDimension, playerPosition, playerVelocity, playerAcceleration);

function animate(){
    window.requestAnimationFrame(animate);
    ctx.fillStyle = '#000000';
    ctx.fillRect(0,0, canvas.width, canvas.height);
    player.update();
    playerVelocity.x = 0;
    gunDimension.gunAngle = angle;
    if(hotKeys.a.pressed && lastKeyPressed === 'a'){
        playerVelocity.x = -5;
    }
    else if(hotKeys.d.pressed && lastKeyPressed === 'd'){
        playerVelocity.x = 5;  
    }
    else if(hotKeys.space.pressed && lastKeyPressed === ' ' && onGround === true){
        playerVelocity.y = -13;
    }
}

document.addEventListener('keydown', (e)=>{
    switch(e.key){
        case 'a':
            hotKeys.a.pressed = true;
            lastKeyPressed = "a";
        break;

        case 'A':
            hotKeys.a.pressed = true;
            lastKeyPressed = "a";   
        break;

        case 'd':
            hotKeys.d.pressed = true;
            lastKeyPressed = "d";
        break;

        case 'D':
            hotKeys.d.pressed = true;
            lastKeyPressed = "d";
        break;
        
        case ' ':
            hotKeys.space.pressed = true;
            lastKeyPressed = ' ';
        default:
        break;
    }
})

document.addEventListener('keyup', (e)=>{
    switch(e.key){
        case 'a':
            hotKeys.a.pressed = false;
        break;

        case 'A':
            hotKeys.a.pressed = false;
        break;

        case 'd':
            hotKeys.d.pressed = false;
        break;

        case 'D':
            hotKeys.d.pressed = false;
        break;
        
        case ' ':
            hotKeys.space.pressed = false;
        default:
        break;
    }
})

document.addEventListener('mousemove', (e)=>{
    let mouseX = e.clientX - canvas.width;
    let mouseY = e.clientY - canvas.height;
    angle = Math.atan2(mouseY, mouseX);
})

document.addEventListener('click', (e)=>{
    hotKeys.rightClick.pressed = true;
})

animate();