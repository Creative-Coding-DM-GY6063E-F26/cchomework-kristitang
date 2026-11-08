/**
 *
 * STEP 4: functions that return true or false.
 *
 * ml5 gives us each point on a hand as an object, like { x: 200, y: 150 }.
 * To measure between two points, we give dist() the x and y of each one.
 * Then we write a function that answers a yes or no question:
 * are these two points close enough to be a pinch?
 *
 *   move the mouse - bring the "thumb" to the "finger" to pinch
 *
 */
let finger = { x: 200, y: 200 };

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);

  let thumb = { x: mouseX, y: mouseY };
  let d = dist(thumb.x, thumb.y, finger.x, finger.y);

  noStroke();

  // an if statement can use a returned true or false directly
  if (isPinching(thumb, finger)) {
    fill('tomato');
  } else {
    fill('steelblue');
  }
  circle(finger.x, finger.y, 30);
  circle(thumb.x, thumb.y, 30);

  fill(0);
  text('distance: ' + round(d), 10, 20);
}

// a function can return true or false too. a and b can be any two objects
// that have an x and a y.
function isPinching(a, b) {
  if (dist(a.x, a.y, b.x, b.y) < 50) {
    return true;
  }
  return false;
}

// Try it:
// 1. Add a second finger point and change color when the thumb touches it.
// 2. Write isFar(a, b) that returns true when the points are more than 200
//    pixels apart, and use it to change the background color.
