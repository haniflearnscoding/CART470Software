let paddleLeftX = 20;
let paddleLeftY = 200;

let paddleRightX = 380;
let paddleRightY = 200;

let paddleSpeed = 2;
// PIPPIN UPDATED THE TWO BELOW TO SEPARATE OUT
// PADDLE HEIGHTS SO YOU CAN CHANGE THEM INDIVIDUALLUY
let leftPaddleHeight = 80;
let rightPaddleHeight = 80;


let paddleWidth = 10;

let leftScore = 0;
let rightScore = 0;

//Add Ball button
let ballButtonX = 30;
let ballButtonY = 20;
let ballButtonH = 55;
let ballButtonFill = "#ee2525";

//Ball paremeters
let ballPosX = 200;
let ballPosY = 200;
// let ballSpeedX = 1;
// let ballSpeedY = 1;
let ballSliderSize = 10;

let ballSpeedXOnSlider = 10
let ballSpeedYOnSlider = 10

let hSlider = undefined;

let addBallButton = {
    x: 300,
    y: 100,
    w: 500,
    h: 100,
    fill: "#ee2525",
    text: "Add Ball"
}

let ballArray = [];




function setup() {
    createCanvas(400, 400);

    /** 
     * PIPPIN IN HERE
     */

    leftHeightSlider = createSlider(0, 400);
    leftHeightSlider.elt.addEventListener("input", updateLeftHeight);

    rightHeightSlider = createSlider(0, 400);
    rightHeightSlider.elt.addEventListener("input", updateRightHeight);

    ballSizeSlider = createSlider(0, 250);
    ballSizeSlider.elt.addEventListener("input", updateBallSize);

    ballSpeedSliderX = createSlider(0, 50);
    ballSpeedSliderX.elt.addEventListener("input", updateBallSpeed);

    ballSpeedSliderY = createSlider(0,);
    ballSpeedSliderY.elt.addEventListener("input", updateBallSpeed);






    /**
     * PIPPIN WAS HERE
     */


    // Draw rectangles from their center
    // This makes it easier to check whether the ball is above or below the
    // center of a paddle
    rectMode(CENTER);
    fill(255);
    noStroke();
    textSize(40);
    textAlign(CENTER);

    // Start paused
    noLoop();
    describe(
        'Two narrow white rectangles and a white square representing the paddles and ball in a game of ping pong. The player scores are displayed in the upper corners, and initially text reads "Click to start"'
    );
}

/**
 * PIPPIN WAS HERE
 */
function updateLeftHeight() {
    leftPaddleHeight = leftHeightSlider.value();
}

function updateRightHeight() {
    rightPaddleHeight = rightHeightSlider.value();
}

function updateBallSize() {
    ballSliderSize = ballSizeSlider.value();

}


function updateBallSpeed() {
    ballSpeedXOnSlider = ballSpeedSliderX.value();
    ballSpeedYOnSlider = ballSpeedSliderY.value();

}


function defineBalls() {
    let createdBalls = {
        body: {
            X: ballPosX,
            Y: ballPosY,
            speedX: ballSpeedXOnSlider,
            speedY: ballSpeedYOnSlider,
            ballSize: ballSliderSize

        },
    }
    return createdBalls
}

///Making a function to add balls in an array
function drawBallButton() {
    push();
    fill(ballButtonFill);
    square(ballButtonX, ballButtonY, ballButtonH);
    pop();
}


function addBalls() {
    const newBall = defineBalls();

    const distance = dist(mouseX, mouseY, ballButtonX, ballButtonY);

    const mouseAddBallButtonOverlap = (distance < ballButtonH / 2);
    // mouseX < ballButtonX + ballButtonH &&
    // mouseY > ballButtonY;
    // mouseY < ballButtonY + ballButtonH;


    if (mouseAddBallButtonOverlap && mousePressed) {
        //if drawball button is overlapped and clicked then push to array
        ballArray.push(newBall);
    }

}


function drawBalls(i) {
    push();
    fill("#ffffff");
    ellipse(i.body.X, i.body.Y, i.body.ballSize);
    pop();
}



/**
 * AND LEFT
 */

/**
 * BUT HE ALSO UPDATED ALL THE CODE BELOW TO SEPARATE OUT LEFT AND RIGHT PADDLE
 * HEIGHT VARIABLES
 */

