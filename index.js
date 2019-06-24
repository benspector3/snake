/* global $*/

// Set window sessionStorage to keep track of high scores (lowest time)
sessionStorage.setItem("highScore", 0);

// timer variables
var timer = $('#timer');
var timeStr;
var time;

// score variables
var scoreElement = $('#score');
var score;
var highScoreElement = $('#highScore');

// board variables
var board = $('#board');
board.rows = 20;
board.columns = 20;
var squareSize = 20;

// snake variables
var snake = {};
snake.speed = 10;

// apple
var apple;

// KeyCodes
var KEY = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
};

// interval variables
var updateInterval;
var timerInterval;

init();

function init() {
  // initialize the snake
  snake.body = [];
  snake.head = makeSnakeSquare(10, 10).attr('id', 'snake-head');
  snake.head.direction = "right";
  
  // initialize the first apple
  apple = makeApple();
  
  //start timer ticking at 0
  timer.text("Time: 0:00");
  time = 0;
  timerInterval = setInterval(updateTimer, 1000);
  
  // set score to 0
  scoreElement.text("Score: 0");
  score = 0;
  
  // start update interval
  updateInterval = setInterval(update, 100);
  
  // turn on keyboard inputs
  $('body').on('keydown', setNextDirection);
}

/* 
 * On each update tick update each bubble's position and check for
 * collisions with the walls.
 */
function update() {
  moveSnake();
  
  if (hasCollidedWithApple()) {
    handleAppleCollision();
  }
  
  if (hasCollidedWithSnake() || hasHitWall()) {
    endGame();
  }
}

function moveSnake() {
  // start at 1, the head is moved separately
  for (var i = snake.body.length - 1; i >= 1; i--) {
    var snakeSquare = snake.body[i];
    var nextSnakeSquare = snake.body[i - 1];

    snakeSquare.row = nextSnakeSquare.row;
    snakeSquare.column = nextSnakeSquare.column;
    snakeSquare.direction = nextSnakeSquare.direction;

    repositionSquare(snakeSquare);
  }
  
  if (snake.head.direction === "left") {
    snake.head.column--;
  }
  else if (snake.head.direction === "right") {
    snake.head.column++;
  }
  else if (snake.head.direction === "up") {
    snake.head.row--;
  }
  else if (snake.head.direction === "down") {
    snake.head.row++;
  }
  
  repositionSquare(snake.head);
}

function hasCollidedWithApple() {
  return snake.head.row === apple.row && snake.head.column === apple.column;
}
function handleAppleCollision() {
  console.log('apple eaten');
  
  apple.remove();
  apple = null;
  makeApple();
  
  var row = snake.tail.row,
      column = snake.tail.column;
  
  if (snake.tail.direction === "left") {
    column++;
  }
  else if (snake.tail.direction === "right") {
    column--;
  }
  else if (snake.tail.direction === "up") {
    row++;
  }
  else if (snake.tail.direction === "down") {
    row--;
  }
  
  makeSnakeSquare(row, column);
  
  score++;
  scoreElement.text("Score: " + score);
}

function hasCollidedWithSnake() {
  for (var i = 1; i < snake.body.length; i++) {
    if (snake.head.row === snake.body[i].row && snake.head.column === snake.body[i].column) {
      console.log('snake collision');
      return true;
    }
  }
}
function hasHitWall() {
  return snake.head.row > 20 || snake.head.row < 0 || snake.head.column > 20 || snake.head.column < 0;
}

function makeSnakeSquare(row, column) {
  // make the snake jQuery Object
  var snakeSquare = $('<div>').addClass('snake');

  // set snake position properties
  snakeSquare.column = column;
  snakeSquare.row = row;
  repositionSquare(snakeSquare);
  
  // add snakeSquare to body and set a new tail
  snake.body.push(snakeSquare);
  snake.tail = snakeSquare;
  
  board.append(snakeSquare);

  return snakeSquare;
}

function makeApple() {
  // make the snake jQuery Object if one doesn't already exist
  if (!apple) {
    apple = $('<div>').addClass('apple');
  
    // set snake position properties
    var randomPosition = getRandomAvailablePosition();
    apple.column = randomPosition.column;
    apple.row = randomPosition.row;
    
    repositionSquare(apple);
  
    board.append(apple);
  }
  
  return apple;
}
function getRandomAvailablePosition() {
  
  var spaceIsAvailable = false;
  var randomPosition = {};
  
  while (spaceIsAvailable === false) {
    randomPosition.column = Math.floor(Math.random() * board.rows);
    randomPosition.row = Math.floor(Math.random() * board.rows);
    spaceIsAvailable = true;
    
    for (var i = 0; i < snake.body.length; i++) {
      if (snake.body[i].row === randomPosition.row && snake.body[i].column === randomPosition.column) {
        spaceIsAvailable = false;
        break;
      }
    }
  }
  
  return randomPosition;
  
}

function setNextDirection(event) {
  var keyPressed = event.which;
  if (keyPressed === KEY.LEFT && snake.head.direction !== "left" && snake.head.direction !== "right") {
    snake.head.direction = "left";
  }
  else if (keyPressed === KEY.RIGHT && snake.head.direction !== "left" && snake.head.direction !== "right") {
    snake.head.direction = "right";
  }
  else if (keyPressed === KEY.UP && snake.head.direction !== "up" && snake.head.direction !== "down") {
    snake.head.direction = "up";
  }
  else if (keyPressed === KEY.DOWN && snake.head.direction !== "up" && snake.head.direction !== "down") {
    snake.head.direction = "down";
  }
}

function updateTimer() {
  time++;

  var secondsOnes = (time % 60) % 10;
  var secondsTens = Math.floor((time % 60) / 10);
  var minutes = Math.floor(time / 60);

  timeStr = minutes + ":" + secondsTens + secondsOnes;
  timer.text("Time: " + timeStr);
}
function endGame() {
  // turn off intervals
  clearInterval(updateInterval);
  clearInterval(timerInterval);

  // turn off keyboard input
  $('body').off('keydown');
  
  // clear board of all elements
  board.empty();
  
  // reset the apple
  apple = null;
  
  // calculate high score and restart the game
  calculateAndDisplayHighScore();
  setTimeout(function() { init(); }, 500);
}
function calculateAndDisplayHighScore() {
  var highScore = sessionStorage.getItem("highScore");

  if (score > highScore) {
    sessionStorage.setItem("highScore", score);
    highScore = score;
    highScoreElement.text("High Score: " + highScore);
    alert("New High Score!");
  }
}

////////////////////////////////////////////////////////////////////////////////
///////////////////////// HELPER FUNCTIONS /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


/* Called on each update to move the snake to it's next position. Also called
by makeApple when a new apple is created */
function repositionSquare(square) {
  square.css('left', square.column * squareSize + 20);
  square.css('top', square.row * squareSize + 20);
}