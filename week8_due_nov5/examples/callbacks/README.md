# Callbacks in p5.js

A **callback** is a function you give to someone else so *they* can call it later.

This tutorial is split into small sketches, one idea each. Open each folder's `index.html` with Live Server, read the comments in `sketch.js`, and try the "Try it" challenge at the bottom.

| Step | Sketch | Idea |
| --- | --- | --- |
| 1 | [step1_p5_calls_you](step1_p5_calls_you/sketch.js) | `draw()` and `mousePressed()` are callbacks |
| 2 | [step2_functions_are_values](step2_functions_are_values/sketch.js) | `drawCircle` vs `drawCircle()` |
| 3 | [step3_passing_functions](step3_passing_functions/sketch.js) | Passing a function into a function |
| 4 | [step4_event_callbacks](step4_event_callbacks/sketch.js) | "When the button is pressed, do this" |
| 5 | [step5_timer_callbacks](step5_timer_callbacks/sketch.js) | `setInterval` and `setTimeout` |
| 6 | [step6_array_callbacks](step6_array_callbacks/sketch.js) | `forEach` and `filter` |
| 7 | [step7_putting_it_together](step7_putting_it_together/sketch.js) | Everything in one sketch |

---

## Step 1: p5 calls you

You never write `draw()` yourself to make it run. p5 calls it about 60 times a second. You never call `mousePressed()` either. p5 calls it when the mouse goes down. You write the function, and p5 decides **when** it runs. That's a callback.

## Step 2: Functions are values

A function can be stored in a variable, the same way a number or a string can:

```js
let currentShape = drawCircle;   // store the function (no parentheses)
currentShape(200, 200, 100);     // run whatever is stored (parentheses)
```

`drawCircle` is **the function itself**.
`drawCircle()` **runs** the function right now.

That one pair of parentheses is the most important detail in this tutorial.

## Step 3: Passing a function into a function

```js
function drawRow(y, shapeFn) {
  for (let i = 0; i < 5; i++) {
    shapeFn(40 + i * 80, y, 50);
  }
}

drawRow(100, drawCircle);
drawRow(200, drawSquare);
```

`drawRow` handles the layout. The callback you pass in decides what gets drawn. This only works because every shape function takes the same inputs, `(x, y, size)`.

## Step 4: Event callbacks

```js
redButton.mousePressed(makeRed);                          // named function
blueButton.mousePressed(() => { bgColor = 'steelblue'; }); // arrow function
```

Read it as *"when this button is pressed, call this function."* An arrow function, `() => { ... }`, is a function with no name, written right where you need it.

## Step 5: Timer callbacks

```js
setInterval(changeColor, 1000);   // every second, forever
setTimeout(removeDot, 1000);      // once, one second from now
```

Timers don't pause the sketch. `draw()` keeps looping, and the timer calls your function when the time is up.

### The #1 callback bug

```js
setInterval(changeColor(), 1000);   // DON'T DO THIS
setInterval(changeColor, 1000);     // CORRECT: no parens
```

The wrong version **runs** `changeColor` once, right away, and hands its *result* (nothing) to `setInterval`. Nothing repeats, and you usually don't get an error. If a callback "only fires once" or "fires immediately," look for stray `()`.

## Step 6: Array callbacks

```js
bubbles.forEach(drawBubble);                      // call drawBubble on each bubble
bubbles = bubbles.filter((b) => b.y > -b.size);   // keep only bubbles still on screen
```

`forEach` and `filter` take a callback and call it once for each item in the array.

## Step 7: Putting it together

A grid of animated stamps that uses every idea above: an array of shape functions, a `drawGrid(cols, rows, stampFn)` that takes a callback, buttons, a palette shuffled by `setInterval`, click ripples with a `setTimeout` echo, and `forEach`/`filter` to manage the ripples.

Exercises to try
1. Write a new stamp function, add it to the `stamps` array, and give it a button.
2. In `drawGrid`, replace `stampFn(x, y, size)` with `random(stamps)(x, y, size)`. Why does it flicker? How could you fix it?
3. Write `repeat(n, fn)` that calls `fn(i)` `n` times, then use it:
   ```js
   repeat(10, (i) => circle(i * 40 + 20, height / 2, 30));
   ```

---

## Where you'll see this next

The ml5 handpose example in [../ml5js/simple_hand_recognition](../ml5js/simple_hand_recognition) uses the same pattern:

```js
handPose.detectStart(vid, gotHands);

function gotHands(results) {
  hands = results;
}
```

ml5 says: *"give me a function, and I'll call it every time I find hands."* You're passing `gotHands` the same way you passed `drawCircle` to `drawRow`.
