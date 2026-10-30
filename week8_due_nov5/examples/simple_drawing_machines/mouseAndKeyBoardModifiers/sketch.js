/**
 *
 * A simple drawing machine that draws circles when the mouse is pressed.
 * Keyboard modifiers change how the circles are drawn:
 *   j - cycle through circle diameters
 *   k - cycle through circle colors
 *   l - toggle noise-based positioning (circles wobble around the mouse)
 *   spacebar - clear the canvas
 *
 */
let sizes = [0.02, 0.0625, 0.12]; // diameters as a fraction of canvas width
let sizeIndex = 1;

let colors = ['peachpuff', 'tomato', 'mediumseagreen', 'steelblue'];
let colorIndex = 0;

let useNoise = false;
let noiseAmount = 1000; // max distance (in pixels) noise can push a circle
let noiseTime = 0;

let strokeOn = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(220);
}

function draw() {
  noStroke();
  fill(colors[colorIndex]);

  if (mouseIsPressed) {
    let x = mouseX;
    let y = mouseY;

    if (useNoise) {
      // noise() returns 0-1, so map it to -noiseAmount..noiseAmount
      x += map(noise(noiseTime), 0, 1, -noiseAmount, noiseAmount);
      y += map(noise(noiseTime + 1000), 0, 1, -noiseAmount, noiseAmount);
      noiseTime += 0.05;
    }
  if (strokeOn) {
    // Use modulo (%) to prevent out-of-bounds errors when adding +1
    let c = colors[(colorIndex+1) % colors.length]; 
    stroke(red(c), green(c), blue(c), 100); //red() and green()... is to get the R/G/B value of c
    strokeWeight(2); 
  } else {
    noStroke();
  }

    circle(x, y, width * sizes[sizeIndex]);
  }
}

function keyPressed() {
  if (keyCode === 32) { // Check if the spacebar is pressed
    background(220);
  }

  if (key === 'j') {
    sizeIndex = (sizeIndex + 1) % sizes.length; // wrap back to 0 at the end
  }

  if (key === 'k') {
    colorIndex = (colorIndex + 1) % colors.length;
  }

  if (key === 'l') {
    useNoise = !useNoise;
  }
  if (key === 'h'){
    strokeOn = !strokeOn;

  }
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Exercises for you to try :
// 1. Add a new key that changes something else about the brush, like
//    switching between circles and squares, or turning stroke on/off.
// 2. Use the arrow keys to make the brush bigger or smaller one step at a
//    time instead of cycling. Hint: keyCode === UP_ARROW
// 3. Press 's' to save your drawing as an image with saveCanvas().
