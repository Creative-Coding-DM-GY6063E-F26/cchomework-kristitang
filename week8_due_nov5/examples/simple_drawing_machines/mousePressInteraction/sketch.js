/**
 * 
 * A simple drawing machine that draws circles when the mouse is pressed.
 * 
 */

let colors = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(220);
  colors=[color('lightblue'),color('lightcoral')];
}



function draw() {
  noStroke(); 
  let i = map(mouseY,0,height,0,1);
  let c  =lerpColor(colors[0],colors[1],i);
  let radius = map(mouseY,0,height,100,5);
  if (mouseIsPressed) {
    fill(c);
    circle(mouseX, mouseY, radius);
  }
}

function keyPressed() {
  console.log(keyCode);
  if (keyCode === 32) { // Check if the spacebar is pressed； 32 is the spacebar
    background(220);
  }
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Exercises for you to try :
// 1. Use mouseX or mouseY to change the circle's size or color as you draw.
//    Hint: map(mouseX, 0, width, 5, 100)

