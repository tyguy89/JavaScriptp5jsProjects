// Major PROJECT
// Tyler Boechler
// December 12th, 2018

// Because it is hard to notice in the code, I did implement the tap to do a dive mechanic in my need to have list
// It is formatted as layout vs straight, layout occurs at an angle < 90 and the diver rotates very slowely
// allowing the player to do a dive on a short click


//Player & button classes

class Player {
  constructor(boardHeight) {
    this.boardHeight = boardHeight;
    //Sets the preset board height 1m or 3m

    //All movement variables
    this.initX = width/3;
    this.initY = 100;

    this.x = this.initX;
    this.y = this.initY;

    this.dx = 1.75;
    this.dy = -4;
    //Starting with a negative dy to make a jump

    this.angle = 0;
    this.go = false;

    this.tuckSpinSpeed = 1.7;
    this.tuckSpinIncrease = 0.06;

    this.layoutSpeed = 0.8;
    this.position = "layout";


    //Scoring and logic variables
    this.straightened = false;
    this.secondTuck = false;

    this.direction = 1;

    this.facing = "forwards";
    this.spin = "forwards";

    this.didFail = false;
  }

  update() {
    //Updates the player with gravity and rotation

    if(this.direction === 1 || this.direction === 3) {
      //Both front and reverse, the diver faces forwards
      this.facing = "forwards";

      if(this.direction === 3) {
        //But for reverse the diver angle must increase negatively
        this.spin = "backwards";
      }
      else {
        this.spin = "forwards";
      }

    }

    else if(this.direction === 2 || this.direction === 4) {
      //For both inward and back, the diver faces backwards
      this.facing = "backwards";

      if (this.direction === 4) {
        //For inward the diver angle increases negatively
        this.spin = "backwards";
      }
      else {
        this.spin = "forwards";
      }
    }

    if(this.spin === "forwards" && this.tuckSpinSpeed < 0) {
      //If the divers tuck spin speed is negative, and the diver is going to spin forwards, change the angles to be +
      this.tuckSpinSpeed = -1 * this.tuckSpinSpeed;
      this.layoutSpeed = -1 * this.layoutSpeed;
      this.tuckSpinIncrease = -1 * this.tuckSpinIncrease;
    }

    else if(this.spin === "backwards" && this.tuckSpinSpeed > 0) {
      //If the divers tuck spin speed is positive, and the diver is going to spin backwards, change the angles to be -
      this.tuckSpinSpeed = -1 * this.tuckSpinSpeed;
      this.layoutSpeed = -1 * this.layoutSpeed;
      this.tuckSpinIncrease = -1 * this.tuckSpinIncrease;
    }

    if (this.position === "layout") {
      //Increases the angle less on layout
      this.angle += this.layoutSpeed;
    }

    else if (this.position === "tuck") {
      //Increases the angle by the greater than staight, tuck speed
      this.angle += this.tuckSpinSpeed;
      this.tuckSpinSpeed += this.tuckSpinIncrease;
      //Make the tuck speed faster to have accelerated rotation

      if(this.straightened) {
        //If the diver is in a tuck after they straightened, then they tucked atleast 2 times (affects scoring)
        this.secondTuck = true;
      }
    }

    else if (this.position === "straight") {
      //Straight is after spinning in a tuck
      if(this.angle < 90 && this.angle > -90) {
        //For dives to be possible, this is the tap to dive thing. If the diver is at less than a dive, make them spin slowely in the layout position
        this.position = "layout";
      }

      else {
        this.angle += this.tuckSpinSpeed/2.7;
        //Increases the rotation by a fraction of the speed of the tuck
      }

      if (this.tuckSpinSpeed > 3) {
        //Slows down the tuck speed incase the diver returns to a tuck, it makes it look more fluid
        this.tuckSpinSpeed -= 0.02;
      }

      this.straightened = true;
    }

    //Adding gravity and horizontal displacement
    this.y += this.dy;
    this.dy += 0.080;
    //This number worked well
    this.x += this.dx;

    //Makes it less like a parabola (looks better)
    if (this.dx > 0.1) {
      this.dx -= 0.01;
    }
  }


  display() {
    //Pushing, then performing all transformations
    push();

    translate(this.x, this.y);
    if (this.go) {
      rotate(this.angle);
    }

    //Drawing the players (4 different) depending on the position and direction

    //FRONT STRAIGHT
    if((this.direction === 1 || this.direction === 3) && player.position !== "tuck") {
      //The straight when the diver faces forwards

      //Drawing
      strokeWeight(7);
      //BODY
      line(0, -10, 0, 50);

      if(!this.go) {
        //Toe point
        line(0, 50, 10, 50);

      }
      else {
        //Toe point
        line(0, 50, 2, 60);
        //Hand grab
        point(2.5, -61);
      }

      fill(255);
      //ARM
      line(0, 10, 5, -60);
      //HEAD
      ellipse(0, -30, 33, 33);
      //ARM
      line(0, 10, 0, -60);

      strokeWeight(1);

    }

    //BACKWARDS STRAIGHT
    else if ((this.direction === 2 || this.direction === 4) && player.position !== "tuck") {
      //The straight position when the diver faces backwards
      strokeWeight(7);
      line(0, -10, 0, 50);
      if(!this.go) {
        //FEET
        line(0, 50, -10, 50);

      }
      else {
        //FEET
        line(0, 50, -2, 60);
        //Hand grab
        point(-2.5, -61);
      }

      fill(255);
      //ARMS
      line(0, 10, -5, -60);
      //HEAD
      ellipse(0, -30, 33, 33);
      //ARMS
      line(0, 10, 0, -60);
      strokeWeight(4);

      strokeWeight(1);
    }

    //BACKWARDS TUCK
    else if(player.direction === 2 || player.direction === 4) {
      strokeWeight(7);
      fill(255);
      //BODY
      line(0, -40, 0, 20);
      //FEMUR
      line(0, 20, -18, 0);
      ellipse(0, -40, 31, 31);
      //FEET and shins
      line(-18, 0, -24, 20);

      //Arms
      line(0, -15, -18, 13);

    }

    //FORWARDS TUCK
    else if(player.direction === 3 || player.direction === 1) {
      strokeWeight(7);
      fill(255);
      //BODY
      line(0, -40, 0, 20);
      //FEMUR
      line(0, 20, 18, 0);
      ellipse(0, -40, 31, 31);
      //FEET and shins
      line(18, 0, 24, 20);

      //Arms
      line(0, -15, 18, 13);
    }

    fill(0);
    textSize(width/54);

    //The small arrow to define direction spinning
    if((this.direction === 1 || this.direction === 2) && !this.go) {
      text("→", 0, -70);
    }
    else if((this.direction === 3 || this.direction === 4) && !this.go) {
      text("←", 0, -70);
    }

    //Popping so the screen doesn't rotate
    pop();
  }


