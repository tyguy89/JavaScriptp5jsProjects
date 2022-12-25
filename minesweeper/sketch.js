// Grid based game (minesweeper)
// Tyler Boechler
// Oct 26th, 2018
//
// Extra for Experts:
// Floodfill(ish), number filling, mobile compatibility, minesweeper logic (winning, flag...)




//Stating Variables

//The grid is the visible playing board the user see's
let grid;
//The undergrid is the values of the uncovered squares
let underGrid;

//Size of the grid
let cols = 25;
let rows = 25;
let cellSize;

//A value used to centre the numbers in the squares
const NUMBER_OFFSET = 0.09554140127388536;

//The odds of a square being a mine
let mineProbability = 16;

//Images
let mine, flag, square, crossedMine, redMine;

//A variable used to end the game
let clickedMine;

//A state variable, 1 = playing, 2 = wins, 3 = lost
let gameState = 1;

let totalMines = 0;
let theoreticalMines;

//For the clicked mine
let mineX, mineY;

// let canvas;

//GRIDS' LEGEND:
// x = mine
//-1 = covered square
// f = flag
// xf = mine covered by flag
// 0,1,2... = neighbouring mines


function preload() {
  //Preloading my images
  mine = loadImage("assets/minesweeperbomb.PNG");
  flag = loadImage("assets/minesweeperflag.PNG");
  square = loadImage("assets/minesweepersquare.PNG");
  crossedMine = loadImage("assets/minesweepercrossedbomb.PNG");
  redMine = loadImage("assets/minesweeperclickedbomb.PNG");
}

function setup() {
  //Using the smaller side of the screen
  if (windowHeight > windowWidth) {
    cellSize = floor(windowWidth / cols);
  }

  else {
    cellSize = floor(windowHeight / cols);
  }

  createCanvas(windowWidth, windowHeight);

  //This didn't work
  // canvas = createCanvas(windowWidth, windowHeight);

  // canvas.position(width/2 - cols/2 * cellSize, 0);

  //Setting up the grids
  grid = generateBlankGrid(cols, rows);

  underGrid = generateUnderGrid(cols, rows);
  theoreticalMines = totalMines;
  //Theoretical mines is the number the user can see (not actual)
  underGrid = fillNumbers(cols, rows);

  textSize(cellSize/1.9);
  textAlign(LEFT);

  clickedMine = false;
}

function draw() {
  //Playing
  if (gameState === 1) {
    background(0);
    //Black background
    //Showing the visuals
    drawGrid();
    displayMinesLeft();

    //Checks if the user won
    if(didWin()) {
      gameState = 2;

      textAlign(CENTER);
      textSize(50);
      fill(0, 255, 0);
      text("YOU WIN!", width/1.8, height/3);
    }

    if (clickedMine) {
      deadAnimation();
      //Shows the mines on the board
    }
  }

  //Win
  else if (gameState === 2){
    textSize(50);
    textStyle(BOLD);
    fill(0, 255, 0);
    //Displaying text
    text("Congratulations! Press 'r' or shake to restart", width/2, height/1.2);
  }

  //GameOver
  else if (gameState === 3) {
    textSize(50);
    textStyle(BOLD);
    fill(255, 0, 0);
    //Displaying text
    text("Game over!, press 'r' or shake to restart.", width/5, height/2);
  }

}

function displayMinesLeft() {
  //Displays the number of mines still left to be flagged, (if the user flags a non-mine, the number still goes down)
  fill(255, 0, 0);
  textSize(40);

  text(theoreticalMines.toString(), width/1.5, height/1.5);
  textSize(cellSize/1.9);
}

function resetGame() {
  //Resets the variables, grids, and text
  totalMines = 0;
  grid = generateBlankGrid(cols, rows);

  underGrid = generateUnderGrid(cols, rows);
  theoreticalMines = totalMines;
  underGrid = fillNumbers(cols, rows);

  textSize(cellSize/1.9);
  textStyle(NORMAL);
  textAlign(LEFT);

  clickedMine = false;
  gameState = 1;
}

function keyTyped() {
  //Resets the game whenever the "r" is typed
  if (key === "r") {
    resetGame();
  }
}

function deviceShaken() {
  //Resets the game on mobile
  resetGame();
}

function generateBlankGrid(cols, rows) {
  //Makes a blank 2'd Array full of -1's
  let startGrid = [];
  for (let y = 0; y < cols; y++) {
    startGrid.push([]);
    for (let x = 0; x < rows; x++) {
      startGrid[y].push(-1);
      // -1's represent convered squares on the grid
    }
  }

  return startGrid;
}


