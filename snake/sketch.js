
// State Variables
// Tyler Boechler
// September 28th, 2018
//
// Extra for Experts:
// Used arrays and objects together to use functions efficiently
// This was also a fun challenge

// How I needed state Variables:
// The first state variable that I needed was a gameState variable to keep track of whether the menu-
// -is being displayed to the pause mode or the actual gameplay. The next variable was a directionState for each snake-
// 1 = left, 2 = up, 3 = right, and 4 = down. It was easier to use a state  because the movement of the snake was a seperate function.
// The last way that I used state variables was for the menu button.

//How the snake array works. It uses and array for each x and y value of a snake cube.
//Each amount of frames, it will increase the x, y values corresponding to direction.
//If the snake gets bigger, it just adds another x, y pair for the arrays to cycle through

//Defining various variables

//The snake objects
let snake1;
let snake2;

//Menu snake drawing array
let menuSnakeX1, menuSnakeX2, menuSnakeY1, menuSnakeY2;
//The state variable for the game
let gameState;

//Variables that determine if the food needs to be displayed
let food1Present, food2Present;

//Both food Coordinates
let foodX1, foodY1;
let foodX2, foodY2;

//How many cubes the screen can be divided into
let heightCubes;
let widthCubes;

//If you need to add a snake cube, then this variable will be true
let addSnake1, addSnake2;

//A state variable for the button
let hoveringButton;

//All the sound variables
let music;
let eatSound;

