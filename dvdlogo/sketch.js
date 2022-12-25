// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let dvd;
let x, y
let dx, dy;

function preload() {
  dvd = loadImage("assets/dvdlogo.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  x = width/2 - dvd.width/2;
  y = height/2 - dvd.height/2;
  dx = random(3, 8);
  dy = random(3, 8);
}

function draw() {
  moveDVD();
  displayDVD();


}

function moveDVD() {
  if (x >= windowWidth - dvd.width || x <= 0){
    dx = dx * -1;
    tint(random(255), random(255), random(255));
  }
  if (y >= windowHeight - dvd.height+30 || y <= -50){
    dy = dy * -1;
    tint(random(255), random(255), random(255));
  }
  //if (mouseX >= x && mouseX <= x + dvd.width && mouseY >= y && mouseY <= y + dvd.height){
    //dy = dy * -1;
    //}
  x += dx;
  y += dy;
}

function displayDVD() {
  background(0);
  image(dvd, x, y);
}
