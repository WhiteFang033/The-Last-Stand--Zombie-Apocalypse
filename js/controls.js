var lastKeyPressed;
var angle = 0;
var onGround;
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

document.getElementsByClassName('container')[0].addEventListener('click', (e)=>{
    if(e.target.dataset.role === undefined && e.target!= startBtn){
        hotKeys.rightClick.pressed = true;
    }
})
