/**
 *
 * STEP 2: functions are values.
 *
 * A function can be stored in a variable, just like a number or a string.
 *
 *   drawCircle    -> the function itself (a value you can store or pass)
 *   drawCircle()  -> RUN the function right now
 *
 *   1 - draw circles
 *   2 - draw squares
 *
 */

// No () here! We are storing the function, not running it.
let currentShape = drawCircle;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  fill('tomato');
  noStroke();

  // Now we DO use (), because now we want to run whatever is stored.
  currentShape(width / 2, height / 2, 200);
}

function drawCircle(x, y, size) {
  circle(x, y, size);
}

function drawSquare(x, y, size) {
  rectMode(CENTER);
  square(x, y, size);
}

function drawTriangle(x,y,size){
  // triangle(x,y-size/2,
  //   x-size/2,y+size/2,
  //   x+size/2,y+size/2
  // );
  beginShape();
  for(let i =0; i<3; i++){
    let angle = TWO_PI/3*i - HALF_PI;
    let x1 = x + cos(angle)*size/2;
    let y1 = y + sin(angle)*size/2;
    vertex(x1,y1);
  }
  endShape();

}

function keyPressed() {
  if (key === '1') {
    currentShape = drawCircle; // swap which function is stored
  }
  if (key === '2') {
    currentShape = drawSquare;
  }
  if(key==='3'){
    currentShape = drawTriangle;
  }
}

// Try it: add a drawTriangle(x, y, size) function and switch to it with '3'.
