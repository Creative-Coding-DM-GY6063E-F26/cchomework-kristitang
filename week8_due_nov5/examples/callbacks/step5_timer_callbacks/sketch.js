/**
 *
 * STEP 5: timer callbacks.
 *
 *   setInterval(fn, ms) - call fn every ms milliseconds, forever
 *   setTimeout(fn, ms)  - call fn ONCE, after ms milliseconds
 *
 * Timers don't pause your sketch. draw() keeps looping,
 * and the timer calls your function when the time is up.
 *
 *   click - place a dot that disappears after 1 second
 *
 */
let colors = ['tomato', 'gold', 'mediumseagreen', 'steelblue'];
let bgColor = 'tomato';
let dot = null; // null means "no dot right now"

function setup() {
  createCanvas(400, 400);

  // every 1000ms (1 second), call changeColor
  setInterval(changeColor, 1000);

  // THE #1 CALLBACK BUG: try changing the line above to
  //   setInterval(changeColor(), 1000);
  // The () RUNS changeColor once, right now, and hands its result
  // (nothing) to setInterval. So nothing repeats!
}

function draw() {
  background(bgColor);

  if (dot !== null) {
    fill(255);
    noStroke();
    circle(dot.x, dot.y, 50);
  }
}

function changeColor() {
  bgColor = random(colors);
}

function mousePressed() {
  dot = { x: mouseX, y: mouseY };

  // mousePressed() finishes right away.
  // 1 second later, the arrow function runs and removes the dot.
  setTimeout(() => {
    dot = null;
  }, 1000);
}

// Try it: change setInterval to setTimeout. How is it different?
