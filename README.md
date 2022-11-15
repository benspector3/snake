# Snake
Classic Snake Game

<a href = "https://jsbin.com/kumifavazi/1/edit?output" target="_blank"> Play it here:  (Right Click -> Open Link in New Tab)</a>

To download this project into your workspace, enter this command into your bash terminal:

    git clone https://github.com/benspector3/snake.git

## Learning Objectives
- Build an app from start to finish including writing HTML, CSS, and JavaScript
- Manipulate HTML elements using the DOM API
- Use a `setTimeout` to generate "frames" using an `update` callback function.
- Use keyboard inputs
- Organize code using Functions

## Part 1 - HTML & CSS

### Learning Objectives
- Create CSS rules for elements that you plan on adding dynamically using the DOM API
- Learn how the various files in a program are linked together in an index.html file
- Set up HTML elements whose content will be filled dynamicaly using the DOM API

### TODO 1: Add the initial HTML elements

This Snake program is simple. It only has a few visual components:
- The board
- The score display
- The high score display
- The snake
- The apple

The board, score display, and high score display are all static elements that don't change position throughout the program. Meanwhile, the snake and apple will constantly be changing.

For now, we can set up the stationary elements first. When we get to the JavaScript portion of this project we'll deal with the snake and apple.

Between the `<body> </body>` tags add the following elements:
- An empty `<div></div>` element with an `id = "board"` property
- An empty `<h1></h1>` element with an `id = "score"` property
- An empty `<h1></h1>` element with an `id = "highScore"` property

### TODO 2: Link the CSS file to our index page
This program can be built using a single HTML file, a CSS file, and a JavaScript file. While all three of these languages can be included in one file, it is best practice to separate them into their own files. 

This, however, requires us to link them together within the `index.html` file, the _entry point_ of the program. We have provided the basic structure for your project but you will need to add a few things. 

We'll start by plugging in the `index.css` file. Inside the `<head>` element, add the following lines:

```html
<link rel="stylesheet" type="text/css" href="index.css">
```

When plugging in CSS files to our `index.html` page, we use the tag:

```html
<link rel="stylesheet" type="text/css" href="filepath.css">
```


### TODO 3: Link the index.js file

Now we want to link our `index.js` file. 


When plugging in a JavaScript file to our `index.html` page we use the tag:

```html
<script src="filepath.js"></script>
```

When the browser loads our `index.html` file, it starts at the top of the file and reads each line one at a time until it reaches the bottom. When it gets to an externally loaded file, it must first read through that entire file before moving on to the next line in our HTML.

Since we will be using JavaScript and the DOM API to manipulate the existing HTML elements on our page, we have to wait for those elements to be loaded _before_ we can load in the `index.js` file. So, we have to link this file at the bottom of our page, _after_ the `<body></body>` tags.

Between the closing `</body>` tag and the closing `</html>` tag, use the `<src>` tag to link the `index.js` file.

### TODO 4: Review your work

Nice job! Our HTML page is now set up with all necessary files plugged in! Often times, before you even start programming, setting up a basic file structure is the first step. You'll want to consider what various components you'll need and then link them all together in the `index.html` page. As you add new components always remember to link them to the index page!

Double check that you have followed the instructions carefully. At this point, your HTML file should look like this:

```html
<!DOCTYPE html>
<html>

  <head>
    <title> Snake </title>
    <link rel="stylesheet" type="text/css" href="index.css">
  </head>
  
  <body>
    <div id='board'> </div>
    <h1 id="score"> Score: 0 </h1>
    <h1 id="highScore"> </h1>
  </body>
  
  <script src="index.js"></script>

</html>
```
## Part 2 - JavaScript

### Variables

Now that the setup has been taken care of, let's get into the fun stuff. To create this program, we need to do some planning. We need to think about a few questions:
- What data will I need to track while my game is running?
- How will that data change throughout the course of my game?
- What data needs to be globally accessible and what data does not?

#### Global Data

The following variables will be needed throughout the program.

##### HTML DOM Elements

DOM elements are HTML element objects returned from invoking `document.querySelector()`. This function (look it up!) accepts any valid CSS selector and returns an object (or an array of objects) that match the selector. The returned object has a number of methods and properties that allow us to further customize their styling or their displayed text.

