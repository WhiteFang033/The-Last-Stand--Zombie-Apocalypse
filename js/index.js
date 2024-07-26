var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var flag = true;
var score = 0;
var highscore = 0;
var hp = 100;
var healthbar = document.getElementById('hp');
var isPaused = false;
var start = false;
const startBtn = document.getElementById('start');
const instructionWindow = document.getElementsByClassName('instructionsWindow')[0];
const gameOverMenu = document.getElementsByClassName('gameOver')[0];
const pauseMenu = document.getElementsByClassName('menu')[0];
const scoreBoard = document.getElementById('score');
const highScoreBoard = document.getElementById('highscore');
const buttons = document.getElementsByTagName('button');
const pauseBtn = document.getElementById('pause');


startBtn.addEventListener('click', (e)=>{
    instructionWindow.style.display = 'none';
    animate();
})

//accessing highscores from localStorage
if(localStorage.getItem('highscore') === null){
    highscore = 0;
}
else{
    highscore = localStorage.getItem('highscore');
}
highScoreBoard.innerHTML = `HighScore - ${highscore}`;

//dimensions of the canvas
canvas.width = window.innerWidth/1.2;
canvas.height = window.innerHeight/1.2;

//set the value of gravity
const gravity = .8;

//set player properties
var playerDimensions = {width: 50, height: 120};
var playerPosition = {x: 700, y: 0};
var playerVelocity = {x: 0, y: 0};
var playerAcceleration = {x: 0, y: gravity};

//set gun properties
var gunDimension = { width: 60, height: 4, gunAngle: 0}

//set zombie properties
var zombieDimensions = {width: 80, height: 130};
var zombies = [];

//set box properties
var boxDimensions = {width: 140, height: 140};
var boxNumber = 2;
var boxes = [];
var boxDrawn = false;

ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);


const player = new Player(ctx, playerDimensions, gunDimension, playerPosition, playerVelocity, playerAcceleration, './assets/huntress/Sprites/Character/Idle.png');
const background= new Sprite(ctx, './assets/images/bg3.png', {x:0,y:0}, {width: canvas.width, height: canvas.height});

//setting up base
function baseSetUp(){
    if(isPaused === false){
        dropBox();
    }
        
}
function dropBox(){
    if(boxNumber<=0){
        canvas.removeEventListener('mousemove', listner);
        start = true;
    }
    else{
        canvas.addEventListener('mousemove', listner);
    }
}

var listner = function (e){
    let positionX, positionY;
            ctx.fillStyle = 'black'
            ctx.fillRect(0,0, canvas.width, canvas.height);
            background.update();
            canvas.style.cursor = 'none'
            ctx.fillStyle = 'green';
            if(e.clientX< canvas.width - boxDimensions.width && e.clientX> 2*boxDimensions.width){
                positionX = e.clientX - (boxDimensions.width*3/2);
                positionY = e.clientY - (boxDimensions.height);
            }
            else if(e.clientX< 2*boxDimensions.width){
                positionX =(boxDimensions.width);
                positionY = e.clientY - (boxDimensions.height);
            }
            else{
                positionX = canvas.width - 2*boxDimensions.width;
                positionY = e.clientY - (boxDimensions.height);
            }


            if(e.clientY> canvas.height - boxDimensions.height - 43){
                positionY = canvas.height - boxDimensions.height - 43;
            }
            else{
                positionY = e.clientY - (boxDimensions.height);
            }

            let boulder = new Image();
            boulder.src = './assets/images/boulder.png';

            ctx.drawImage(boulder, 0, 0, boulder.width, boulder.height, positionX, positionY, boxDimensions.width, boxDimensions.height);
    
            if(hotKeys.rightClick.pressed === true){
                ctx.fillRect(positionX, positionY, 150, 150);
                boxes.push(new Box(ctx, positionX, positionY, boxDimensions));
                boxNumber--;
                hotKeys.rightClick.pressed = false;
            }
            
            if(boxes.length !== 0){
                boxes.forEach(box=>{
                    box.draw(ctx);
                })
            }
}


