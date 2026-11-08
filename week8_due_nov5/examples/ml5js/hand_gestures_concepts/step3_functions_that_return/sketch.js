/**
 *
 * STEP 3: functions that give you something back.
 *
 * Some functions DO something: circle() draws a circle.
 * Other functions ANSWER something: dist() works out a number and gives it
 * back to you. Giving something back is called "returning" it.
 *
 *   move the mouse - the circle grows as it gets further from the center
 *
 */

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);

  // dist() doesn't draw anything. It returns a number, and we keep that
  // number in a variable, the same way we'd keep any other value.
  let d = dist(width / 2, height / 2, mouseX, mouseY);

  // our own functions can return things too
  let size = halfOf(d);
  let label = closeOrFar(d);

  stroke(0);
  line(width / 2, height / 2, mouseX, mouseY);

  fill('tomato');
  circle(mouseX, mouseY, size);

  fill(0);
  noStroke();
  text('dist() returned ' + round(d), 10, 20);
  text('halfOf() returned ' + round(size), 10, 40);
  text('closeOrFar() returned ' + label, 10, 60);
}

// return sends a value back to the line that called this function.
// So in draw(), halfOf(d) gets replaced by the answer.
function halfOf(number) {
  return number / 2;
}

// A function can return words too. return also ends the function right away,
// so if d is under 100, the last line never runs.
function closeOrFar(d) {
  if (d < 100) {
    return 'close';
  }
  return 'far';
}

// Try it:
// 1. Delete the word return from halfOf(). What does the text say now?
//    What happened to the circle?
// 2. Write doubleOf(number) and use it to set the circle's size.
// 3. Add a 'medium' answer to closeOrFar().
