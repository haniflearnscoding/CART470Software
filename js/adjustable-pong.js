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

//Ball paremeters
// let ballSpeedX = 1;
// let ballSpeedY = 1;
let ballSliderSize = 10;

let ballSpeedXOnSlider = 10
let ballSpeedYOnSlider = 10

// Extra variables (each one has a slider in setup())
let gravity = 0;          // added to each ball's up/down speed every frame
let wallBounciness = 1;   // 1 = normal bounce off top/bottom, <1 = loses speed, >1 = gains speed
let paddleSpeedUp = 1;    // ball's left/right speed is multiplied by this on every paddle hit
let paddleBounceAngle = 0.05; // how sharply the ball angles off the paddle

let ballArray = [];

// Every slider made with makeSlider() goes in here, so Randomize can find them
let allSliders = [];




function setup() {
  let canvas = createCanvas(400, 400);
  canvas.mousePressed(startGame);

  createButton("Add Ball").mousePressed(() => {
    addBalls();
    startGame();
  });
  createButton("Randomize").mousePressed(randomizeAll);
  /** 
   * PIPPIN IN HERE
   */

  // makeSlider(label, min, max, starting value, what to do with the new value, [step])
  // Paddles
  makeSlider("Left paddle height", 0, 400, leftPaddleHeight, (v) => { leftPaddleHeight = v; });
  makeSlider("Right paddle height", 0, 400, rightPaddleHeight, (v) => { rightPaddleHeight = v; });
  makeSlider("Paddle width", 1, 200, paddleWidth, (v) => { paddleWidth = v; });
  makeSlider("Paddle speed", 0, 20, paddleSpeed, (v) => { paddleSpeed = v; });
  makeSlider("Paddle distance from edge", 0, 190, paddleLeftX, (v) => {
    paddleLeftX = v;
    paddleRightX = width - v;
  });
  makeSlider("Paddle bounce angle", 0, 0.3, paddleBounceAngle, (v) => { paddleBounceAngle = v; }, 0.01);
  makeSlider("Speed-up per paddle hit", 0.5, 2, paddleSpeedUp, (v) => { paddleSpeedUp = v; }, 0.05);

  // New balls
  makeSlider("New ball size", 0, 250, ballSliderSize, (v) => { ballSliderSize = v; });
  makeSlider("New ball speed (left/right)", 0, 50, ballSpeedXOnSlider, (v) => { ballSpeedXOnSlider = v; });
  makeSlider("New ball speed (up/down)", 0, 50, ballSpeedYOnSlider, (v) => { ballSpeedYOnSlider = v; });

  // World
  makeSlider("Gravity", -1, 1, gravity, (v) => { gravity = v; }, 0.01);
  makeSlider("Wall bounciness", 0, 2, wallBounciness, (v) => { wallBounciness = v; }, 0.05);




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

// Makes a named slider. Whenever it moves, onChange is called with the new value.
// (This replaces the old 3-lines-per-slider pattern and the update... functions.)
function makeSlider(label, min, max, start, onChange, step = 1) {
  createDiv(label);
  let slider = createSlider(min, max, start, step);
  slider.elt.addEventListener("input", () => {
    onChange(slider.value());
  });
  allSliders.push(slider);
  return slider;
}

// Called by the "Randomize" button: sets every slider to a random value
function randomizeAll() {
  for (let slider of allSliders) {
    // Each slider already knows its own range (as text, so convert to numbers)
    let min = Number(slider.elt.min);
    let max = Number(slider.elt.max);
    slider.value(random(min, max));

    // Setting a slider from code doesn't fire its "input" event,
    // so fire it ourselves; that runs the slider's onChange
    slider.elt.dispatchEvent(new Event("input"));
  }
}


function defineBalls() {
  let createdBalls = {
    body: {
      X: width / 2,
      Y: height / 2,
      speedX: ballSpeedXOnSlider,
      speedY: ballSpeedYOnSlider,
      ballSize: ballSliderSize

    },
  }
  return createdBalls
}

// Called by the "Add Ball" button: adds a new ball to the array
function addBalls() {
  ballArray.push(defineBalls());
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
  for (let ball of ballArray) {
    moveBalls(ball);
    checkBallCollision(ball);
    checkBallEdges(ball);
    drawBalls(ball);
  }

  // Draw the paddles
  rect(paddleLeftX, paddleLeftY, paddleWidth, leftPaddleHeight);
  rect(paddleRightX, paddleRightY, paddleWidth, rightPaddleHeight);



  // Draw the score
  text(leftScore, width * 0.25, height * 0.1);
  text(rightScore, width * 0.75, height * 0.1);





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
  ball.body.speedX = ballSpeedXOnSlider * random([-1, 1]);
  ball.body.speedY = random([-1, 1]);
}

// Scoring and top/bottom bounce for one ball
function checkBallEdges(ball) {
  // If the ball is beyond the left edge
  if (ball.body.X < 0) {
    // Give the right player a point
    rightScore += 1;
    resetBall(ball);

    // Otherwise if the ball is beyond the right edge
  } else if (ball.body.X > width) {
    // Give the left player a point
    leftScore += 1;
    resetBall(ball);

    // Otherwise if the ball is hitting the top edge, send it down
  } else if (ball.body.Y < 0) {
    ball.body.speedY = Math.abs(ball.body.speedY) * wallBounciness;

    // Otherwise if the ball is hitting the bottom edge, send it up
  } else if (ball.body.Y > height) {
    ball.body.speedY = -Math.abs(ball.body.speedY) * wallBounciness;
  }
}

// Starts the game if it's paused; adds a ball first if there are none
function startGame() {
  if (isLooping()) {
    return;
  }
  if (ballArray.length === 0) {
    addBalls();
  }
  for (let ball of ballArray) {
    resetBall(ball);
  }
  loop();
}

function moveBalls(ball) {
  // Move the ball using its current speed
  ball.body.X += ball.body.speedX;
  ball.body.Y += ball.body.speedY;

  // Gravity pulls on the ball's up/down speed every frame
  ball.body.speedY += gravity;

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
    // (always send it left, so it can't get stuck inside the paddle)
    // and speed it up (or slow it down) by paddleSpeedUp
    ball.body.speedX = -Math.abs(ball.body.speedX) * paddleSpeedUp;

    // Change the ball's vertical speed so it appears to bounce off the paddle
    ball.body.speedY = (ball.body.Y - paddleRightY) * paddleBounceAngle;
  }

  if (
    ball.body.X >= leftCollisionLeft &&
    ball.body.X <= leftCollisionRight &&
    ball.body.Y >= leftCollisionTop &&
    ball.body.Y <= leftCollisionBottom
  ) {
    // Reverse the ball's horizontal speed
    // (always send it right, so it can't get stuck inside the paddle)
    // and speed it up (or slow it down) by paddleSpeedUp
    ball.body.speedX = Math.abs(ball.body.speedX) * paddleSpeedUp;

    // Change the ball's vertical speed so it appears to bounce off the paddle
    ball.body.speedY = (ball.body.Y - paddleLeftY) * paddleBounceAngle;
  }



}