//main animation function
function animate(){
    if(hp>0 && isPaused === false){
        window.requestAnimationFrame(animate);
    }
    else if(hp<=0){
        window.cancelAnimationFrame(animate);
        gameOverMenu.style.display = 'flex';
    }
    else if(isPaused === true){
        window.cancelAnimationFrame(animate);
    }

    if(start === true){
    canvas.style.cursor = 'crosshair'
    ctx.fillStyle = '#000000';
    ctx.fillRect(0,0, canvas.width, canvas.height);
    background.update();
    player.update();
    playerVelocity.x = 0;
    gunDimension.gunAngle = angle;

    if(hotKeys.a.pressed && lastKeyPressed === 'a' && player.position.x >0){
        player.image.src = './assets/huntress/Sprites/Character/Idle_right.png'
        playerVelocity.x = -5;
    }
    else if(hotKeys.d.pressed && lastKeyPressed === 'd' && player.position.x < canvas.width - player.width){
        player.image.src = './assets/huntress/Sprites/Character/Idle.png'
        playerVelocity.x = 5;  
    }
    else if(hotKeys.space.pressed && lastKeyPressed === ' ' && onGround === true){
        playerVelocity.y = -13;
    }

    if(hotKeys.rightClick.pressed === true){
        const bulletPositionX = player.position.x;
        const bulletPositionY = player.position.y;
        player.shoot(bulletPositionX, bulletPositionY);
        hotKeys.rightClick.pressed = false;
    }



    //collision detectors
    if(player.bulletOperator.bullets.length != 0 && player.zombieOperator.zombies.length != 0){
        player.bulletOperator.bullets.forEach(bullet => {
            player.zombieOperator.zombies.forEach(zombie=>{
                collisionDetector(zombie,bullet);
            })
        });
    }

    if(player.zombieOperator.zombies.length != 0){
        player.zombieOperator.zombies.forEach(zombie=>{
            damageChecker(player, zombie);
        })
    }

    if(player.zombieOperator.zombies.length != 0 && boxes.length !=0){
        player.zombieOperator.zombies.forEach(zombie=>{
            boxes.forEach(box=>{
                boxCollision(box, zombie);
            })
        })
    }

    if(player.bulletOperator.bullets.length != 0 && boxes.length !=0){
        player.bulletOperator.bullets.forEach(bullet=>{
            boxes.forEach(box=>{
                bulletBoxCollision(box, bullet);
            })
        })
    }

    }
    else{
        baseSetUp();
    }
    
}




//detects colling between zombies and bullets
function collisionDetector(zombie, bullet){
    let bulletPosition = {x: bullet.position.x,
                          y: bullet.position.y + bullet.takeOffPositionY
                        };
    let zombiePosition = {x: zombie.position.x - bullet.takeOffPositionX,
                          y: zombie.position.y
                        };
    if(zombie.direction === 'left'){
        if(bulletPosition.x <= zombiePosition.x + zombieDimensions.width &&
            bulletPosition.x >= zombiePosition.x &&
            bulletPosition.y >= zombiePosition.y &&
            bulletPosition.y <= zombiePosition.y + zombieDimensions.height){
            const indexBullet = player.bulletOperator.bullets.indexOf(bullet);
                if (indexBullet > -1) { 
                    player.bulletOperator.bullets.splice(indexBullet, 1);
                }

            const indexZombie = player.zombieOperator.zombies.indexOf(zombie);
                if (indexZombie > -1) { 
                    player.zombieOperator.zombies.splice(indexZombie, 1);
                    score++;
                    scoreBoardManager();
                }
        }
        
    }
    else if(zombie.direction === 'right'){
        if(bulletPosition.x >= zombiePosition.x &&
            bulletPosition.x <= zombiePosition.x + zombieDimensions.width &&
            bulletPosition.y >= zombiePosition.y &&
            bulletPosition.y <= zombiePosition.y + zombieDimensions.height){
            const indexBullet = player.bulletOperator.bullets.indexOf(bullet);
                if (indexBullet > -1) { 
                    player.bulletOperator.bullets.splice(indexBullet, 1);
                }

            const indexZombie = player.zombieOperator.zombies.indexOf(zombie);
                if (indexZombie > -1) { 
                    player.zombieOperator.zombies.splice(indexZombie, 1);
                    score++;
                    scoreBoardManager();
                }
        }
        
    }
}