function generateUnderGrid(cols, rows) {
  //Makes a random 2d Array (grid) with mines
  let startUnderGrid = [];
  for (let y = 0; y < cols; y++) {
    startUnderGrid.push([]);
    for (let x = 0; x < rows; x++) {

      //mines will be a x, not a mine will be a -1 for now
      if (random(100) <= mineProbability) {
        // The chance of a square being a mine
        startUnderGrid[y].push("x");
        totalMines++;
      }

      else {
        startUnderGrid[y].push(-1);
      }

    }
  }

  return startUnderGrid;
}

function fillNumbers() {
  //Goes through the undergrid and adds the number of neighbouring mines for each square
  let numberedGrid = [];
  let notMine;
  //A local variable to detect if a square is a mine or not

  for (let y = 0; y < cols; y++) {
    numberedGrid.push([]);
    for (let x = 0; x < rows; x++) {
      //Every square

      let minesAround = 0;
      //Local variable that holds the mines neighbouring each sq.

      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          //Looking at each neighbouring square

          if (x+i >= 0 && x+i < cols && y+j >= 0 && y+j < rows) {
            //Corner cases
            if (underGrid[y][x] === -1) {
              //Making sure to not replace mines with numbers
              notMine = true;

              if (underGrid[y+j][x+i] === "x") {
                minesAround++;
              }
            }

            else {
              notMine = false;
              //This square is a mine
            }

          }
        }
      }

      if (notMine) {
        numberedGrid[y].push(minesAround);
        //Puts the number into the grid
      }

      else {
        numberedGrid[y].push("x");
        //Puts a mine into the grid
      }

    }
  }

  return numberedGrid;
}




function mousePressed() {
  if (mouseButton === LEFT) {
    //If the user right clicks, update the square
    updateGrid();
  }
  else if (mouseButton === RIGHT) {
    //Draw a flag on the square the user right clicked on
    drawFlag();
  }
  else {
    //For mobile support
    updateGrid();
  }
}


function updateGrid() {
  //Finds the square the user clicked and sets the grid to the under value
  let xSquare = floor(mouseX/cellSize);
  let ySquare = floor(mouseY/cellSize);
  //Clicked square

  if (grid[ySquare][xSquare] !== "f") {
    //If you click on a flag, nothing happens
    //Sets the visible grid to the square
    grid[ySquare][xSquare] = underGrid[ySquare][xSquare];
  }

  //If the square is a mine, to allow the clikced mine to be red, this is to know what mine was clicked
  mineX = xSquare;
  mineY = ySquare;
}

function drawFlag() {
  //Draws/removes a flag on a square, and updates mine counters
  let xSquare = floor(mouseX/cellSize);
  let ySquare = floor(mouseY/cellSize);
  //The clicked square

  if (grid[ySquare][xSquare] === -1) {
    //If the square is a convered square, set the grid to a flag
    grid[ySquare][xSquare] = "f";
    theoreticalMines--;
  }
  else if (grid[ySquare][xSquare] === "f"){
    //If the square is already a flag, resets it to be normal
    grid[ySquare][xSquare] = -1;
    theoreticalMines++;
  }

}


