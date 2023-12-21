// canvas
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d"); //2D rendering context

// level
let level = 1; //default
const LEVEL_MAX = 3;
const LEVEL_MIN = 1;
changeLevelNum();

// ball
const ballRadius = 10;

//ball location
let x,y,dx,dy;
initBallLoc();

// color
const colorMaxValue = 16777215;

// brick
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
const bricks = [];

for(let c = 0; c < brickColumnCount; c++){
    bricks[c] = [];
    for(let r = 0; r < brickRowCount; r++){
        bricks[c][r] = {x: 0, y : 0, status : 1};
    }
}

// paddle
let ballColor = "#0095DD"
let paddleHeight = 10;
let paddleWidth = 80;
let paddleX = (canvas.width - paddleWidth) / 2;
let paddleSpeed = 7;

let rightPressed = false;
let leftPressed = false;

// score
let score = 0;
let lives = 3;

// event
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("mousedown", mouseDownHandler, false);

// handler
function mouseDownHandler(e){
    let classArray = e.target.classList;

    if(classArray.lenth === 0){
        return;
    } else if(classArray.contains('upLevelBtn') && level < LEVEL_MAX){
        level++;
        adjustDifficulty(level);
        changeLevelNum();
    } else if(classArray.contains('downLevelBtn') && level > LEVEL_MIN){
        level--;
        adjustDifficulty(level);
        changeLevelNum();
    }
}

function keyDownHandler(e){
    if(e.keyCode == 39){ //37 : legt, 39 : right
        rightPressed = true;
    } else if(e.keyCode == 37){
        leftPressed = true;
    }
}

function keyUpHandler(e){
    if(e.keyCode == 39){
        rightPressed = false;
    } else if(e.keyCode == 37){
        leftPressed = false;
    }
}

function mouseMoveHandler(e){
    const relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > paddleWidth / 2
        && relativeX < canvas.width - (paddleWidth / 2)){
        paddleX = relativeX - paddleWidth / 2;
    }
}

// draw functions
function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    collisionDetection();
    drawLives();
    changeBallDirection();
    movePaddle();
    moveBall();
    requestAnimationFrame(draw);
}

function drawBall(){
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
}

function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks(){               
    for(let c = 0; c < brickColumnCount; c++){
        for(let r = 0; r < brickRowCount; r++){
            if(bricks[c][r].status == 1){
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawScore(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20); // 문자열, x, y좌표
}

function drawLives(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(`Lives: ${lives}`, canvas.width -65, 20);
}

// functions
function adjustDifficulty(level){
    let levelNum = Number(level);
    let tempDx, tempDy;
    
    if(levelNum === 1){
        tempDx = 5;
        tempDy = 3;
    } else if(levelNum === 2){
        tempDx = 7;
        tempDy = 6;
    } else if(levelNum === 3){
        tempDx = 10;
        tempDy = 10;
    } else {
        alert(`잘못된 level값입니다. level은 ${LEVEL_MIN}~${LEVEL_MAX}사이입니다.
                level을 조절하시려면 새로고침해주세요`);
        return;
    }

    dx = dx < 0 ? -tempDx : tempDx;
    dy = dy < 0 ? -tempDy : tempDy;
}

function changeLevelNum(){
    document.getElementsByClassName("levelNum")[0].innerText = level;
}

function collisionDetection(){
    for(let c = 0; c < brickColumnCount; c++){
        for(let r = 0; r < brickRowCount; r++){
            const b = bricks[c][r];
            if(b.status == 1){
                if(x + ballRadius > b.x 
                    && x - ballRadius < b.x + brickWidth
                    && y - ballRadius < b.y + brickHeight
                    && y + ballRadius > b.y){
                        dy = -dy;
                        b.status = 0;
                        score++;
                        if(score == brickRowCount * brickColumnCount){
                            alert("YOU WIN, CONGRATULATIONS!");
                            document.location.reload();
                        }
                    }
            }
        }
    }
}

function changeColor(){
    let randomNum = Math.floor(Math.random() * (colorMaxValue + 1));
    ballColor = "#"+randomNum.toString(16);
}

function initBallLoc(){
    x = canvas.width / 2;
    y = canvas.height - 30;

    if(level === 1){
        dx = 5; //x 이동거리
        dy = -3; //y 이동거리
    } else {
        adjustDifficulty(level);
    }
}

function moveBall(){
    x += dx;
    y += dy;
}

function movePaddle(){
    if(rightPressed && paddleX < canvas.width - paddleWidth){
        paddleX += paddleSpeed;
    } else if(leftPressed && paddleX > 0){
        paddleX -= paddleSpeed;
    }
}

function changeBallDirection(){
    if(x + dx < ballRadius || x + dx > canvas.width - ballRadius){
        dx = -dx;
        changeColor();
    }

    if(y + dy < ballRadius){
        dy = -dy;
        changeColor();
    } else if((y + dy > canvas.height - (ballRadius + paddleHeight))
                &&(x + dx > paddleX && x + dx < paddleX + paddleWidth)){
        dy = -dy;
        changeColor();
    } else if(y + dy > canvas.height - ballRadius){
        lives--;

        if(!lives){
            alert("GAME OVER");
            document.location.reload();
            // clearInterval(interval); //공부해보기
        } else {
            initBallLoc();
            paddleX = (canvas.width - paddleWidth) / 2;
        }
    }
}

// const interval = setInterval(draw, 10);
draw();