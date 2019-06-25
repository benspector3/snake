/* global $*/

// game variables
var snake = {};
var apple;
var board = $('#board');
board.rows = board.columns = 20;
board.squareSize = 20;

// timer variables
var timer = $('#timer');
var time;

// score variables
var score;
var scoreElement = $('#score');
var highScoreElement = $('#highScore');
sessionStorage.setItem("highScore", 0);

// KeyCodes
var KEY = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
};

// turn on keyboard inputs
$('body').on('keydown', setNextDirection);

// interval variables required for stopping the intervals when the game ends
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
  
  // set score to 0
  scoreElement.text("Score: 0");
  score = 0;
  
  //start timer ticking at 0
  timer.text("Time: 0:00");
  time = 0;
  timerInterval = setInterval(updateTimer, 1000);
  
  // start update interval
  updateInterval = setInterval(update, 100);
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
  // starting at the tail, each snakeSquare moves to the (row, column) position
  // of the snakeSquare that comes before it. The head is moved separately
  for (var i = snake.body.length - 1; i >= 1; i--) {
    var snakeSquare = snake.body[i];
    var nextSnakeSquare = snake.body[i - 1];

    snakeSquare.row = nextSnakeSquare.row;
    snakeSquare.column = nextSnakeSquare.column;
    snakeSquare.direction = nextSnakeSquare.direction;

    repositionSquare(snakeSquare);
  }
  
  /* snake.nextDirection is set using keyboard input and only changes if the
  next direction is perpendicular to snake.head.direction. This prevents the 
  snake from turning back on itself if multiple commands are issued before the
  next udpate.
  
  snake.head.direction is then only set once at the moment the snake is prepared
  to move forward
  */
  snake.head.direction = snake.nextDirection;
  if (snake.head.direction === "left") { snake.head.column--; }
  else if (snake.head.direction === "right") { snake.head.column++; }
  else if (snake.head.direction === "up") { snake.head.row--; }
  else if (snake.head.direction === "down") { snake.head.row++; }
  
  repositionSquare(snake.head);
}
function repositionSquare(square) {
  var buffer = 20;
  square.css('left', square.column * board.squareSize + buffer);
  square.css('top', square.row * board.squareSize + buffer);
}

function hasCollidedWithApple() {
  return snake.head.row === apple.row && snake.head.column === apple.column;
}
function handleAppleCollision() {
  // Remove existing Apple and create a new one
  apple.remove();
  makeApple();
  
  // calculate the location of the next snakeSquare based on the current
  // position and direction of the tail, then create the next snakeSquare
  var row = snake.tail.row;
  var column = snake.tail.column;
  if (snake.tail.direction === "left") { column++; }
  else if (snake.tail.direction === "right") { column--; }
  else if (snake.tail.direction === "up") { row++; }
  else if (snake.tail.direction === "down") { row--; }
  makeSnakeSquare(row, column);
  
  // increase the score and update the score DOM element
  score++;
  scoreElement.text("Score: " + score);
}

function hasCollidedWithSnake() {
  for (var i = 1; i < snake.body.length; i++) {
    if (snake.head.row === snake.body[i].row && snake.head.column === snake.body[i].column) {
      return true;
    }
  }
}
function hasHitWall() {
  return snake.head.row > board.rows || snake.head.row < 0 || snake.head.column > board.columns || snake.head.column < 0;
}
function endGame() {
  // turn off intervals
  clearInterval(updateInterval);
  clearInterval(timerInterval);
  
  // clear board of all elements
  board.empty();
  
  // calculate the high score
  var highScore = sessionStorage.getItem("highScore");
  if (score > highScore) {
    sessionStorage.setItem("highScore", score);
    highScoreElement.text("High Score: " + score);
    alert("New High Score!");
  }
  
  // restart the game after 500 ms
  setTimeout(function() { init(); }, 500);
}

function makeSnakeSquare(row, column) {
  // make the snakeSquare jQuery Object and append it to the board
  var snakeSquare = $('<div>').addClass('snake').appendTo(board);

  // set snake position on the board and place it in the correct location
  snakeSquare.column = column;
  snakeSquare.row = row;
  repositionSquare(snakeSquare);
  
  // add snakeSquare to the end of the body Array and set it as the new tail
  snake.body.push(snakeSquare);
  snake.tail = snakeSquare;
  
  return snakeSquare;
}
function makeApple() {
  // make the apple jQuery Object and append it to the board
  apple = $('<div>').addClass('apple').appendTo(board);

  // get a random available position on the board and position the apple
  var randomPosition = getRandomAvailablePosition();
  apple.column = randomPosition.column;
  apple.row = randomPosition.row;
  repositionSquare(apple);

  return apple;
}
function getRandomAvailablePosition() {
  var spaceIsAvailable;
  var randomPosition = {};
  
  /* Generate random positions until one is found that doesn't overlap with the snake */
  while (!spaceIsAvailable) {
    randomPosition.column = Math.floor(Math.random() * board.columns);
    randomPosition.row = Math.floor(Math.random() * board.rows);
    spaceIsAvailable = true;
    
    for (var i = 0; i < snake.body.length; i++) {
      var snakeSquare = snake.body[i];
      if (snakeSquare.row === randomPosition.row && snakeSquare.column === randomPosition.column) {
        spaceIsAvailable = false;
      }
    };
  }
  
  return randomPosition;
}

function setNextDirection(event) {
  var keyPressed = event.which;
  
  /* only set the next direction if it is perpendicular to the current direction */
  if (snake.head.direction !== "left" && snake.head.direction !== "right") {
    if (keyPressed === KEY.LEFT) { snake.nextDirection = "left"; }
    if (keyPressed === KEY.RIGHT) { snake.nextDirection = "right"; }
  }
  else if (snake.head.direction !== "up" && snake.head.direction !== "down") {
    if (keyPressed === KEY.UP) { snake.nextDirection = "up"; }
    if (keyPressed === KEY.DOWN) { snake.nextDirection = "down"; }
  }
}

function updateTimer() {
  time++;

  var seconds = time % 60;
  var minutes = Math.floor(time / 60);

  // if seconds is in single digits, prepend with a 0
  if (seconds <= 9) { seconds = "0" + seconds; }
  
  // update timer text
  timer.text("Time: " + minutes + ":" + seconds);
}

////////////////////////////////////////////////////////////////////////////////
///////////////////////// HELPER FUNCTIONS /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


