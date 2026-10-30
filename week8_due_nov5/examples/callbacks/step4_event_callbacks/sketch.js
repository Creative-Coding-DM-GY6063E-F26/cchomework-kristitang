/**
 *
 * STEP 4: event callbacks.
 *
 * button.mousePressed(fn) means:
 *   "when THIS button is pressed, call fn."
 *
 * The button holds on to our function and calls it later,
 * whenever someone clicks.
 *
 */
let bgColor = 'white';

function setup() {
  createCanvas(400, 400);

  // Version A: pass a named function (no () after it!)
  let redButton = createButton('red');
  redButton.position(10, 10);
  redButton.mousePressed(makeRed);

  // Version B: an arrow function. () => { ... } is a function
  // with no name, written right where we need it.
  let blueButton = createButton('blue');
  blueButton.position(60, 10);
  blueButton.mousePressed(() => {
    bgColor = 'steelblue';
  });
}

function draw() {
  background(bgColor);
}

function makeRed() {
  bgColor = 'tomato';
}

// Try it: add a 'random' button that sets bgColor to
// random(['gold', 'orchid', 'mediumseagreen']).
