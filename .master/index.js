/* global $, sessionStorage*/

////////////////////////////////////////////////////////////////////////////////
///////////////////////// VARIABLE DECLARATIONS ////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// HTML jQuery Objects
var board = $('#board');
var scoreElement = $('#score');
var highScoreElement = $('#highScore');

// game variables
var snake = {};
var apple;
var score;

// interval variable required for stopping the update function when the game ends
var updateInterval;

// Constant Variables
var ROWS = 20;
var COLUMNS = 20;
var SQUARE_SIZE = 20;
var KEY = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
};

////////////////////////////////////////////////////////////////////////////////
////////////////////////////// GAME SETUP //////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// turn on keyboard inputs
$('body').on('keydown', setNextDirection);

// start the game
init();

function init() {
  // initialize the snake's body and head
  snake.body = [];
  snake.head = makeSnakeSquare(10, 10).attr('id', 'snake-head');
  
  // initialize the first apple
  apple = makeApple();
  
  // set score to 0
  scoreElement.text("Score: 0");
  score = 0;
  
  // start update interval
  updateInterval = setInterval(update, 100);
}

////////////////////////////////////////////////////////////////////////////////
///////////////////////// PROGRAM FUNCTIONS ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

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

    snakeSquare.direction = nextSnakeSquare.direction;

    repositionSquare(snakeSquare, nextSnakeSquare.row, nextSnakeSquare.column);
  }
  
  /* snake.head.nextDirection is set using keyboard input and only changes if the
  next direction is perpendicular to snake.head.direction. This prevents the 
  snake from turning back on itself if multiple commands are issued before the
  next udpate.
  
  snake.head.direction is then only set once at the moment the snake is prepared
  to move forward
  */
  snake.head.direction = snake.head.nextDirection;
  if (snake.head.direction === "left") { snake.head.column--; }
  else if (snake.head.direction === "right") { snake.head.column++; }
  else if (snake.head.direction === "up") { snake.head.row--; }
  else if (snake.head.direction === "down") { snake.head.row++; }
  
  repositionSquare(snake.head, snake.head.row, snake.head.column);
}

function hasCollidedWithApple() {
  return snake.head.row === apple.row && snake.head.column === apple.column;
}

function handleAppleCollision() {
  // increase the score and update the score DOM element
  score++;
  scoreElement.text("Score: " + score);
  
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
}

function hasCollidedWithSnake() {
  for (var i = 1; i < snake.body.length; i++) {
    if (snake.head.row === snake.body[i].row && snake.head.column === snake.body[i].column) {
      return true;
    }
  }
}

function hasHitWall() {
  return snake.head.row > ROWS || snake.head.row < 0 || snake.head.column > COLUMNS || snake.head.column < 0;
}

function endGame() {
  // stop update function from running
  clearInterval(updateInterval);

  // clear board of all elements
  board.empty();
  
  calculateAndDisplayHighScore();
  
  // restart the game after 500 ms
  setTimeout(function() { init(); }, 500);
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/* Create an HTML element for a snakeSquare using jQuery. Then, given a row and
 * column on the board, position it on the screen. Finally, add the new 
 * snakeSquare to the snake.body Array and set a new tail.
 */
function makeSnakeSquare(row, column) {
  // make the snakeSquare jQuery Object and append it to the board
  var snakeSquare = $('<div>').addClass('snake').appendTo(board);

  // set the position of the snake on the screen
  repositionSquare(snakeSquare, row, column);
  
  // add snakeSquare to the end of the body Array and set it as the new tail
  snake.body.push(snakeSquare);
  snake.tail = snakeSquare;
  
  return snakeSquare;
}

/* Given a gameSquare (which may be a snakeSquare or the apple), update that
 * game Square's row and column properties and then position the gameSquare on the
 * screen. 
 */
function repositionSquare(square, row, column) {
  var buffer = 20;
  
  // update the row and column properties on the square Object
  square.row = row;
  square.column = column;
  
  // position the square on the screen according to the row and column
  square.css('left', column * SQUARE_SIZE + buffer);
  square.css('top', row * SQUARE_SIZE + buffer);
}

/* Create an HTML element for the apple using jQuery. Then find a random 
 * position on the board that is not occupied and position the apple there.
 */
function makeApple() {
  // make the apple jQuery Object and append it to the board
  apple = $('<div>').addClass('apple').appendTo(board);

  // get a random available position on the board and position the apple
  var randomPosition = getRandomAvailablePosition();
  repositionSquare(apple, randomPosition.row, randomPosition.column);

  return apple;
}

/* Returns a (row,column) Object that is not occupied by another game component 
 */
function getRandomAvailablePosition() {
  var spaceIsAvailable;
  var randomPosition = {};
  
  /* Generate random positions until one is found that doesn't overlap with the snake */
  while (!spaceIsAvailable) {
    randomPosition.column = Math.floor(Math.random() * COLUMNS);
    randomPosition.row = Math.floor(Math.random() * ROWS);
    spaceIsAvailable = true;
    
    for (var i = 0; i < snake.body.length; i++) {
      var snakeSquare = snake.body[i];
      if (snakeSquare.row === randomPosition.row && snakeSquare.column === randomPosition.column) {
        spaceIsAvailable = false;
      }
    }
  }
  
  return randomPosition;
}

/* Triggered when keybord input is detected. Sets the snake head's nextDirection
 * property when an arrow key is pressed. Only perpendicular movement is allowed
 */
function setNextDirection(event) {
  var keyPressed = event.which;

  /* only set the next direction if it is perpendicular to the current direction */
  if (snake.head.direction !== "left" && snake.head.direction !== "right") {
    if (keyPressed === KEY.LEFT) { snake.head.nextDirection = "left"; }
    if (keyPressed === KEY.RIGHT) { snake.head.nextDirection = "right"; }
  }
  
  if (snake.head.direction !== "up" && snake.head.direction !== "down") {
    if (keyPressed === KEY.UP) { snake.head.nextDirection = "up"; }
    if (keyPressed === KEY.DOWN) { snake.head.nextDirection = "down"; }
  }
}

function calculateAndDisplayHighScore() {
  // retrieve the high score from session storage if it exists, or set it to 0
  var highScore = sessionStorage.getItem("highScore") || 0;

  if (score > highScore) {
    sessionStorage.setItem("highScore", score);
    highScore = score;
    alert("New High Score!");
  }
  
  // update the highScoreElement to display the highScore
  highScoreElement.text("High Score: " + highScore);
}