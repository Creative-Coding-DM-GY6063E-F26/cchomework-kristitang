/**
 *
 * STEP 5: using forEach() to answer a question about a whole array.
 *
 * In hand_gestures we need to know if ALL four fingers are curled.
 * Here we ask the same kind of question: are ALL of the dots close to the mouse?
 * forEach() checks them one at a time, and we count how many pass.
 *
 *   move the mouse - each dot turns red when the mouse is close to it
 *
 */
let dots = [
  { x: 100, y: 100 },
  { x: 300, y: 100 },
  { x: 100, y: 300 },
  { x: 300, y: 300 },
];
let reach = 170; // how close counts as close, in pixels

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);

  noStroke();
  dots.forEach((dot) => {
    if (dist(dot.x, dot.y, mouseX, mouseY) < reach) {
      fill('tomato');
    } else {
      fill('steelblue');
    }
    circle(dot.x, dot.y, 40);
  });

  fill(0);
  if (allDotsAreClose()) {
    text('all of the dots are close!', 10, 20);
  } else {
    text('not all of the dots are close', 10, 20);
  }
}

function allDotsAreClose() {
  let closeCount = 0;

  dots.forEach((dot) => {
    if (dist(dot.x, dot.y, mouseX, mouseY) < reach) {
      closeCount++;
    }
  });

  // this check is outside of forEach(), so it runs after every dot is checked.
  // A return inside of forEach() would only finish that one dot.
  if (closeCount === dots.length) {
    return true;
  }
  return false;
}

// Try it:
// 1. Change allDotsAreClose() so it's true when at least 2 dots are close.
// 2. Write countCloseDots() that returns the number instead of true or
//    false, and show it on the canvas.
