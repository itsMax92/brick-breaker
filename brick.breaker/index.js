import Game from "/brick.breaker/game.js";

let canvas = document.getElementById("gameScreen");
let ctx = canvas.getContext("2d");
// let img = document.getElementById("img_grey");
// ctx.drawImage(img, 10, 10);

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;


let game = new Game(GAME_WIDTH,GAME_HEIGHT);

//Starting Time
let lastTime = 0;



//Game loop for refreshing the paddle
function gameLoop(timeStamp){

    let deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
//clearing Screen
    ctx.clearRect(0,0,GAME_WIDTH,GAME_HEIGHT);

    game.update(deltaTime);
    game.draw(ctx);



    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
