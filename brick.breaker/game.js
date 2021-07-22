import Paddle from "/brick.breaker/paddle.js";
import InputHandler from "/brick.breaker/input.js";
import Ball from "/brick.breaker/ball.js";
import Brick from "/brick.breaker/brick.js";
import { buildLevel, level1, level2, level3, level4, level5 } from "/brick.breaker/levels.js";

const resultDisplay = document.querySelector("#result");
const livesDisplay = document.querySelector("#lives");

const GAMESTATE = {
    PAUSED: 0,
    RUNNING: 1,
    MENU: 2,
    GAMEOVER: 3,
    NEWLEVEL: 4
};

export default class Game {

    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.gameState = GAMESTATE.MENU;
        this.paddle = new Paddle(this);
        this.ball = new Ball(this);
        this.gameObjects = [];
        this.lives = 3;
        this.bricks = [];
        this.score = 0;
        this.autoPlayFlag = false;

        this.levels = [level1, level2, level3, level4, level5];
        this.currentLevel = 0;

        new InputHandler(this.paddle, this);

    }


    start() {

        if (this.gameState !== GAMESTATE.MENU &&
            this.gameState !== GAMESTATE.NEWLEVEL )
             return;

        this.bricks = buildLevel(this, this.levels[this.currentLevel]);
        this.ball.reset();
        // this.paddle.autoPlay();
        this.gameObjects = [this.ball, this.paddle];
        this.gameState = GAMESTATE.RUNNING;
        resultDisplay.textContent = 0; 
        livesDisplay.textContent = this.lives;
    }


    update(deltaTime) {

        if (this.lives === 0) {
            this.gameState = GAMESTATE.GAMEOVER;
        }

        if (this.gameState === GAMESTATE.PAUSED ||
            this.gameState === GAMESTATE.MENU ||
            this.gameState === GAMESTATE.GAMEOVER
        )
            return;

        if( this.bricks.length === 0){
            this.currentLevel++;
            this.gameState = GAMESTATE.NEWLEVEL;
            this.start();
        }    

        [...this.gameObjects, ...this.bricks].forEach(Object => Object.update(deltaTime));
        let initialCount = this.bricks.length;
        this.bricks = this.bricks.filter(bricks => !bricks.markedForDeletion)
        let afterCount = this.bricks.length;
       
        let total = initialCount - afterCount;
        this.score = this.score + total;
        resultDisplay.textContent = this.score;
        livesDisplay.textContent = this.lives;

        if(this.autoPlayFlag) {
            this.autoPlay();
        }

    }

    draw(ctx) {

        [...this.gameObjects, ...this.bricks].forEach(Object => Object.draw(ctx));

        if (this.gameState == GAMESTATE.PAUSED) {
            ctx.rect(0, 0, this.gameWidth, this.gameHeight);
            ctx.fillStyle = "rgba(0,0,0,0.5)";
            ctx.fill();

            ctx.font = "30px Arial";
            ctx.fillStyle = "white";
            ctx.textAlign = "centre";
            ctx.fillText("Paused", this.gameWidth / 2, this.gameHeight / 2);
        }

        if (this.gameState == GAMESTATE.MENU) {
            ctx.rect(0, 0, this.gameWidth, this.gameHeight);
            ctx.fillStyle = "rgba(0,0,0,1)";
            ctx.fill();

            ctx.font = "30px Arial";
            ctx.fillStyle = "white";
            ctx.textAlign = "centre";
            ctx.fillText("press ENTER To Start", this.gameWidth / 2, this.gameHeight / 2);
        }

        if (this.gameState == GAMESTATE.GAMEOVER) {
            ctx.rect(0, 0, this.gameWidth, this.gameHeight);
            ctx.fillStyle = "rgba(0,0,0,1)";
            ctx.fill();

            ctx.font = "30px Arial";
            ctx.fillStyle = "white";
            ctx.textAlign = "centre";
            ctx.fillText("GAME OVER", this.gameWidth / 2, this.gameHeight / 2);
        }

    }

    togglePause() {

        if (this.gameState == GAMESTATE.PAUSED) {

            this.gameState = GAMESTATE.RUNNING;
        } else {
            this.gameState = GAMESTATE.PAUSED;
        }

    }

    autoPlay(){
        this.paddle.position.x =  this.ball.position.x + this.ball.size - 75 ;

        if(this.paddle.position.x < 0) this.paddle.position.x = 0;
        
        if(this.paddle.position.x + this.paddle.width > this.gameWidth)
        this.paddle.position.x = this.gameWidth - this.paddle.width;
    }

   
}