//Pre loading all the sounds
function preload() {
  music = loadSound("assets/snakemenu.mp3");
  eatSound = loadSound("assets/eatfoodsound.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  //Preseting the booleans for the program
  food1Present = false;
  food2Present = false;

  addSnake1 = false;
  addSnake2 = false;

  //An object that holds the snake's information
  snake1 = {
    //Uses an array of x and y coordinates for the squares of the snake
    xValuesList: [0],
    yValuesList: [0],
    size: 38,
    speed: 40,
    directionState: 3,
    //Direction state defines the direction that the snake goes
    win: false,
  };

  //Another object that holds the other snake's information
  snake2 = {
    xValuesList: [80],
    yValuesList: [0],
    size: 38,
    speed: 40,
    directionState: 4,
    win: false,
  };

  //How many squares the screen can be didived into
  heightCubes = floor(height/snake1.speed);
  widthCubes = floor(width/snake1.speed);

  //Used an array to get rid of ugly code for a menu drawing
  menuSnakeX1 = [6, 7, 7, 8, 9, 10, 10, 10, 10, 10, 10];
  menuSnakeY1 = [3, 3, 4, 4, 4, 4, 4, 5, 6, 7, 8];

  menuSnakeX2 = [35, 35, 34, 34, 34, 34, 34, 34, 33, 32, 31];
  menuSnakeY2 = [3, 4, 4, 5, 6, 7, 8, 9, 9, 9, 9];

  //The starting gamestate is the menu = 1
  gameState = 1;

  textAlign(CENTER);

  //Music volumes and playing the general music
  music.setVolume(0.3);
  eatSound.setVolume(0.3);
  music.loop();
}

function draw() {
  //MENU
  if (gameState === 1) {
    frameRate(60);
    menu();
  }

  //GAME
  else if (gameState === 2) {
    frameRate(6);
    //Slows down the movement speed
    background(0);

    //Calling out to other functions
    drawGrid();
    drawFood();

    //Drawing both snakes
    drawSnakeCubes(snake1);
    drawSnakeCubes(snake2);

    //Checking if the snakes are hit before moving them
    hitSnake();

    //Moving the snakes
    moveSnake(snake1);
    moveSnake(snake2);
  }

  //PAUSE
  else if (gameState === 3) {
    //The pause menu
    frameRate(60);
    fill(255);
    text("PAUSED", width/2, height/2);
  }

  //GAME OVER
  else if (gameState === 4) {
    //If the game ends, it will show the winner and the restart key
    frameRate(60);
    gameOver();
  }
}


function menu() {
  //This function displayes all of the main menu
  background(10);
  drawGrid();

  //Put this in a function so I didn't have to look at it
  backgroundSnakes();

  //All the menu text stuff
  fill(0, 255, 0);
  textSize(55);
  text("TWO PLAYER SNAKE", width/2, 100);
  textSize(20);
  text("There are two snakes in a battle.", width/2, 150);
  text("A green one (WASD controls), and a blue one (IJKL controls)", width/2, 200);
  text("Eat the red food to get longer", width/2, 250);
  text("If you hit your tail, or the tail of the other snake, you lose", width/2, 300);
  text("Press P to pause and have fun", width/2, 350);
  text("By: Tyler B.", width/2, 400);

  //Drawing the start button
  rectMode(CENTER);

  //If the mouse hovers over the button, using a state variable, it will change color.
  if (collidePointRect(mouseX, mouseY, width/2 - 150, 450, 300, 100)) {
    hoveringButton = true;
    if (mouseIsPressed) {
      gameState ++;
      //If they hit the button, the game will begin
    }
  }
  else {
    hoveringButton = false;
  }

  if (hoveringButton) {
    //Changing the fill colors
    fill(60, 0, 0);
  }
  else {
    fill(255, 0, 0);
  }

  rect(width/2, 500, 300, 100);
  //Start button
  rectMode(CORNER);

  fill(255);
  textSize(35);
  text("START", width/2, 510);
  //Putting text into the button
}


function backgroundSnakes() {
  //Draws all of the snakes on the menu screen using an array
  for(let listSpot = 0; listSpot < 11; listSpot++) {
    fill(0, 255, 0);
    //green
    rect(snake1.speed * menuSnakeX1[listSpot], snake1.speed * menuSnakeY1[listSpot], snake1.size, snake1.size);

    fill(0, 0, 255);
    //BLue
    rect(snake1.speed * menuSnakeX2[listSpot], snake1.speed * menuSnakeY2[listSpot], snake1.size, snake1.size);
  }
}

function gameOver() {
  //This function happens whenever a player loses, it will displays the Winner
  music.stop();
  textSize(55);

  if (snake1.win) {
    //If the player 1 wins
    fill(0, 255, 0);
    text("PLAYER 1 WINS", width/2, height/2);
  }
  else if (snake2.win) {
    //The player 2 wins
    fill(0, 0, 255);
    text("PLAYER 2 WINS", width/2, height/2);
  }

  //Doesn't Work Yet...
  // else {
  //   fill(255);
  //   text("TIE", width/2, height/2);
  // }

  text("PRESS R TO RESTART", width/2, height/2 + 200);
  //Displays some text for instructions
}

function drawGrid() {
  //Draws a grid to help players visualise where they will go with turns
  stroke(30);
  //If a box doensn't fit it cuts down a square
  //Works on any screensize

  for(let i = 1; i <= floor(width/snake1.speed); i++) {
    line(i * snake1.speed, 0, i * snake1.speed, floor(height/snake1.speed) * snake1.speed);
    //Draws vertical lines
  }
  for(let j = 1; j <= floor(height/snake1.speed); j++) {
    line(0, j * snake1.speed, floor(width/snake1.speed) * snake1.speed, j * snake1.speed);
    //Horizontal lines
  }
}

function drawFood() {
  //Draws the food dots on the screen in a random cube

  if (!food1Present) {
  //Food 1 of 2
    //Only makes a new food coordinate if there isn't one there

    //Sets the food to new values
    foodX1 = random(1, widthCubes);
    foodY1 = random(1, heightCubes);
    foodY1 = round(foodY1);
    foodX1 = round(foodX1);

    ////Future note, if I continue the project, make it so it can't spawn in the snakes

    food1Present = true;
  }


  //Food # 2
  if (!food2Present) {

    //Sets new random position
    foodX2 = random(1, widthCubes);
    foodY2 = random(1, heightCubes);
    foodY2 = round(foodY2);
    foodX2 = round(foodX2);

    food2Present = true;
  }

  //Checks if the snake has hit the food
  touchingFood();

  //FOOD1
  fill(200, 0, 0);

  ellipse(foodX1 * snake1.speed - snake1.speed/2, foodY1 * snake1.speed  - snake1.speed/2, 15, 15);

  //FOOD2
  fill(200, 0, 0);

  ellipse(foodX2 * snake2.speed - snake2.speed/2, foodY2 * snake2.speed  - snake2.speed/2, 15, 15);
}


function drawSnakeCubes(snakeNumber) {
  //Uses snake number to draw any snake with 1 function
  if (snakeNumber === snake1) {
    fill(0, 255, 0);
    //using the right fill color
  }
  else if (snakeNumber === snake2) {
    fill(0, 0, 255);
  }

  for (let listSpot = 0; listSpot < snakeNumber.xValuesList.length; listSpot ++) {
    //Makes a snake cube for each of the x,y coords in the coresponding list
    rect(snakeNumber.xValuesList[listSpot], snakeNumber.yValuesList[listSpot], snake1.size, snake1.size);
  }
}


function touchingFood() {
  //Detects if a snake hits any of the foods by checking the snake head to see if it's at the same place as the foods

  if ((foodX1 - 1) * snake1.speed === snake1.xValuesList[0] && (foodY1 - 1) * snake1.speed === snake1.yValuesList[0]) {
    //If snake 1 hits food1

    eatSound.play();
    addSnake1 = true;
    //Add a snake cube for snake 1
    food1Present = false;
    //Redraw the food1
  }
  if ((foodX1 - 1) * snake2.speed === snake2.xValuesList[0] && (foodY1 - 1) * snake2.speed === snake2.yValuesList[0]) {
    //If snake2 hits food 1

    eatSound.play();
    addSnake2 = true;
    //Add a cube for snake2
    food1Present = false;
    //Redraw this food
  }
  if ((foodX2 - 1) * snake2.speed === snake2.xValuesList[0] && (foodY2 - 1) * snake2.speed === snake2.yValuesList[0]) {
    //If snake hits food 2
    eatSound.play();
    addSnake2 = true;
    food2Present = false;
  }
  if ((foodX2 - 1) * snake1.speed === snake1.xValuesList[0] && (foodY2 - 1) * snake1.speed === snake1.yValuesList[0]) {
    //If snake 1 hits food 2
    eatSound.play();
    addSnake1 = true;
    food2Present = false;
  }
}

function hitSnake() {
  //Checks if a snake hits the other snake or themself
  //very, very buggy right now :(

  //If player one wins
  //Really long if statement incomming
  //Checks if snake1's x,y array includes the face coordinates of snake 2 OR if snake 2's face coordinates is in it's own array of squares
  if (snake1.xValuesList.includes(snake2.xValuesList[0]) && snake1.yValuesList.includes(snake2.yValuesList[0])) {
    snake1.win = true;
    //This snake wins
    gameState = 4;
  }
  for(let i = 1; i < snake2.xValuesList.length-1; i++) {
    if (snake2.xValuesList[0] === snake2.xValuesList[i] && snake2.yValuesList[0] === snake2.yValuesList[i]) {
      snake1.win = true;
      //This snake wins
      gameState = 4;
    }
  }


  //Ignore this, this is me trying to fix a bug
  // if (snake1.xValuesList.includes(snake1.xValuesList[0], 1) && snake1.yValuesList.includes(snake1.yValuesList[0], 1)) {
  //   console.log(snake1.xValuesList);
  // }


  //If player 2 wins
  //Another long statement
  //Does the same thing as the prior if statement, except for the other snake
  if (snake2.xValuesList.includes(snake1.xValuesList[0]) && snake2.yValuesList.includes(snake1.yValuesList[0])) {
    snake2.win = true;
    gameState  = 4;
  }

  for(let i = 1; i < snake1.xValuesList.length-1; i++) {
    if (snake1.xValuesList[0] === snake1.xValuesList[i] && snake1.yValuesList[0] === snake1.yValuesList[i]) {
      snake2.win = true;
      //This snake wins
      gameState = 4;
    }
  }
  ////Future me note, fix head on collisions to be a tie
}

function moveSnake(snakeNumber) {
  //Snake number is which snake it's moving, I uesd this to allow one function for both snakes
  //Doesn't actually move the snake yet, but changes the array values until the next loop

  if (snakeNumber.directionState === 1) {
    //If the direction is left
    //LEFT
    //Adds new values into the X and Y arrays for that snake that moves it left
    //It does the same thing in each direction state except for different values in the lists
    snakeNumber.xValuesList.splice(0 , 0, snakeNumber.xValuesList[0] - snake1.speed);
    snakeNumber.yValuesList.splice(0, 0, snakeNumber.yValuesList[0]);

    //Gets rid of old values to make the snake the right length
    snakeNumber.xValuesList = shorten(snakeNumber.xValuesList);
    snakeNumber.yValuesList = shorten(snakeNumber.yValuesList);
  }

  else if (snakeNumber.directionState === 2) {
    //UP
    //Does the same as the first function except for a different direction
    snakeNumber.xValuesList.splice(0, 0, snakeNumber.xValuesList[0]);
    snakeNumber.yValuesList.splice(0 , 0, snakeNumber.yValuesList[0] - snake1.speed);

    snakeNumber.xValuesList = shorten(snakeNumber.xValuesList);
    snakeNumber.yValuesList = shorten(snakeNumber.yValuesList);
  }

  else if (snakeNumber.directionState === 3) {
    //RIGHT
    //Does the same as the first function except for a different direction
    snakeNumber.xValuesList.splice(0 , 0, snakeNumber.xValuesList[0] + snake1.speed);
    snakeNumber.yValuesList.splice(0, 0, snakeNumber.yValuesList[0]);

    snakeNumber.xValuesList = shorten(snakeNumber.xValuesList);
    snakeNumber.yValuesList = shorten(snakeNumber.yValuesList);
  }

  else if (snakeNumber.directionState === 4) {
    //DOWN
    //Does the same as the first function except for a different direction
    snakeNumber.yValuesList.splice(0 , 0, snakeNumber.yValuesList[0] + snake1.speed);
    snakeNumber.xValuesList.splice(0, 0, snakeNumber.xValuesList[0]);

    snakeNumber.xValuesList = shorten(snakeNumber.xValuesList);
    snakeNumber.yValuesList = shorten(snakeNumber.yValuesList);
  }

  //ADDING SNAKES if they hit a dot
  //If any of the addSnake values are true, add a snake for that snakeNumber
  //Makes sure that the right snake is being manipulated
  if (addSnake1 && snakeNumber === snake1 || addSnake2 && snakeNumber === snake2) {
    if (snakeNumber.directionState === 1) {
      //Adds a new value into the x, y arrays to make another cube in the right direction (Left)
      snakeNumber.xValuesList.splice(0 , 0, snakeNumber.xValuesList[0] - snakeNumber.speed);
      snakeNumber.yValuesList.splice(0, 0, snakeNumber.yValuesList[0]);
    }

    else if (snakeNumber.directionState === 2) {
      //Makes new cube for (UP)
      snakeNumber.xValuesList.splice(0, 0, snakeNumber.xValuesList[0]);
      snakeNumber.yValuesList.splice(0 , 0, snakeNumber.yValuesList[0] - snakeNumber.speed);
    }

    else if (snakeNumber.directionState === 3) {
      //Makes a new cube for (Right)
      snakeNumber.xValuesList.splice(0 , 0, snakeNumber.xValuesList[0] + snake1.speed);
      snakeNumber.yValuesList.splice(0, 0, snakeNumber.yValuesList[0]);
    }

    else if (snakeNumber.directionState === 4) {
      //A new cube for (down)
      snakeNumber.yValuesList.splice(0 , 0, snakeNumber.yValuesList[0] + snake1.speed);
      snakeNumber.xValuesList.splice(0, 0, snakeNumber.xValuesList[0]);
    }
    //Because I don't like infinate snakes, resets the addSnake to not add more cubes
    if (addSnake1) {
      addSnake1 = false;
    }
    if (addSnake2) {
      addSnake2 = false;
    }
  }

  //Going through wall logic below

  //There are 4 cases
  if (snakeNumber.xValuesList[0] < 0) {
    //If this snake's x is less than 0, put his face's x at the right end of the screen
    snakeNumber.xValuesList.splice(0, 0, floor(width/snakeNumber.speed) * snakeNumber.speed - snakeNumber.speed);
    snakeNumber.xValuesList = shorten(snakeNumber.xValuesList);
  }

  else if(snakeNumber.xValuesList[0] > floor(width/snakeNumber.speed) * snakeNumber.speed - snakeNumber.speed) {
    //If the snake goes through the right side of the screen, reset face's x to be
    snakeNumber.xValuesList.splice(0, 0, 0);
    snakeNumber.xValuesList = shorten(snakeNumber.xValuesList);
  }

  else if(snakeNumber.yValuesList[0] < 0) {
    //If the snake goes above the screen, then reset the face y to be under the screen
    snakeNumber.yValuesList.splice(0, 0, floor(height/snakeNumber.speed) * snakeNumber.speed);
    snakeNumber.yValuesList = shorten(snakeNumber.yValuesList);
  }

  else if(snakeNumber.yValuesList[0] > floor(height/snake1.speed) * snakeNumber.speed - snakeNumber.speed) {
    //Last case, if the snake goes below the screen boundary, reset the face y to be the top of the screen
    snakeNumber.yValuesList.splice(0, 0, 0);
    snakeNumber.yValuesList = shorten(snakeNumber.yValuesList);
  }
}



function keyTyped() {
  //All of the key controlls

  //Player one controls (WASD)
  //LEFT
  if (key === "a" || key === "A") {
    snake1.directionState = 1;
  }

  //UP
  else if (key === "w" || key === "W") {
    snake1.directionState = 2;
  }

  //RIGHT
  else if (key === "d" || key === "D") {
    snake1.directionState = 3;
  }

  //DOWN
  else if (key === "s" || key === "S") {
    snake1.directionState = 4;
  }

  //--------------------------------------------------------------
  //Player 2 controls (IJKL)
  //Left
  if (key === "j" || key === "J") {
    snake2.directionState = 1;
  }

  //UP
  else if (key === "i" || key === "I") {
    snake2.directionState = 2;
  }

  //RIGHT
  else if (key === "l" || key === "L") {
    snake2.directionState = 3;
  }

  //DOWN
  else if (key === "k" || key === "K") {
    snake2.directionState = 4;
  }


  //Pausing
  if (key === "p" || key === "P") {
    //To allow it to pause and unpause it depends on the state
    if (gameState === 2) {
      music.setVolume(0.05);
      //Softer music
      gameState = 3;
    }

    else if (gameState === 3) {
      gameState = 2;
      music.setVolume(0.3);
    }
  }

  //REset in the gameover state
  if (gameState === 4) {
    if (key === "r" || key === "R") {
      //Hits the r key in gameover mode
      //The general reset of variables in the game
      snake1.win = false;
      snake2.win = false;

      gameState = 1;
      //Retruns to the menu

      snake1.xValuesList = [0];
      snake1.yValuesList = [0];

      snake1.directionState = 3;

      snake2.xValuesList = [80];
      snake2.xValuesList = [0];
      snake2.directionState = 4;

      music.loop();
    }
  }
}