- `board`: HTML element Object to manipulate the board element
- `scoreElement`: HTML element Object to manipulate the score display element
- `highScoreElement`: HTML element Object to manipulate the high score display element

##### Game Data
- `snake`: An Object to manage the snake with a head, tail, and body properties. The snake will be made up of individual `snakeSquare` HTML element Objects that each will have their own `.row`, `.column`, and `.direction` properties.
    - `snake.head`: Reference to the HTML element `snakeSquare` Object at the head of 
the snake
    - `snake.body`: An Array containing all `snakeSquare` HTML element Objects. 
    - `snake.head`: Reference to the HTML element `snakeSquare` Object at the head of 
the snake
- `apple`: An Object to manage the active Apple.
- `score`: The number of apples eaten

##### Constant Data
- `ROWS`: number of rows in the board
- `COLUMNS`: number of columns in the board
- `SQUARE_SIZE`: the pixel dimensions of each square
- `KEY`: map for keycodes of the arrow keys (see https://keycode.info/)

##### Interval Variable
- `updateInterval`: the interval that is running the update function 
- (See https://www.w3schools.com/jsref/met_win_setinterval.asp)


### Game Setup

#### How did the snake's head get there?

Go ahead and run the `index.html` file. At this point your screen should show the score at `0` and inside the board will be a single green square. This is the snake's head! 

**Right click and inspect the page** and you should see that a new `<div>` element has been added!

How did it get there? Take a look at the `init` function in the Game Setup section and you'll see these lines:

```javascript  
snake.body = [];
snake.head = makeSnakeSquare(10, 10)
snake.head.setAttribute('id', 'snake-head');
```

First, we create the `body` property on our `snake` Object and initialize it as an empty Array. By modeling our `snake`'s body with an Array, we can easily add new body parts when the snake eats an `apple` and, most importantly, it provides an easy way to maintain the order in which each body part is added.

How are body parts of the snake modeled? Let's focus on the function call `makeSnakeSquare(10, 10)`.

Find the function `makeSnakeSquare` and you'll see that it:
* Creates a `snakeSquare` Object using `document.createElement('div')`. This function (look it up!) creates a new HTML element of the specified type and returns it as an object. 
* HTML element objects created this way have methods (like `setAttribute`) that we can use to customize that element. Here, we use it to set the class `snakeSquare` to give it the right styles (see `index.css`).
* Then, it positions the new `snakeSquare` on the screen. 
* Finally, it adds the new `snakeSquare` to the `snake.body` Array and sets it as the new tail.

Since this is our first `snakeSquare` we want to assign the returned HTML element object to `snake.head` so that we have a quick reference to this very important `snakeSquare` Object!

We also set the attribute `id = "snake-head"` using the DOM API method `.setAttribute` to distinguish the head from the rest of the body using CSS.

#### Other Setup Stuff

**Change over to the console tab in the inspector** and start pressing arrow keys. You'll notice that the direction that you press will be printed! This is because of these lines:

```javascript
const bodyElement = document.querySelector('body')
bodyElement.addEventListener('keydown', setNextDirection);
```

which makes our webpage respond to key presses with the function `setNextDirection`. You can find the definition of this function in the *Helper Functions* section at the bottom of the program.

Inside the `init` function we also set the `score` to `0` and update the `scoreElement`'s text.

#### Turning on the game

Finally, look at the this line:

```javascript
updateInterval = setInterval(update, 100);
```

This starts our game running by calling the `update` function every `100` milliseconds. This will give us a way to modify the game over time. Like a flip book, we will animate our game by making slight adjustments on each timer tick. In the next section we will look at the logic of this `update` function.

### Game Logic

Let's look at the logic of that `update` function:

```javascript
function update() {
  moveSnake();
  
  if (hasHitWall() || hasCollidedWithSnake()) {
    endGame();
  }
  
  if (hasCollidedWithApple()) {
    handleAppleCollision();
  }
  
}
```    
    
On each tick of the timer we move the snake. We'll check if it has collided with the wall, itself, or the apple. 

If it collides with the Apple, handle that collision. 

If it collides with itself or the wall, end the game.

As you can see, we are using a lot of functions to write out the logic. This is a strategy to make the main logic of the program readable. We can now dive into each function to get them working!

### TODO 5: Make the head move

**Set up**

The first step in the `update` function is to actually move the snake. Find the `moveSnake` function. We'll start by moving the `head` of the snake. To determine what direction our snake will be moving in, add this line below `TODO 5`:

```javascript   
snake.head.direction = snake.head.nextDirection;
```

`snake.head.nextDirection` is set based on keyboard input and can only be a value that is perpendicular to `snake.head.direction`. 

When the `moveSnake` function is called, we know that the snake is ready to move so we can safely change `snake.head.direction`. This prevents the snake from turning back on itself if multiple commands are issued before the next timer tick.

Below the line of code you just added, add these new lines of code:

```javascript    
var nextRow = snake.head.row;
var nextColumn = snake.head.column;
    
// determine how to change the value of nextRow and nextColumn based on snake.head.direction
    
repositionSquare(snake.head, nextRow, nextColumn);
```

The `repositionSquare` function accepts as input square Object (which can be any part of the snake's body or the apple), a row, and a 
column and then places that HTML element object correctly on the scren. 

If you look at the definition of this function in the *Helper Functions* section you'll notice that it also update's that HTML element Object's `.row` and `.column` properties with this new position so that each game item always knows where it is.

**Goal: Determine the snake head's next position**

Use the following pieces of data to calculate the values of `nextRow` and 
`nextColumn`

```javascript  
snake.head.row          // the current row of snake.head
snake.head.column       // the current column of snake.head
snake.head.direction    // the direction that the head should move towards
```

HINT: The top row in the board is row `0` and row numbers increase as you move down. The left-most column in the board is column `0` and column numbers increase as you move to the right.

### TODO 6: Check for collisions with the wall

Now that our snake can move freely, we need to put some constraints on it. We don't want our snake to leave the confines of the board (sorry snake).

The next step in our games `update` logic is to check if the snake has either collided with the walls or with itself. Let's start with the walls.

Find the function `hasHitWall`.

**Goal: This function should return true if the snake's head has collided with any of the four walls of the board, false otherwise.**
  
Use the following pieces of data to determine if the snake's head has collided with one of the walls.

```javascript
ROWS                // the total number of ROWS in the board
COLUMNS             // the total number of COLUMNS in the board
snake.head.row      // the current row of snake.head
snake.head.column   // the current column of snake.head 
```

### TODO 7: Add the apple

To create an apple we can call the function `makeApple` which is defined in the *Helper Functions* section. We want to create an apple when the game starts so in the `init` function below `TODO 7` add this line of code:

```javascript
apple = makeApple();
```

If you take a look at the definition of the `makeApple` function you'll see that it finds a random position for the apple by calling the function `getRandomAvailablePosition()`. More on that later.

**Refresh your game and try swallowing the apple with the snake**

### TODO 8: Check for collisions with the apple

Now that our `apple` has been added to the board, we need to train our snake to actually eat it!

Within the `update` function we can see the logic for doing this:

```javascript
if (hasCollidedWithApple()) {
    handleAppleCollision();
}
```

If the snake `hasCollidedWithApple` then we can `handleAppleCollision`. Makes sense! Let's start with detecting collisions with the apple.

Find the definition for the function `hasCollidedWithApple`.

**Goal: This function hould return true if the snake's head has collided with the apple, false otherwise**
  
Use the following pieces of data to determine if the snake's head has collided with the apple.

```javascript
apple.row           // the current row of the apple
apple.column        // the current column of the apple
snake.head.row      // the current row of snake.head
snake.head.column   // the current column of snake.head 
```

**Save your code, refresh your game, and observe the changes!** If you did this step properly then your snake should be able to eat the Apple.

### TODO 9: Handle Apple Collisions

You may notice that our apple eating behavior isn't perfect. Find the function `handleAppleCollision`. At this point it should have the following logic:

```javascript
// increase the score and update the score DOM element
score++;
scoreElement.text("Score: " + score);

// Remove existing Apple and create a new one
apple.remove();
makeApple();
```

Some things are working fine - the score is increasing, the eaten apple disappears and a new one is created - however our snake isn't getting any bigger! Instead a random green square is being added in the top left corner of the screen. What gives?!?

At the bottom of the function you can find this logic:

```javascript
var row = 0;
var column = 0;

// code to determine the row and column of the snakeSquare to add to the snake

makeSnakeSquare(row, column);
```

As we can see, right now we are creating a new snakeSquare at position (0, 0).

**Goal: determine the `row` and `column` where the next snakeSquare should be placed so that it is added on to the tail of the snake**

Use the following pieces of data to determine if the snake's head has collided with the apple.

```javascript
snake.tail.direction    // "left" or "right" or "up" or "down"
snake.tail.row          // the current row of snake.tail
snake.tail.column       // the current column of snake.tail
```

HINT: If the snake's tail is moving right, the next snakeSquare should be one column to the left. If the column is moving up, the next snakeSquare should be one row below.

**NOTE: Completing this TODO will not make your snake grow properly. It will simply create each new snakeSquare at the point that the snake ate its first apple. Complete the next TODO to make your snake properly grow.**

### TODO 10: Move the body

Find the function definition for `moveSnake`.

Our program is still not working properly. When our snake eats an apple, a new snakeSquare is added to the board in the correct location. However, each new snakeSquare does not follow the snake! 

Add this code below the comment for `TODO: 10`:

```javascript
for ( /* code to loop through the indexes of the snake.body Array*/ ) {
    var snakeSquare = "???";
    
    var nextSnakeSquare = "???";
    var nextRow = "???";
    var nextColumn = "???";
    
    repositionSquare(snakeSquare, nextRow, nextColumn);
    
    var nextDirection = "???";
    snakeSquare.direction = nextDirection;
}
```

In order for the snake to follow the head, each snakeSquare must learn the position and direction of the snakeSquare that is in front of it. Since we want to apply this same logic to every snakeSquare in the `snake.body` Array, iteration using a `for` loop will be very helpful!

**Goal: Reposition each snakeSquare in the `snake.body` Array and update the direction for each snakeSquare**.

HINT 1: Before you start coding, think through how this process will work. How can you access each `snakeSquare` in the `snake.body` Array? How do you know what the `nextSnakeSquare` should be?

Hint 2: The `for` loop will need to be set up in a particular way to make sure that each snakeSquare can follow the snake that comes before it without any data being prematurely overwritten.

Hint 3: Remember that the snake's head is the first entry in `snake.body` so make sure that your loop doesn't include index `0`!

### TODO 11: Check for snake collisions with itself

After eating a few apples our snake will be long enough to potentially run into its own body! Try doing this and you'll notice that our snake will just breeze right through. This is not good...

According to our logic in the `update` function, when this happens, the game is supposed to end! We need to fill out the `hasCollidedWithSnake` function so that it properly detects this collision.

Find the `hasCollidedWithSnake` function. 

**Goal: This function should return true if the `snake.head` has overlapped with any snakeSquare in `snake.body`.**

What data will you need to use to solve this problem?

Hint: Remember that the snake's head is the first entry in `snake.body` so make sure that you aren't comparing `snake.head` with `snake.body[0]`!

### TODO 12: Make sure our Apple is placed only in available positions

Our game is complete! Almost complete anyway...

One tiny detail, and quite an interesting problem to solve, is how to make sure that when our apple is regenerated, it is positioned in a square on our screen that is actually available - that is, in a position not occupied by the snake.

Find the function `getRandomAvailablePosition`.

Currently, this is its logic:
    
```javascript
var spaceIsAvailable;
var randomPosition = {};

while (!spaceIsAvailable) {
    randomPosition.column = Math.floor(Math.random() * COLUMNS);
    randomPosition.row = Math.floor(Math.random() * ROWS);
    spaceIsAvailable = true;
}

return randomPosition;
```

It seems a little weird that we have a while loop that relies on `spaceIsAvailable` to be `true` and part of what it does is to set it to be `true` every time. 

While this code may generate a random location within the confines of our board, it does not guarantee that the space is unoccupied by the snake.

**Goal: Modify the code block in the `while` loop so that if the randomly generated position is occupied by any part of the snake's body, it loops again**
