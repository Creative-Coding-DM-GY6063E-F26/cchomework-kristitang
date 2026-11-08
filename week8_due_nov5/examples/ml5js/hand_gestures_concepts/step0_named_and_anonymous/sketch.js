/**
 *
 * STEP 0: named and anonymous functions.
 *
 * A callback is a function you hand to something else, so it can run it for you.
 * forEach() needs a callback, and it runs that callback once for each item.
 *
 * All three rows draw the same circles from the same array. The only
 * difference is how we write the callback.
 *
 */
let xValues = [80, 160, 240, 320];

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  noStroke();

  // 1. NAMED: the function is written somewhere else, and we pass in its name.
  // There are no parentheses, because we're handing it over, not running it.
  fill('tomato');
  xValues.forEach(drawCircle);

  // 2. ANONYMOUS: a function with no name, written right where it's used.
  // Compare it to drawCircle below: the only thing missing is the name.
  fill('steelblue');
  xValues.forEach(function (x) {
    circle(x, 200, 60);
  });

  // 3. ARROW: also anonymous, just shorter to write. The word function is gone,
  // and there's an arrow after the parentheses. This is the one you'll see most.
  fill('mediumseagreen');
  xValues.forEach((x) => {
    circle(x, 300, 60);
  });
}

// forEach() puts each item from the array into x, one at a time
function drawCircle(x) {
  circle(x, 100, 60);
}

// Try it:
// 1. Write a named function called drawSquare(x), then pass it to forEach()
//    in place of drawCircle.
// 2. Add let diameter = 60; at the top of draw(), then replace each 60 with
//    diameter. The whole sketch stops! Which row caused it, and why?
//    Hint: check the console.
