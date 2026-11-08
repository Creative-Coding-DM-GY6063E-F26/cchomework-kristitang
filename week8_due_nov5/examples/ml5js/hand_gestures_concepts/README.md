# Concepts behind hand_gestures

The [hand_gestures](../hand_gestures/sketch.js) example uses a few ideas you may not have seen yet. This tutorial is split into small sketches, one idea each. None of them need a webcam, because the mouse stands in for your hand.

Open each folder's `index.html` with Live Server, read the comments in `sketch.js`, and try the "Try it" challenge at the bottom.

| Step | Sketch | Idea |
| --- | --- | --- |
| 0 | [step0_named_and_anonymous](step0_named_and_anonymous/sketch.js) | Writing a callback with a name or without one |
| 1 | [step1_the_erasing_problem](step1_the_erasing_problem/sketch.js) | Why `background()` erases your drawing |
| 2 | [step2_create_graphics](step2_create_graphics/sketch.js) | `createGraphics()` gives you a layer to draw on |
| 3 | [step3_functions_that_return](step3_functions_that_return/sketch.js) | Functions that give you an answer, like `dist()` |
| 4 | [step4_true_or_false](step4_true_or_false/sketch.js) | Functions that return `true` or `false` |
| 5 | [step5_foreach_and_return](step5_foreach_and_return/sketch.js) | Using `forEach` to answer a question about an array |

---

## Step 0: Named and anonymous functions

A **callback** is a function you hand to something else, so it can run it for you. There are two ways to write one.

A **named** function is written somewhere else, and you pass in its name:

```js
xValues.forEach(drawCircle);   // no parentheses: hand it over, don't run it

function drawCircle(x) {
  circle(x, 100, 60);
}
```

An **anonymous** function has no name. It's written right where it's used:

```js
xValues.forEach(function (x) {
  circle(x, 200, 60);
});
```

An **arrow function** is an anonymous function with a shorter way of writing it:

```js
xValues.forEach((x) => {
  circle(x, 300, 60);
});
```

All three do the same job. Here's how to choose:

| Use a named function when... | Use an anonymous function when... |
| --- | --- |
| You want to use it in more than one place | You only need it in this one place |
| It's long, and a name makes the code easier to read | It's short |
| | It needs a variable from the function around it |

That last one is the challenge in step 0. A variable made with `let` inside `draw()` only exists inside `draw()`. An anonymous function written inside `draw()` can use it. A named function written outside `draw()` can't, and you'll see an error like `diameter is not defined`.

## Step 1: The erasing problem

In `hand_gestures`, the video changes every frame, so `draw()` has to repaint the whole canvas every frame. That wipes out anything drawn earlier, including our line. Step 1 shows the same problem with a moving circle in place of the video.

You could remove `background()` so the line stays, but then the circle leaves a smear behind it. We need the moving thing to be erased and the line to stay.

## Step 2: createGraphics()

`createGraphics()` makes a second canvas that you can't see. Think of it as a sheet of clear plastic laid over the main canvas.

```js
drawing = createGraphics(width, height);   // make the layer, once, in setup()

drawing.line(pmouseX, pmouseY, mouseX, mouseY);   // draw on the layer
image(drawing, 0, 0);                             // show the layer
```

Three things to remember:

- `line()` draws on the main canvas. `drawing.line()` draws on the layer. Almost every drawing function works this way.
- Nothing on the layer shows up until you call `image()`.
- `background()` doesn't touch the layer, so your drawing stays until you call `drawing.clear()`.

## Step 3: Functions that return

Some functions **do** something. `circle()` draws a circle. Other functions **answer** something. `dist()` works out a number and gives it back to you:

```js
let d = dist(0, 0, 30, 40);   // d is now 50
```

You can write functions that answer too. The word `return` sends a value back to the line that called the function:

```js
function halfOf(number) {
  return number / 2;
}

let size = halfOf(100);   // size is now 50
```

`return` also ends the function right away, so nothing after it runs.

### The #1 return bug

```js
function halfOf(number) {
  number / 2;          // works out the answer, then throws it away
}
```

Without `return`, the function gives back `undefined`. You don't get an error. Step 3 shows `NaN` ("not a number") and the circle disappears. If a value is `undefined` or `NaN`, check for a missing `return`.

## Step 4: Functions that return true or false

ml5 gives us each point on a hand as an object with an `x` and a `y`. To measure between two points, we give `dist()` the `x` and `y` of each one:

```js
dist(thumb.x, thumb.y, finger.x, finger.y);
```

A function can also answer a yes or no question by returning `true` or `false`:

```js
function isPinching(a, b) {
  if (dist(a.x, a.y, b.x, b.y) < 50) {
    return true;
  }
  return false;
}
```

Then you can use it in an `if` statement:

```js
if (isPinching(thumb, finger)) {
  fill('tomato');
}
```

## Step 5: forEach and return

To find out if **all** of the dots are close, we check them one at a time, count how many pass, and compare that to the size of the array:

```js
function allDotsAreClose() {
  let closeCount = 0;

  dots.forEach((dot) => {
    if (dist(dot.x, dot.y, mouseX, mouseY) < reach) {
      closeCount++;
    }
  });

  if (closeCount === dots.length) {
    return true;
  }
  return false;
}
```

Notice where the `if` statement at the end is. The arrow function inside `forEach` is its own function, so a `return` in there only finishes that one dot. It doesn't return from `allDotsAreClose`. That's why we count inside of `forEach` and return after it.

---

## Back to hand_gestures

Open [hand_gestures/sketch.js](../hand_gestures/sketch.js) and look for each of these:

| Where | What to look for |
| --- | --- |
| `handPose.detectStart(vid, gotHands)` | A named callback, like step 0. `gotHands` is long enough to deserve a name |
| `fingers.forEach((finger) => { ... })` | An anonymous callback, like step 0. It needs `hand` and `curledCount` from `fingersAreCurled()` |
| `setup()` | `createGraphics()` makes the `drawing` layer, like step 2 |
| `drawLine()` | `drawing.line()` draws on the layer, like step 2 |
| `draw()` | `image(vid, ...)` paints over everything, then `image(drawing, 0, 0)` lays the line on top |
| `getGesture()` | Returns a word, like `closeOrFar()` in step 3. `draw()` keeps it in the `gesture` variable |
| `fingersAreCurled()` | Counts with `forEach`, then returns true or false, like `allDotsAreClose()` in step 5 |
| `if (fingersAreCurled(hand))` | Uses the true or false answer in an `if` statement, like `isPinching()` in step 4 |

In step 5 we measured dots against the mouse. In `fingersAreCurled()`, we measure fingertips against the wrist.