  swim() {
    //Makes a slight delay before the diver reappears on the board
    this.y += this.dy;
    if(this.y > height + 100) {
      return true;
    }
    return false;
  }


  reset() {
    //RESETS most player variables
    this.x = this.initX;
    this.y = boardHeight;

    this.width = 40;
    this.height = 110;
    this.dx = 1.75;
    this.dy = -4;


    this.angle = 0;
    this.go = false;

    this.tuckSpinSpeed = 1.7;
    this.tuckSpinIncrease = 0.06;

    this.position = "layout";
    this.straightened = false;
    this.secondTuck = false;
    this.layoutSpeed = 0.8;
    this.direction = 1;

    this.facing = "forwards";
    this.spin = "forwards";

    this.didFail = false;
  }
}

//A class for the tuck, direction, and go buttons
class DivingButton {
  constructor(playerThing, changeTo, level, message) {
    //The constructor takes in what the button changes, what it changes that thing to, it's height level and message
    this.radius = height/13;

    this.x = width - this.radius - 40;
    this.y = height - level * (height/5.5) - height/7;
    //using height to make the buttons work on other screensizes

    //Three colors :D
    this.color = color(255, 0, 255);
    this.hoveringColor = color(100, 100, 255);
    this.changeColor = color(0, 255, 0);

    this.available = false;
    //Should the button be pressable?

    this.whatToChange = playerThing;
    this.changeTo = changeTo;
    //The variable changes

    this.on = false;
    //On as in button is "on" as in pressed currently
    this.selected = false;

    this.message = message;
  }

  display() {
    //Shows and does all detection things

    if(this.available) {
      if(collidePointCircle(mouseX, mouseY, this.x, this.y, this.radius*2)) {

        fill(this.hoveringColor);
        if(mouseIsPressed) {

          fill(this.changeColor);
          //If the thing the button changes is the go variable,
          if(this.whatToChange === "go") {
            if(player.go !== true) {
              //The button should only be available if the player hasn't went yet
              player.go = this.changeTo;
              this.on = true;
            }

            else {
              //Don't have the buttons work when they can't/shouldn't be used
              this.available = false;
            }
          }

          //Change the player position when the diver is in the air
          else if(this.whatToChange === "position") {
            if(player.go) {
              player.position = this.changeTo;
              this.on = true;
            }

            else {
              this.available = false;
            }
          }

          //change the diver direction while they are on the board
          else if(this.whatToChange === "direction") {
            if(!player.go) {
              player.direction = this.changeTo;
              this.selected = true;
            }
            else {
              this.available = false;
            }
          }
        }

        else {
          //If the button isn't being pressed, turn it off
          this.on = false;
        }
      }

      else {
        //If the mouse isn't over the button, turn it off
        this.on = false;
        fill(this.color);
      }
    }

    else {
      //Availability rules for each type of button, some are available when the diver is on the board or in the air
      if(player.go === false && this.whatToChange === "go") {
        this.available = true;
      }

      else if(player.go === true && this.whatToChange === "position") {
        this.available = true;
      }

      else if(player.go === false && this.whatToChange === "direction") {
        this.available = true;
      }

      else {
        this.available = false;
      }

      //The non available color
      fill(160);
    }

    if(player.direction === this.changeTo) {
      fill(this.changeColor);
      //If the button that controls the divers direction is selected, make it a diff color
    }

    //Draw the button and it's message
    ellipse(this.x, this.y, this.radius*2, this.radius*2);
    fill(0);
    textSize(width/54);
    textAlign(CENTER, CENTER);
    text(this.message, this.x, this.y);
  }
}

//A button used in the tutorial
class ContinueButton {
  constructor(x, y) {
    //Position and size
    this.x = x;
    this.y = y;
    this.width = width/8;
    this.height = height/8;

    this.color = color(255, 255, 0);
    this.hoveringColor = color(0, 255, 0);

    this.selected = false;
  }