function drawGrid() {
  //Draws the visible grid
  for (let y = 0; y < cols; y++) {
    for (let x = 0; x < rows; x++) {
      //Going through every square
      let drawRect = true;
      //I only want a rectangle drawn for the numbers, and not the mines
      let number;
      //The number of neighbouring mines

      if (grid[y][x] === -1) {
        //Draw a covered square
        image(square, x * cellSize, y * cellSize, cellSize, cellSize);
        drawRect = false;
      }

      else if (grid[y][x] === 0) {
        //If the square is a 0, open up the whole area of 0s in proximity
        openSquares(x, y);
      }


      else if (grid[y][x] === "x") {
        //If the grid has a mine
        fill(255);
        drawRect = false;
        clickedMine = true;
        //If a grid has a mine, then the user must have clicked one

        rect(x * cellSize, y * cellSize, cellSize, cellSize);
        //The rect makes a border

        image(mine, x * cellSize + 1, y * cellSize + 1, cellSize-1, cellSize-1);
        //Draw the mine image

        if (x === mineX && y === mineY) {
          //Draws the red mine on the clicked mine
          image(redMine, x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }

      else if (grid[y][x] === "xf") {
        //If the user flagged a mine, but another mine is clicked, it will draw a crossed off mine
        fill(255);
        drawRect = false;
        clickedMine = true;

        rect(x * cellSize, y * cellSize, cellSize, cellSize);

        image(crossedMine, x * cellSize + 1, y * cellSize + 1, cellSize-1, cellSize-1);
      }

      else if (grid[y][x] === "f") {
        //Draws a flag
        drawRect = false;
        image(flag, x * cellSize, y * cellSize, cellSize, cellSize);

      }

      if (drawRect) {
        //Draws a empty square
        fill(255);
        stroke(159);
        rect(x * cellSize, y * cellSize, cellSize, cellSize);
      }

      textStyle(NORMAL);

      //Draws the number of neighbouring mines on the square that was clicked with it's corresponding colour
      //Same thing for all 8 cases
      if (grid[y][x] === 1) {
        fill("blue");
        text("1", x * cellSize + cellSize/2 - cellSize * NUMBER_OFFSET, y * cellSize + cellSize/2 + cellSize * NUMBER_OFFSET);
      }

      else if (grid[y][x] === 2) {
        fill("green");
        text("2", x * cellSize + cellSize/2 - cellSize * NUMBER_OFFSET, y * cellSize + cellSize/2 + cellSize * NUMBER_OFFSET);
      }

      else if (grid[y][x] === 3) {
        fill("red");
        text("3", x * cellSize + cellSize/2 - cellSize * NUMBER_OFFSET, y * cellSize + cellSize/2 + cellSize * NUMBER_OFFSET);
      }

      else if (grid[y][x] === 4) {
        fill(0, 0, 125);
        textStyle(BOLD);
        text("4", x * cellSize + cellSize/2 - cellSize * NUMBER_OFFSET, y * cellSize + cellSize/2 + cellSize * NUMBER_OFFSET);
      }

      else if (grid[y][x] === 5) {
        fill(130, 0, 10);
        textStyle(BOLD);
        text("5", x * cellSize + cellSize/2 - cellSize * NUMBER_OFFSET, y * cellSize + cellSize/2 + cellSize * NUMBER_OFFSET);
      }

      else if (grid[y][x] === 6) {
        textStyle(BOLD);
        fill(126, 177, 186);
        text("6", x * cellSize + cellSize/2 - cellSize * NUMBER_OFFSET, y * cellSize + cellSize/2 + cellSize * NUMBER_OFFSET);
      }

      else if (grid[y][x] === 7) {
        textStyle(BOLD);
        fill(0);
        text("7", x * cellSize + cellSize/2 - cellSize * NUMBER_OFFSET, y * cellSize + cellSize/2 + cellSize * NUMBER_OFFSET);
      }

      else if (grid[y][x] === 8) {
        textStyle(BOLD);
        fill(200);
        text("8", x * cellSize + cellSize/2 - cellSize * NUMBER_OFFSET, y * cellSize + cellSize/2 + cellSize * NUMBER_OFFSET);
      }

    }
  }

}



function deadAnimation() {
  //When a mine is clicked, it will show every other mine on the grid
  for(let i = 0; i < cols; i++) {
    for(let j = 0; j < rows; j++) {
      //Looking at every square, if it is a mine, change the visible grid to display a mine
      if(underGrid[i][j] === "x") {
        if (grid[i][j] !== "f") {
          grid[i][j] = underGrid[i][j];
        }

        else {
          //If that mine is flagged, turn it into a crossed mine
          grid[i][j] = "xf";
        }

        gameState = 3;
      }
    }
  }
  drawGrid();
  //Redraw the grid
}

function openSquares(x, y) {
  //Kindof floodfill
  //If the user hits a 0, it will open every neighbouring 0 and 1st row of numbers
  for(let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      //Looking at the neighbours of the SQUARE

      if (x+i >= 0 && x+i < cols && y+j >= 0 && y+j < rows){
        //Corners

        if (underGrid[y+j][x+i] !== "x" && grid[y+j][x+i] !== "f") {
          //If the square isn't a mine or a flag, display it.
          grid[y+j][x+i] = underGrid[y+j][x+i];
        }
      }
    }
  }
}

function didWin() {
  //Checks if the user wins by flagging every mine AND clicking every square.
  let win = 0;
  //A local variable to see if two parts of the user winning is true
  let checkMines = totalMines;

  for(let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j] !== -1 && win !== false){
        //If the square is clicked and no previous square isn't clicked,
        if (grid[i][j] === "f" && underGrid[i][j] === "x") {
          checkMines --;
          //if the square is a mine and a flag, subtract one from the total number of mines
        }
      }

      else {
        win = false;
      }

    }
  }

  if(checkMines === 0 && win === 0) {
    //If every mine has a flag, and no square is a -1, the user wins
    win = true;
  }
  else {
    //Other than that, they do not
    win = false;
  }

  return win;
  //Returns true or false
}
