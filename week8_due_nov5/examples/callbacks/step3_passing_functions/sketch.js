/**
 *
 * STEP 3: passing a function into another function.
 *
 * drawRow() knows WHERE to draw things (a row across the canvas).
 * It does not know WHAT to draw. We tell it by passing in a function.
 *
 * Same drawRow(), different callbacks, different results.
 *
 */

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  noStroke();

  fill('tomato');
  drawRow(100, drawCircle);

  fill('steelblue');
  drawRow(200, drawSquare);

  fill('mediumseagreen');
  drawRow(300, drawFlower);
}

// shapeFn is a parameter that holds a FUNCTION.
// drawRow calls it 5 times, once for each spot in the row.
function drawRow(y, shapeFn) {
  for (let i = 0; i < 5; i++) {
    let x = 40 + i * 80;
    shapeFn(x, y, 50);
  }
}

// Every shape function takes the same inputs: (x, y, size).
// That's what lets drawRow use any of them.
function drawCircle(x, y, size) {
  circle(x, y, size);
}

function drawSquare(x, y, size) {
  rectMode(CENTER);
  square(x, y, size);
}

function drawFlower(x, y, size) {
  for (let a = 0; a < TWO_PI; a += TWO_PI / 6) {
    circle(x + cos(a) * size * 0.3, y + sin(a) * size * 0.3, size * 0.4);
  }
}

// Try it: write drawGrid(shapeFn) that fills the whole canvas
// with shapes instead of just one row.
