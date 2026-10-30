/**
 *
 * STEP 7: putting it all together.
 *
 * This sketch is a grid of "stamps". The grid doesn't know how to draw a
 * stamp. Instead we pass it a function (a callback) that does the drawing.
 * Swap the callback and the whole grid changes.
 *
 * Every idea from steps 1-6 shows up here. The STEP comments point
 * back to the sketch where each idea was introduced.
 *
 *   buttons / 1 2 3  - choose which stamp function the grid uses
 *   click            - drop a ripple (plus a delayed echo)
 *
 */
let palette = ['tomato', 'gold', 'mediumseagreen', 'steelblue', 'orchid'];
let ripples = [];

// STEP 2: functions are values. We can store them in variables and arrays
// just like numbers or strings. Note: no () after the names! We are storing
// the functions themselves, not running them.
let stamps = [drawCircle, drawSquare, drawFlower];
let currentStamp = drawCircle;

// STEP 1: you've been writing callbacks since week 1.
// setup(), draw(), mousePressed()... you never call these yourself.
// p5 calls them for you at the right moment. That's a callback.
function setup() {
  createCanvas(windowWidth, windowHeight);

  // STEP 4: event callbacks. "When this button is pressed, call this function."
  // An arrow function () => { ... } is a quick way to write a small
  // function right where you need it, without giving it a name.
  createButton('circles').position(10, 10).mousePressed(() => currentStamp = drawCircle);
  createButton('squares').position(80, 10).mousePressed(() => currentStamp = drawSquare);
  createButton('flowers').position(155, 10).mousePressed(() => currentStamp = drawFlower);

  // STEP 5: timer callbacks. "Every 2000ms, call shufflePalette."
  setInterval(shufflePalette, 2000);
}

function draw() {
  background(20);

  // STEP 3: pass our chosen stamp function INTO drawGrid.
  drawGrid(8, 6, currentStamp);

  // STEP 6: array callbacks. forEach calls drawRipple once per ripple,
  // filter calls the arrow function to decide which ripples to keep.
  ripples.forEach(drawRipple);
  ripples = ripples.filter((r) => r.alpha > 0);
}

// STEP 3: a function that takes another function as a parameter.
// drawGrid handles the layout; stampFn handles the look.
function drawGrid(cols, rows, stampFn) {
  let cellW = width / cols;
  let cellH = height / rows;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * cellW + cellW / 2;
      let y = j * cellH + cellH / 2;
      let size = min(cellW, cellH) * map(sin(frameCount * 0.05 + i + j), -1, 1, 0.3, 0.7);

      noStroke();
      fill(palette[(i + j) % palette.length]);
      stampFn(x, y, size); // call whatever function we were given
    }
  }
}

// --- stamp functions: same parameters, different drawings ---
function drawCircle(x, y, size) {
  circle(x, y, size);
}

function drawSquare(x, y, size) {
  rectMode(CENTER);
  square(x, y, size);
}

function drawFlower(x, y, size) {
  push();
  translate(x, y);
  for (let a = 0; a < TWO_PI; a += TWO_PI / 6) {
    ellipse(cos(a) * size * 0.3, sin(a) * size * 0.3, size * 0.4);
  }
  pop();
}

function drawRipple(r) {
  noFill();
  stroke(255, r.alpha);
  strokeWeight(3);
  circle(r.x, r.y, r.d);
  r.d += 6;
  r.alpha -= 4;
}

function shufflePalette() {
  palette = shuffle(palette);
}

function mousePressed() {
  let x = mouseX;
  let y = mouseY;
  ripples.push({ x: x, y: y, d: 0, alpha: 255 });

  // STEP 5 again: setTimeout calls the function ONCE, after a delay.
  // mousePressed() finishes right away; the echo happens 400ms later.
  setTimeout(() => {
    ripples.push({ x: x, y: y, d: 0, alpha: 150 });
  }, 400);
}

function keyPressed() {
  // pick a stamp from the array: '1' -> stamps[0], '2' -> stamps[1] ...
  let index = int(key) - 1;
  if (index >= 0 && index < stamps.length) {
    currentStamp = stamps[index];
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