//detects collision between zombie and player
function damageChecker(player, zombie){
    if(zombie.direction === 'left'){
        if(zombie.position.x + zombieDimensions.width>= player.position.x)
            {
                const indexZombie = player.zombieOperator.zombies.indexOf(zombie);
                if (indexZombie > -1) { 
                    player.zombieOperator.zombies.splice(indexZombie, 1);
                }

                hp-=10;

                healthbar.style.width = `${hp}%`;
            }
    }
    else if(zombie.direction === 'right'){
        if(zombie.position.x<= player.position.x + playerDimensions.width){
            const indexZombie = player.zombieOperator.zombies.indexOf(zombie);
                if (indexZombie > -1) { 
                    player.zombieOperator.zombies.splice(indexZombie, 1);
                }

                hp-=10;

                healthbar.style.width = `${hp}%`;
        }
    }
}

//detects collision between boxes and zombies
function boxCollision(box, zombie){
    if(zombie.direction === 'left'){
        if(zombie.position.x + zombieDimensions.width >= box.position.x && zombie.position.y+zombieDimensions.height>= box.position.y){

            const indexZombie = player.zombieOperator.zombies.indexOf(zombie);
                if (indexZombie > -1) { 
                    player.zombieOperator.zombies.splice(indexZombie, 1);
                }

            box.health-=10;

            if(box.health <=0){
                const boxIndex = boxes.indexOf(box);
                if(boxIndex> -1){
                    boxes.splice(boxIndex, 1);
                }
            }
        }
    }
    else if(zombie.direction === 'right'){
        if(zombie.position.x<= box.position.x + box.width && zombie.position.y+zombieDimensions.height>= box.position.y)
            {
                const indexZombie = player.zombieOperator.zombies.indexOf(zombie);
                if (indexZombie > -1) { 
                    player.zombieOperator.zombies.splice(indexZombie, 1);
                }

            box.health-=10;

            if(box.health <=0){
                const boxIndex = boxes.indexOf(box);
                if(boxIndex> -1){
                    boxes.splice(boxIndex, 1);
                }
            }
            }
    }
}

function bulletBoxCollision(box, bullet){
    let bulletPosition = {x: bullet.position.x,
        y: bullet.position.y + bullet.takeOffPositionY
      };
    
    if(box.position.x - player.position.x <0){
        if((box.position.x + box.width - bullet.takeOffPositionX)> bullet.position.x && (box.position.x - bullet.takeOffPositionX)< bullet.position.x && (box.position.y - bullet.takeOffPositionY) - bullet.position.y < 0){
            const indexBullet = player.bulletOperator.bullets.indexOf(bullet);
                if (indexBullet > -1) { 
                    player.bulletOperator.bullets.splice(indexBullet, 1);
                }
        }
    }
    else if(box.position.x - player.position.x > 0){
        if((box.position.x - bullet.takeOffPositionX) < bullet.position.x && (box.position.x + box.width - bullet.takeOffPositionX)> bullet.position.x && (box.position.y - bullet.takeOffPositionY) - bullet.position.y < 0){
            const indexBullet = player.bulletOperator.bullets.indexOf(bullet);
                if (indexBullet > -1) { 
                    player.bulletOperator.bullets.splice(indexBullet, 1);
                }
        }
    }
      
}
function scoreBoardManager(){

    scoreBoard.innerHTML = `Score- ${score}`;

    if(highscore<=score){
        highscore = score;
        highScoreBoard.innerHTML = `HighScore - ${highscore}`;
        localStorage.setItem('highscore', highscore);
    }
}

Array.from(buttons).forEach(button=>{
    button.addEventListener('click',()=>{
        if(button.dataset.role === 'resume'){
            pauseMenu.style.display = 'none';
            isPaused = false;
            animate();
        }
        else if(button.dataset.role === 'restart'){
            location.reload();
        }
        else if(button.dataset.role === 'exit'){
            window.close();
        }
    })
})
//generates zombies
setInterval(()=>{
    player.zombieOperator.generate();
},3400);


pauseBtn.addEventListener('click', ()=>{
    isPaused = true;
    pauseMenu.style.display = 'flex';
})