  display(yChange) {
    //Displays and checks mouse detection. yChange is used to move the button so the player isn't continuously pressing the next button
    if(collidePointEllipse(mouseX, mouseY, this.x, this.y + yChange, this.width, this.height)) {
      fill(this.hoveringColor);

      if(mouseIsPressed) {
        //Move the tutorial to the next slide
        this.selected = true;
        tutorialState ++;
        player.reset();
      }
    }

    else {
      fill(this.color);
    }

    //Draw the button
    rectMode(CENTER);
    ellipse(this.x, this.y + yChange, this.width, this.height);
    fill(0);
    text("CONTINUE", this.x, this.y + yChange);
    rectMode(CORNER);

  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Variables begin

let gameState;

let player;
let boardHeight;

let diveDone;
let finishedDive;
let lastScores;

//Timing variables
let initTime;
let initTimeCompButton;

//A varaible for the switch board button
let switchButtonY;

//The diving buttons
let frontButton, backButton, reverseButton, inwardButton;
let tuckButton, goButton;
let continueButton;
//Images
let menuPool;

//The competition and difficulty lists
let compListOne, compListTwo, compListThree, compListFour;
let ddListOne, ddListTwo, ddListThree, ddListFour;

//There is 4 compmodes, one for each competition
let compMode = 0;
//A variable used temporarily for doing something once in the draw loop
let temp;
let diverScore = 0;

let compDives= [];
let compDds = [];

let diveCounter = 0;

let introTimer;

//Scores and records
let compRecordOne = 150;
const CREATOR_SCORE_ONE = 232;

let compRecordTwo = 205;
const CREATOR_SCORE_TWO = 282;

let compRecordThree = 300;
const CREATOR_SCORE_THREE = 392;

let compRecordFour = 440;
const CREATOR_SCORE_FOUR = 507;

//Sounds
let poolAmbiance, mediumSplash, menuMusic, whistle;
let noMusic, noSound, compSplash;

let mute;

let tutorialState = 1;


function preload() {
  //assets
  menuPool = loadImage("assets/menuimage.jpg");
  poolAmbiance = loadSound("assets/poolAmbiance.mp3");
  mediumSplash = loadSound("assets/mediumSplash.wav");
  menuMusic = loadSound("assets/menuTheme.mp3");
  whistle = loadSound("assets/whistle.wav");
}

function setup() {
  angleMode(DEGREES);


  createCanvas(windowWidth, windowHeight);

  finishedDive = false;

  switchButtonY = height/10;
  boardHeight = 100;

  //Default sound on
  mute = false;

  gameState = 1;
  //Guide to gameState
  //1 = Selection/Main menu
  //2 = Practice
  //3 = Competition menu
  //4 = Competition
  //5 = Settings/How to play/Tutorial

  //The divers lists, used as a 2D array to be able to acess each list using numbers
  compListOne = ["101c", "201c", "401c", "202c", "301c", "103c"];
  ddListOne = [1.2, 1.5, 1.4, 1.5, 1.6, 1.6];
  compListTwo = ["103c", "201c", "302c", "403c", "303c", "404c"];
  ddListTwo = [1.5, 1.7, 1.8, 1.9, 2.0, 2.4];

  compListThree = ["103c", "201c", "301c", "401c", "104c", "204c", "303c", "403c"];
  ddListThree = [1.6, 1.5, 1.6, 1.4, 2.2, 2.2, 2.1, 2.2];
  compListFour =  ["105c", "204c", "303c", "404c", "106c", "205c", "306c", "405c"];
  ddListFour = [2.2, 1.9, 2.0, 2.4, 2.5, 2.8, 2.6, 2.7];

  compDives.push(compListOne);
  compDives.push(compListTwo);
  compDives.push(compListThree);
  compDives.push(compListFour);

  compDds.push(ddListOne);
  compDds.push(ddListTwo);
  compDds.push(ddListThree);
  compDds.push(ddListFour);

  //Making objects
  player = new Player(0, 0);
  goButton = new DivingButton("go", true, 0, "GO");
  tuckButton = new DivingButton("position", "tuck", 1, "Tuck");

  frontButton = new DivingButton("direction", 1, 1, "Front");
  backButton = new DivingButton("direction", 2, 2, "Back");
  reverseButton = new DivingButton("direction", 3, 3, "Reverse");
  inwardButton = new DivingButton("direction", 4, 4, "Inward");

  continueButton = new ContinueButton(width/2, height/1.5);
}


function draw() {
  //Always check for audio
  muting();

  //Perform the game option depending on the state
  if(gameState === 1) {
    mainMenu();
  }

  else if (gameState === 2) {
    practice();
  }

  else if (gameState === 3) {
    competitionMenu();
  }

  else if (gameState === 4) {
    competition();
  }

  else if (gameState === 5) {
    tutorial();
  }
}

//The gamstate Functions, and the funtions they use unique to them

function mainMenu() {
  //Does all main menu things

  //Play music if haven't already
  if(noMusic !== false) {
    menuMusic.loop();
    noMusic = false;
  }

  //Display background and title
  image(menuPool, 0, 0, width, height);
  textSize(width/9);
  fill(255, 20, 70);
  text("Dynamic Diving", width/2, 250);

  //Draw and operate the staring option buttons
  drawStartButtons();
}


function drawStartButtons() {
  //Draws the buttons for the game options, practice, competition or tutorial
  fill(0);

  textSize(width/40);
  stroke(0);

  //PRACTICE BUTTON
  if(collidePointEllipse(mouseX, mouseY, width/4, height-height/4, width/5, height/5)) {
    fill(255, 0, 0);
    if(mouseIsPressed) {
      //Move to practice screen
      gameState = 2;
      //Stop the music and allow new music
      menuMusic.stop();
      noMusic = "";
    }
  }

  else {
    fill(255, 120, 0);
  }
  strokeWeight(3);
  ellipse(width/4, height-height/4, width/5, height/5);


  //COMPETITION BUTTON
  if(collidePointEllipse(mouseX, mouseY, width/4 * 3, height-height/4, width/5, height/5)) {
    fill(255, 0, 0);
    if(mouseIsPressed) {
      //Go to the competition menu
      gameState = 3;
      //Use a timer, because a new button spawns at the location of this button, using a timer to not "double click"
      initTimeCompButton = millis();
    }
  }

  else {
    fill(255, 120, 0);
  }
  ellipse(width/4 * 3, height-height/4, width/5, height/5);

  //HOW TO PLAY BUTTON
  if(collidePointEllipse(mouseX, mouseY, width/2, height-height/7, width/10, width/10)) {
    fill(255, 0, 0);
    if(mouseIsPressed) {
      //Go to tutorial
      gameState = 5;
    }
  }

  else {
    fill(255, 120, 0);
  }
  ellipse(width/2, height-height/7, width/10, width/10);

  //Draw all text for buttons
  strokeWeight(2);
  fill(255);
  textAlign(CENTER, CENTER);

  text("PRACTICE", width/4, height-height/4);
  text("COMPETITION", width/4 * 3, height-height/4);

  textSize(width/70);
  text("HOW TO PLAY", width/2, height-height/7);
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function practice() {
  //The diving practice gamemode

  //Play the music if necessary
  if(noMusic !== false) {
    poolAmbiance.loop();
    noMusic = false;
  }

  background(255); // white background

  //Update the player if the player is going
  if (player.go) {
    updatePlayer();
  }

  else {
    //display this button only when the player isn't going
    switchBoardButton();
  }

  //Draw the player, pool, and buttons
  player.display();
  drawPool();
  displayButtons();
  //The backpage button
  returnButton(1, 1, false);

  //If the dive is over, show a display of the score, etc
  if(finishedDive && !player.go) {
    if(millis() < initTime + 5000) {
      //display for 5 seconds
      practiceDisplay();
    }
    else {
      finishedDive = false;
    }
  }
}

//Allows the user to switch boards in practice mode.
function switchBoardButton() {
  if(collidePointCircle(mouseX, mouseY, width-300, switchButtonY, 90, 90)) {
    fill(0, 255, 255);
    if(mouseIsPressed) {
      //Swap the player Y, and the button positioning, or else the button is always active
      if(player.y !== 400) {
        switchButtonY = height/10 * 4;
        player.y = 400;
        boardHeight = 400;
      }

      //Swapping the y and button position
      else {
        switchButtonY = height/10;
        player.y = 100;
        boardHeight = 100;
      }
    }
  }

  else {
    fill(255, 100, 50);
  }

  //Draw the button and text
  ellipse(width-300, switchButtonY, 90, 90);
  fill(0);

  textAlign(CENTER, CENTER);
  textSize(width/80);
  text("SWITCH\nBOARDS", width-300, switchButtonY);
}


//Makes a display after each dive in practice
function practiceDisplay() {

  let boxWidth = width/4;
  let boxHeight = height/6;
  let boxY = height/2 - boxHeight/2;
  let boxX = width/2 - boxWidth/2;
  //Making variables because the positions get reused a bit

  fill(156, 255, 255);
  strokeWeight(4);
  stroke(0);

  //Draw the box
  rect(boxX, boxY, boxWidth, boxHeight);
  line(boxX, boxY + boxHeight/2, boxX + boxWidth, boxY + boxHeight/2);

  strokeWeight(1);

  //Acess the last score for the dive
  textSize(width/54);
  let score = lastScores[0].toString();

  fill(0);
  textAlign(CENTER, CENTER);
  //Display the dive in english, and the score
  text(translateDive(diveDone), boxX + boxWidth/2, boxY + boxHeight/4);
  text("Average score: " + score, boxX + boxWidth/2, boxY + boxHeight/4 * 3);
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Displays the menu before competitions
function competitionMenu() {
  //music
  if(noMusic !== false) {
    menuMusic.loop();
    noMusic = false;
  }
  //background image
  image(menuPool, 0, 0, width, height);

  //COMPETITION 1, 1m regional
  if(collidePointCircle(mouseX, mouseY,width/3, height/4, width/6, width/6)) {
    fill(0, 200, 100);

    if(mouseIsPressed) {
      //Setting the compeittion mode and specific competition
      compMode = 1;
      gameState = 4;
      introTimer = millis();
      menuMusic.stop();
      //reset music variables
      noMusic = "";
      noSound = "";
    }
  }

  else {
    fill(0, 255, 0);
  }
  ellipse(width/3, height/4, width/6, width/6);

  //COMPETITION 2, 3m prov
  if(collidePointCircle(mouseX, mouseY, width/1.5, height/4, width/6, width/6)) {
    fill(0, 200, 100);

    if(mouseIsPressed) {
      //Setting the compeittion mode and specific competition
      compMode = 2;
      gameState = 4;
      introTimer = millis();
      //musics
      menuMusic.stop();
      noMusic = "";
      noSound = "";
    }
  }

  else {
    fill(0, 255, 0);
  }
  ellipse(width/1.5, height/4, width/6, width/6);

  //COMPETITION 3, 1m Nat
  if(collidePointCircle(mouseX, mouseY, width/3, height/4 * 3, width/6, width/6)) {
    fill(0, 200, 100);
    if(mouseIsPressed) {
      //Setting the compeittion mode and specific competition
      compMode = 3;
      gameState = 4;
      introTimer = millis();
      //music & sounds
      menuMusic.stop();
      noMusic = "";
      noSound = "";
    }
  }

  else {
    fill(0, 255, 0);
  }
  ellipse(width/3, height/4 * 3, width/6, width/6);

  //COMPETITION 4, 3m Nat
  if(collidePointCircle(mouseX, mouseY, width/1.5, height/4 * 3, width/6, width/6)) {
    fill(0, 200, 100);
    if(mouseIsPressed && !(millis() < initTimeCompButton + 1000)) {
      //Having a 1 second delay before the button is available because it appears where the last button was clciked
      //Setting the compeittion mode and specific competition
      compMode = 4;
      gameState = 4;
      introTimer = millis();
      //sounds
      menuMusic.stop();
      noMusic = "";
      noSound = "";
    }
  }

  else {
    fill(0, 255, 0);
  }
  ellipse(width/1.5, height/4 * 3, width/6, width/6);

  //All screen text
  textSize(width/40);
  fill(0);
  textAlign(CENTER, CENTER);
  //Button text
  text("1m Regionals", width/3, height/4);
  text("3m International", width/1.5, height/4 * 3);
  text("1m Nationals", width/3, height/4 * 3);
  text("3m Provincials", width/1.5, height/4);

  fill(255);
  //Base records or session records
  text("Record: " + compRecordOne + "pts", width/3, height/4 + 100);
  text("Record: " + compRecordFour + "pts", width/1.5, height/4 * 3 + 100);
  text("Record: " + compRecordThree + "pts", width/3, height/4 * 3 + 100);
  text("Record: " + compRecordTwo + "pts", width/1.5, height/4 + 100);

  fill(0);
  //Creator record
  text("Creator record: " + CREATOR_SCORE_ONE + "pts", width/3, height/4 + 150);
  text("Creator record: " + CREATOR_SCORE_FOUR + "pts", width/1.5, height/4 * 3 + 150);
  text("Creator record: " + CREATOR_SCORE_THREE + "pts", width/3, height/4 * 3 + 150);
  text("Creator record: " + CREATOR_SCORE_TWO + "pts", width/1.5, height/4 + 150);

  //The last score recorded
  fill(255, 255, 0);
  text("Last score: " + diverScore + "pts", width/2, height/2 + 50);

  //display the back button
  returnButton(1, 1, true);
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function competition() {
  //The competition layout for any compeittion

  if((compMode === 4 || compMode === 3) && player.go === false) {
    //Adding a little more tuck speed for the hard competitions
    player.tuckSpinSpeed = 1.8;
  }

  if(noMusic !== false) {
    //play music
    poolAmbiance.loop();
    noMusic = false;
  }

  //Setting the boardheight for the event the player is diving in
  if((compMode === 1 || compMode === 3) && temp !== false) {
    player.y = 400;
    boardHeight = 400;
    temp = false;
    diverScore = 0;
  }
  //temp is to do this if statements once
  else if ((compMode === 2 || compMode === 4) && temp !== false) {
    player.y = 100;
    boardHeight = 100;
    temp = false;
    diverScore = 0;
  }

  background(255); //white background

  //update player when going
  if (player.go) {
    updatePlayer();
  }

  //drawing pool, player, and buttons
  player.display();
  drawPool();
  displayButtons();
  returnButton(3, 3, false);


  if(millis() < introTimer + 3000 && !player.go || !player.go && mouseIsPressed && !finishedDive) {
    //Displays the dive for the player to do, for 3 seconds, or when the user clicks
    if(noSound !== false) {
      //Play a whistle sound
      whistle.play();
      noSound = false;
      //play the splash sound
      compSplash = true;
    }

    //Similar to the practice display but different use
    let boxWidth = width/4;
    let boxHeight = height/6;
    let boxY = height/2 - boxHeight/2;
    let boxX = width/2 - boxWidth/2;

    fill(156, 255, 255);
    strokeWeight(4);
    stroke(0);

    //making box
    rect(boxX, boxY, boxWidth, boxHeight);
    line(boxX, boxY + boxHeight/2, boxX + boxWidth, boxY + boxHeight/2);

    strokeWeight(1);
    fill(0);

    //putting dive to do and dive number
    text(translateDive(compDives[compMode-1][diveCounter]), boxX + boxWidth/2, boxY + boxHeight/4);
    text(compDives[compMode-1][diveCounter], boxX + boxWidth/2, boxY + boxHeight/4 * 3);
  }

  //Total score box
  fill(255);
  rect(0, height - height/8, width/6, height/8);
  fill(0);
  text("Total score " + diverScore, 0 + width/6/2, height-height/8/2);

  if(finishedDive) {
    //Everything to do after the dive is done
    if(millis() < initTime + 3000) {
      //show the judges scorecards
      displayScores();
      //If all scores are 0s, the dive is a fail dive, so tell the user
      if(lastScores[0] + lastScores[1] + lastScores[2] === 0) {
        fill(0);
        text("FAIL DIVE", width/2, height/2);
      }
      //user must watch
      goButton.available = false;
    }

    else {
      //Add to player's score
      diverScore += calculateScore();
      //move on to next dive
      diveCounter++;
      finishedDive = false;
      player.didFail = false;

      //reset timer to redisplay the dive box
      introTimer = millis();
    }
  }

  if(diveCounter === compDives[compMode-1].length) {
    //If the dive total is = to the number of dives in the list for the competition,end the competition
    //Set a new score if the player beat the standard
    if(compMode === 1 && diverScore > compRecordOne) {
      compRecordOne = diverScore;
    }
    else if(compMode === 2 && diverScore > compRecordTwo) {
      compRecordTwo = diverScore;
    }
    else if(compMode === 3 && diverScore > compRecordThree) {
      compRecordThree = diverScore;
    }
    else if(compMode === 4 && diverScore > compRecordFour) {
      compRecordFour = diverScore;
    }

    //reset all competition variables
    temp = "";
    poolAmbiance.stop();
    diveCounter = 0;
    gameState -= 1;
    //reset the player
    player.reset();
    lastScores = [];
    noMusic = "";
  }
}

//Judges scorecards
function displayScores() {
  rectMode(CENTER);

  for(let i = 0; i < lastScores.length; i++) {
    //display 1 rectangle for each score
    fill(0);
    //Display a rectangle at each fraction + 1 of the total number of scores. Ex 3 scores, card at 1/4, 2/4 3/4, none are out
    rect(width * (i+1) * (1/(lastScores.length+1)), height-200, 100, 100);

    fill(255);
    textAlign(CENTER, CENTER);
    //put the number in
    text(lastScores[i].toString(), width * (i+1) * (1/(lastScores.length+1)), height-200);
  }
  //reset rects
  rectMode(CORNER);
}

//calculates the score of a dive with dd
function calculateScore() {
  //Dives are always calculated with the 3 middle scores
  let threeScores;
  if(lastScores.length > 3) {
    //If there's 5, sort them, then cut the lowest and highest
    threeScores = sort(lastScores);
    threeScores.pop();
    threeScores.shift();
  }
  else {
    threeScores = lastScores;
  }

  let totalScore = threeScores[0] + threeScores[1] + threeScores[2];
  // add them, then multiply by the dd
  totalScore = totalScore * compDds[compMode-1][diveCounter];
  //Round, but doesn't work sometimes ?
  totalScore = Math.round(totalScore * 100) / 100;

  return totalScore;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function tutorial() {
  //Do the interactive tutorial
  background(255); //white background

  //display the player and pool
  player.display();
  fill(0);
  textSize(width/60);
  drawPool();

  //The tutorial is incremental, there is steps, and the user must hit the continue button to proceed
  if(tutorialState === 1) {
    //intro
    fill(0);
    text("Welcome to Dynamic Diving! Here is a quick tutorial for how the game works! Press 'm' to mute sounds", width/2, height/2);
    continueButton.display(0);
  }

  else if(tutorialState === 2) {
    //showing a dive
    fill(0);
    text("This is your diver.", player.x, player.y + 80);
    //make the player keep going
    player.go = true;

    //draw the pool and update the player
    drawPool();
    updatePlayer();

    //shifting the continue button
    continueButton.display(height/6);
  }

  else if(tutorialState === 3) {
    //explaining the direction buttons
    frontButton.available = false;
    //Don't make the buttons useable

    frontButton.display();
    drawPool();
    fill(0);
    text("This is a direction button → \n it will change the diver's direction", frontButton.x - width/5, frontButton.y);

    //shifting the continue button again
    continueButton.display(0);
  }

  else if(tutorialState === 4) {
    //Explaining fronts and showing a dive
    frontButton.available = false;
    frontButton.display();

    //update player movements
    player.direction = 1;
    player.go = true;
    player.layoutSpeed = 1;

    updatePlayer();
    drawPool();
    fill(0);
    text("This is the front button → \n the diver will face forwards \n and rotate forwards", frontButton.x - width/5, frontButton.y);

    continueButton.display(height/6);
  }

  else if(tutorialState === 5) {
    //showing and explaining back dives
    frontButton.available = false;
    backButton.available = false;

    frontButton.display();
    backButton.display();

    //update player movements
    player.direction = 2;
    player.go = true;
    player.layoutSpeed = 1;

    updatePlayer();
    drawPool();
    fill(0);
    text("This is the back button → \n the diver will face backwards \n and rotate backwards", backButton.x - width/5, backButton.y);

    continueButton.display(0);
  }

  else if(tutorialState === 6) {
    //Explaining and showing reverse dives
    frontButton.available = false;
    backButton.available = false;
    reverseButton.available = false;

    frontButton.display();
    backButton.display();
    reverseButton.display();

    //update player movements
    player.go = true;
    player.layoutSpeed = -1;
    player.direction = 3;

    updatePlayer();
    drawPool();
    fill(0);
    text("This is the reverse button → \n the diver will face forwards \n and rotate backwards", reverseButton.x - width/5, reverseButton.y);

    continueButton.display(height/6);
  }

  else if(tutorialState === 7) {
    //explaining and showing inward dives
    frontButton.available = false;
    backButton.available = false;
    reverseButton.available = false;
    inwardButton.available = false;

    frontButton.display();
    backButton.display();
    reverseButton.display();
    inwardButton.display();

    //update player movements
    player.direction = 4;
    player.go = true;
    player.layoutSpeed = -1;

    updatePlayer();
    drawPool();
    fill(0);
    text("This is the inward button → \n the diver will face backwards \n and rotate forwards", inwardButton.x - width/5, inwardButton.y);

    continueButton.display(0);
  }

  else if (tutorialState === 8) {
    //Explain the go button and let the user try it

    //similar to practice code but limited
    if(player.go) {
      updatePlayer();
      drawPool();
    }

    else {
      drawPool();
      frontButton.display();
      backButton.display();
      reverseButton.display();
      inwardButton.display();
      goButton.display();
    }


    fill(125);
    text("Choose a direction button\n then press the go button → \n to make the diver jump", goButton.x - width/5, goButton.y - 10);

    continueButton.display(height/6);
  }

  else if (tutorialState === 9) {
    //Explaining tucking and the button

    //Drawing and updating
    if(player.go) {
      updatePlayer();
    }

    drawPool();
    displayButtons();
    fill(0);
    text("After the diver jumps \n a tuck button will appear here → \n click or hold click on it for the\n diver to tuck in the air \n they will spin faster than when straight", tuckButton.x - width/5, tuckButton.y);

    continueButton.display(0);
  }

  else if(tutorialState === 10) {
    //All buttons are off, just explaining dives through text
    frontButton.available = false;
    backButton.available = false;
    reverseButton.available = false;
    inwardButton.available = false;
    goButton.available = false;

    drawPool();
    displayButtons();
    fill(0);
    text("Dives are expressed as the amount of half rotations done by the diver \n For example: when the diver does 1 half rotation, it is called a dive \n If the diver does a whole rotation, it is called a flip \n If the diver does 1 and a half rotations, it is called a one and a half \n and so on... \n Finally the name of the position is added last, and for the game, it will be tuck", width/2, height/2);

    continueButton.display(height/6);
  }

  else if (tutorialState === 11) {
    //Explaining compeititon in text, not interactive
    frontButton.available = false;
    backButton.available = false;
    reverseButton.available = false;
    inwardButton.available = false;
    goButton.available = false;

    drawPool();
    displayButtons();
    fill(0);
    text("In a competition, there will be a display that tells you what dive to do. \n If you miss it, click anywhere on the screen to see it. \n After you do the dive, you will get scores, dives are scored from 0-10. \n The more vertical the dive, the better score you will recieve. \n Tucking multiple times will reduce your score significantly! \n Finally if the wrong dive is performed, it will be considered a fail dive with scores of 0.", width/2, height/2);

    continueButton.display(-400);
  }

  else if (tutorialState === 12) {
    //Last screen before sent back to menu
    frontButton.available = false;
    backButton.available = false;
    reverseButton.available = false;
    inwardButton.available = false;
    goButton.available = false;

    drawPool();
    displayButtons();
    fill(0);
    text("You are now ready to dive! Good luck!", width/2, height/2);

    continueButton.display(0);
  }

  else {
    //Resets the player and variables
    player.reset();
    //Sending to main menu
    gameState = 1;

    finishedDive = false;
    //Alowing the player to do the tutorial again
    tutorialState = 1;
  }

  //Allowing the user to exit the tutorial
  returnButton(1, 1, true);

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Other funtions

//All of the player updating during/after dives not within a class, defines reset, sound and button parameters
function updatePlayer() {

  if (player.y < height - 100) {
    //make the player fall and rotate until in the water
    player.update();

    if (tuckButton.on) {
      //If the tuck button is pressed, make the player tuck
      player.position = "tuck";
    }

    else if (player.position !== "layout"){
      //Other than tuck or layout, make the position straight
      player.position = "straight";
    }
  }

  else {
    //Play the splash sound
    if((noSound !== false || compSplash) && gameState !== 5) {
      mediumSplash.play();
      noSound = false;
      compSplash = false;
    }

    //After the player is offscreen, reset all diving variables and objects
    if (player.swim()) {

      if(gameState === 2) {
        //In practice
        //The player can't fail
        player.didFail = false;

        //Get the dive number
        defineDive();

        //Get 1 score
        lastScores = score(1, player.didFail);

        //reset the rest
        player.reset();

        frontButton.selected = false;
        backButton.selected = false;
        reverseButton.selected = false;
        inwardButton.selected = false;
        tuckButton.available = false;

        finishedDive = true;
        initTime = millis();
        noSound = "";
      }

      else if (gameState === 4){
        //in Competition
        //get the dive number of the dive done
        defineDive();

        //If the dive done, isn't the dive the diver should've done, they failed
        if(diveDone !== compDives[compMode-1][diveCounter]) {
          player.didFail = true;
        }

        if(compMode === 1 || compMode === 2) {
          //In the small competitions, make 3 scores
          lastScores = score(3, player.didFail);
        }

        else {
          //In larger competitions, add 5 scores
          lastScores = score(5, player.didFail);
        }
        //reset the rest
        player.reset();

        frontButton.selected = false;
        backButton.selected = false;
        reverseButton.selected = false;
        inwardButton.selected = false;
        tuckButton.available = false;

        finishedDive = true;
        initTime = millis();
        noSound = "";
      }
      else {
        player.reset();
      }

    }
  }
}


//Translates dives from dive numbers to english, (practice & competition)
function translateDive(diveToDo) {

  let translatedDive = "";

  //Find the direction of the dive using the first number
  if(diveToDo.charAt(0) === "1") {
    translatedDive += "Front";
  }
  else if(diveToDo.charAt(0) === "2") {
    translatedDive += "Back";
  }
  else if(diveToDo.charAt(0) === "3") {
    translatedDive += "Reverse";
  }
  else if(diveToDo.charAt(0) === "4") {
    translatedDive += "Inward";
  }

  // add a space
  translatedDive += " ";
  let rotations;
  rotations = diveToDo.charAt(2);
  rotations = parseInt(rotations, 10);
  rotations = rotations/2;

  //Choose which rotational amount is performed accoring to the dive number
  if(rotations === 0.5) {
    translatedDive += "dive ";
  }
  else if (rotations === 1) {
    translatedDive += "flip ";
  }
  else if (rotations === 1.5) {
    translatedDive += "one and a half ";
  }
  else if (rotations === 2) {
    translatedDive += "double ";
  }
  else if (rotations === 2.5) {
    translatedDive += "two and a half ";
  }
  else if (rotations === 3) {
    translatedDive += "triple ";
  }
  else if (rotations === 3.5) {
    translatedDive += "three and a half ";
  }
  else if(rotations === 4) {
    translatedDive += "quad ";
  }
  else if (rotations === 4.5) {
    translatedDive += "four and a half ";
  }

  //Couldn't figure this out in time
  // else{
  //   translatedDive = "unknown dive ";
  // }

  //add a tuck
  translatedDive += "tuck";
  return translatedDive;
}

//Draws the water and pooldeck for all pool modes
function drawPool() {
  //Draws water
  strokeWeight(2);
  fill(0, 0, 100, 220);
  rect(0, height-100, width, 100);

  //Pool deck
  fill(242, 242, 210);
  rect(0, height-102, 50, 102);
  rect(width-50, height-102, 50, 102);
  stroke(242, 242, 210);
  rect(0, height-20, width, 20);
  stroke(0);

  //Lines of the pool deck
  line(0, height-102, 0, height);
  line(50, height-21, width-50, height-21);
  strokeWeight(1);
  stroke(0);
  fill(0, 255, 0);

  //Diving boards
  rect(0, 110 * 1.5 - 11, width/3 + 10 + 3, 10);
  rect(0, 110 * 4.2 - 11, width/3 + 10 + 3, 10);
}

//Displays the tuck, go, direction buttons, for pool modes
function displayButtons() {
  //If the player hasn't gone show the direction and go buttons
  if(!player.go) {
    goButton.display();
    frontButton.display();
    backButton.display();
    reverseButton.display();
    inwardButton.display();
  }

  else {
    //When the diver goes, show the tuck button
    tuckButton.display();
  }
}


//Does all dive scoring depending on the diver angle of entry
function score(judges, fail) {
  let score;

  //Figure out what dive the user tried to do
  let dive = round(player.angle/180) * 180;

  let allScores = [];
  for(let i = 0; i < judges; i++) {
    score = player.angle;
    score = abs(dive-score);
    //Don't know why it was negative at points, so just abs it

    score = score/random(80, 100);
    //Making a negligible amount of randomness to scoring so that not all scores are identical
    score = round(score*20)/2;
    // * 20 because in diving it's out of 10 with .5s, so just make it out of 20, then /2

    //If the user didn't fail, finish the score
    if(!fail) {
      score = abs(10-score);
      //If the user cannonballed or tucked more than once, take away points
      if(player.secondTuck || player.straightened === false) {
        if (score > 3.0) {
          score = score - 3;
        }
      }
      //Add that score to the list
      allScores.push(score);
    }

    else {
      //If they failed a dive, instant 0s
      score = 0;
      allScores.push(score);
    }
  }

  return allScores;
}


//The "backpage" button, changes gameState and resets Variables
function returnButton(state, offset, sameSong) {
  if(collidePointCircle(mouseX, mouseY, 100, 100 * offset, 150, 150)) {
    fill(0, 255, 255);

    if(mouseIsPressed) {
      //Resets any and all variables that will mess up when re-entering modes
      player.reset();
      gameState = state;

      finishedDive = false;
      temp = "";
      diveCounter = 0;
      diverScore = 0;
      initTime = millis();
      tutorialState = 1;

      player.y = 100;
      boardHeight = 100;

      poolAmbiance.stop();

      if(!sameSong) {
        //Avoiding playing 2 soundtracks at the same time on the same song pages
        noMusic = "";
      }
    }
  }

  else {
    fill(255, 100, 50);
  }

  //Drawing the button
  ellipse(100, 100 * offset, 150, 150);
  fill(0);
  text("Back \n to menu", 100, 100 * offset);
}


//Creates the dive number for dives depending on angles
function defineDive() {
  let diveNumber = "";

  //The direction is the first number
  diveNumber += player.direction;
  //The second is a 0
  diveNumber += "0";

  //Find out what dive the user tried or accidentially did
  let rotations = abs(round(player.angle/180));
  //Add the closes amount of 1/2 rotations
  diveNumber += rotations.toString();

  //Add a c for tuck
  diveNumber += "c";

  diveDone = diveNumber;
}

function keyPressed() {
  //The m key will mute the site
  if(key === "m" || key === "M") {
    mute = !mute;
  }
}

function deviceTurned() {
  //Trying to add muting that's mobile compatible
  mute = !mute;
}

function muting() {
  //Turn off al volume on mutes
  if(mute) {
    menuMusic.setVolume(0);
    poolAmbiance.setVolume(0);
    whistle.setVolume(0);
    mediumSplash.setVolume(0);
  }

  else {
    //turn on all volume
    menuMusic.setVolume(0.1);
    whistle.setVolume(0.2);

    //The splash is louder dependin on the height
    if(boardHeight === 400) {
      mediumSplash.setVolume(0.15);
    }
    else {
      mediumSplash.setVolume(0.20);
    }

    //Competition is quieter
    if(gameState === 4) {
      poolAmbiance.setVolume(0.01);
    }
    else {
      poolAmbiance.setVolume(0.06);
    }
  }
}

//THE END :)
