/* global $, sessionStorage*/

////////////////////////////////////////////////////////////////////////////////
///////////////////////// VARIABLE DECLARATIONS ////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// HTML jQuery Objects
let board = document.querySelector('#board');
let scoreElement = document.querySelector('#score');
let highScoreElement = document.querySelector('#highScore');

// game variables
var snake = {};
var apple;
var score;

// interval variable required for stopping the update function when the game ends
var updateInterval;

// Constant Variables
let SQUARE_SIZE = 4;
let ROWS = COLUMNS = 100/SQUARE_SIZE;
let KEY = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
};

////////////////////////////////////////////////////////////////////////////////
////////////////////////////// GAME SETUP //////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// turn on keyboard inputs
const bodyElement = document.querySelector('body')
bodyElement.addEventListener('keydown', setNextDirection);

// start the game
init();

function init() {
  // initialize the snake's body and head
  snake.body = [];
  snake.head = makeSnakeSquare(10, 10)
  snake.head.setAttribute('id', 'snake-head');
  
  // TODO 7: initialize the first apple


  // set score to 0
  scoreElement.innerHTML = "Score: 0";
  score = 0;
  calculateAndDisplayHighScore();
  
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
  
  if (hasHitWall() || hasCollidedWithSnake()) {
    endGame();
  }
  
  if (hasCollidedWithApple()) {
    handleAppleCollision();
  }
  
}

function moveSnake() {
  /* 
  TODO 10: Move each part of the snake's body such that it's body follows the head.
  
  HINT: To complete this TODO we must figure out the next direction, row, and 
  column for each snakeSquare in the snake's body. The parts of the snake are 
  stored in the Array snake.body and each part knows knows its current 
  column/row properties. 
  
  */
  
  

  
  /* 
  TODO 5: determine the next row and column for the snake's head
  
  HINT: The snake's head will need to move forward 1 square based on the value
  of snake.head.direction which may be one of "left", "right", "up", or "down"
  */
  
  
}

function hasCollidedWithApple() {
  /* 
  TODO 8: Should return true if the snake's head has collided with the apple, 
  false otherwise
  
  HINT: Both the apple and the snake's head are aware of their own row and column
  */
  
  return false;
}

function handleAppleCollision() {
  // increase the score and update the score DOM element
  score++;
  scoreElement.innerHTML = "Score: " + score;
  
  // Remove existing Apple and create a new one
  apple.remove();
  makeApple();
  
  /* 
  TODO 9: determine the location of the next snakeSquare based on the .row,
  .column and .direction properties of the snake.tail snakeSquare
  
  HINT: snake.tail.direction will be either "left", "right", "up", or "down".
  If the tail is moving "left", place the next snakeSquare to its right. 
  If the tail is moving "down", place the next snakeSquare above it.
  etc...
  */ 
  var row = 0;
  var column = 0;
  
  // code to determine the row and column of the snakeSquare to add to the snake
  
  makeSnakeSquare(row, column);
}

function hasCollidedWithSnake() {
  /* 
  TODO 11: Should return true if the snake's head has collided with any part of the
  snake's body.
  
  HINT: Each part of the snake's body is stored in the snake.body Array. The
  head and each part of the snake's body also knows its own row and column.
  
  */
  
  return false;
}

function hasHitWall() {
  /* 
  TODO 6: Should return true if the snake's head has collided with the four walls of the
  board, false otherwise.
  
  HINT: What will the row and column of the snake's head be if this were the case?
  */
  
  return false;
}

function endGame() {
  // stop update function from running
  clearInterval(updateInterval);

  // clear board of all elements
  removeAllChildElements(board);
  
  calculateAndDisplayHighScore();
  
  // restart the game after 500 ms
  setTimeout(function() { init(); }, 500);
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function removeAllChildElements(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

/* Create an HTML element for a snakeSquare using jQuery. Then, given a row and
 * column on the board, position it on the screen. Finally, add the new 
 * snakeSquare to the snake.body Array and set a new tail.
 */
function makeSnakeSquare(row, column) {
  // make the snakeSquare jQuery Object and append it to the board
  let snakeSquare = document.createElement('div');
  snakeSquare.setAttribute('class', 'snakeSquare');
  board.appendChild(snakeSquare);

  // set the position of the snake on the screen
  repositionSquare(snakeSquare, row, column);
  
  // push snakeSquare to the end of the body and set it as the new tail
  snake.body.push(snakeSquare);
  snake.tail = snakeSquare;
  
  return snakeSquare;
}

/* Given a gameSquare (which may be a snakeSquare or the apple), update that
 * game Square's row and column properties and then position the gameSquare on the
 * screen. 
 */
function repositionSquare(square, row, column) {  
  // update the row and column properties on the square Object
  square.row = row;
  square.column = column;

  // position the square on the screen according to the row and column
  const leftOffset = (column-1) * SQUARE_SIZE + "%";
  const topOffset = (row-1) * SQUARE_SIZE + "%";
  square.style.left = leftOffset;
  square.style.top = topOffset;
}

/* Create an HTML element for the apple using jQuery. Then find a random 
 * position on the board that is not occupied and position the apple there.
 */
function makeApple() {
  // make the apple jQuery Object and append it to the board
  apple = document.createElement('div')
  apple.setAttribute('id', 'apple')
  board.appendChild(apple);

  // get a random available position on the board and position the apple
  let randomPosition = getRandomAvailablePosition();
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
    
    /*
    TODO 12: After generating the random position determine if that position is
    not occupied by a snakeSquare in the snake's body. If it is then set 
    spaceIsAvailable to false so that a new position is generated.
    */
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
  
  console.log(snake.head.nextDirection);
}


function calculateAndDisplayHighScore() {
  // retrieve the high score from session storage if it exists, or set it to 0
  let highScore = sessionStorage.getItem("highScore") || 0;

  if (score > highScore) {
    sessionStorage.setItem("highScore", score);
    highScore = score;
    alert("New High Score!");
  }
  
  // update the highScoreElement to display the highScore
  highScoreElement.innerHTML = "High Score: " + highScore;
}