function draw() {
    //handles the balls
    background(0);
    drawBallButton();
    for (let ball of ballArray) {
        // moveBalls(ball);
        drawBalls(ball);
        moveBalls(ball);
        checkBallCollision(ball);
    }

    console.log(ballArray);

    // Draw the paddles
    rect(paddleLeftX, paddleLeftY, paddleWidth, leftPaddleHeight);
    rect(paddleRightX, paddleRightY, paddleWidth, rightPaddleHeight);



    // Draw the score
    text(leftScore, width * 0.25, height * 0.1);
    text(rightScore, width * 0.75, height * 0.1);





    // If the ball is beyond the left edge
    if (ballPosX < 0) {
        // Give the right player a point
        rightScore += 1;
        resetBall();

        // Otherwise if the ball is beyond the right edge
    } else if (ballPosX > width) {
        // Give the left player a point
        leftScore += 1;
        resetBall();

        // Otherwise if the ball is hitting the top or bottom edge
    } else if (ballPosY < 0 || ballPosY > height) {
        // Reverse its vertical speed
        ballSpeedY = -ballSpeedY;
    }

    // Store whether W and S keys are pressed
    let leftDownPressed = keyIsDown(83);
    let leftUpPressed = keyIsDown(87);

    // Store how much the left paddle will move
    let leftMove = 0;

    if (leftDownPressed === true) {
        leftMove += paddleSpeed;
    }
    if (leftUpPressed === true) {
        leftMove -= paddleSpeed;
    }

    // Prevent the paddle from moving off screen
    paddleLeftY = constrain(
        paddleLeftY + leftMove,
        leftPaddleHeight / 2,
        height - leftPaddleHeight / 2
    );

    // Store whether up and down arrow keys are pressed
    let rightDownPressed = keyIsDown(DOWN_ARROW);
    let rightUpPressed = keyIsDown(UP_ARROW);

    // Store how much the right paddle will move
    let rightMove = 0;

    if (rightDownPressed === true) {
        rightMove += paddleSpeed;
    }
    if (rightUpPressed === true) {
        rightMove -= paddleSpeed;
    }

    // Prevent the paddle from moving off screen
    paddleRightY = constrain(
        paddleRightY + rightMove,
        rightPaddleHeight / 2,
        height - rightPaddleHeight / 2
    );

    // Show 'Click to start' if game is paused
    if (isLooping() === false) {
        text('Click to start', width / 2, height / 2 - 20);
    }
}

// Reset ball to center of canvas with random speed
function resetBall(ball) {
    ball.body.X = width / 2;
    ball.body.Y = height / 2;
    ballSpeedX = ballSpeedXOnSlider;
    ballSpeedY = random([-1, 1]);
}

function mousePressed() {
    addBalls();
    for (let ball of ballArray) {
        if (isLooping() === false) {
            resetBall(ball);
            loop();
        }
    }

}

function moveBalls(ball) {
    // Move the ball using its current speed
    ball.body.X += ballSpeedXOnSlider;
    ball.body.Y += ballSpeedYOnSlider;

}

function checkBallCollision(ball) {
    // If the ball is colliding with the left paddle
    // Store coordinates of the right paddle's collision area edges
    let rightCollisionLeft = paddleRightX - paddleWidth / 2 - ball.body.ballSize / 2;
    let rightCollisionRight = paddleRightX + paddleWidth / 2 + ball.body.ballSize / 2;
    let rightCollisionTop = paddleRightY - rightPaddleHeight / 2 - ball.body.ballSize / 2;
    let rightCollisionBottom = paddleRightY + rightPaddleHeight / 2 + ball.body.ballSize / 2;

    // Store coordinates of the left paddle's collision area edges
    let leftCollisionLeft = paddleLeftX - paddleWidth / 2 - ball.body.ballSize / 2;
    let leftCollisionRight = paddleLeftX + paddleWidth / 2 + ball.body.ballSize / 2;
    let leftCollisionTop = paddleLeftY - leftPaddleHeight / 2 - ball.body.ballSize / 2;
    let leftCollisionBottom = paddleLeftY + leftPaddleHeight / 2 + ball.body.ballSize / 2;

    // If the ball is colliding with the right paddle
    if (
        ball.body.X >= rightCollisionLeft &&
        ball.body.X <= rightCollisionRight &&
        ball.body.Y >= rightCollisionTop &&
        ball.body.Y <= rightCollisionBottom
    ) {
        // Reverse the ball's horizontal speed
        ballSpeedXOnSlider = -ballSpeedXOnSlider;

        // Change the ball's vertical speed so it appears to bounce off the paddle
        ballSpeedYOnSlider = (ball.body.Y - paddleRightY) / 20;
    }

    if (
        ball.body.X >= leftCollisionLeft &&
        ball.body.X <= leftCollisionRight &&
        ball.body.Y >= leftCollisionTop &&
        ball.body.Y <= leftCollisionBottom
    ) {
        // Reverse the ball's horizontal speed
        ballSpeedXOnSlider = -ballSpeedXOnSlider;

        // Change the ball's vertical speed so it appears to bounce off the paddle
        ballSpeedYOnSlider = (ball.body.Y - paddleLeftY) / 20;
    }



}