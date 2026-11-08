/**
 *
 * STEP 2: createGraphics() solves the erasing problem.
 *
 * createGraphics() makes a second canvas that you can't see. Think of it as
 * a sheet of clear plastic: we draw the line on the plastic, then lay it over
 * the main canvas every frame. background() only wipes the main canvas, so
 * whatever is on the plastic stays there.
 *
 *   drag the mouse - draw a line that stays
 *   spacebar - clear the drawing
 *
 */
let circleX = 0;
let drawing; // holds our sheet of clear plastic

function setup() {
  createCanvas(400, 400);

  // same size as the main canvas, so the two line up
  drawing = createGraphics(width, height);

  // a graphics has its own settings. These don't change the main canvas,
  // and we only need to set them once.
  drawing.stroke('tomato');
  drawing.strokeWeight(8);
}

function draw() {
  background(220);

  noStroke();
  fill('steelblue');
  circle(circleX, height / 2, 100);
  circleX = (circleX + 2) % width;

  if (mouseIsPressed) {
    // line() draws on the main canvas. drawing.line() draws on our layer.
    drawing.line(pmouseX, pmouseY, mouseX, mouseY);
  }

  // A graphics is invisible until we put it on the canvas.
  // image() works here the same way it does for a photo or video.
  image(drawing, 0, 0);
}

function keyPressed() {
  if (keyCode === 32) { // Check if the spacebar is pressed
    drawing.clear(); // makes the layer clear again
  }
}

// Try it:
// 1. Comment out image(drawing, 0, 0). Is the line still being drawn?
// 2. Move image(drawing, 0, 0) above the circle. What changes, and why?
// 3. Add drawing.background(255) to setup(). Why can't you see the circle now?
