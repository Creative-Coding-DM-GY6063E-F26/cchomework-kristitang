// Drag & drop basics
// 1. Drop ANY file on the canvas to see what p5 tells us about it
// 2. Drop an IMAGE to draw it on the canvas
// 3. Drop an AUDIO file to load it, then click to play it
// (These are the same steps the keyboard_interface sampler uses)

let fileInfo = 'nothing dropped yet'; // name / type / size of the last file
let loadStatus = 'drop a file onto the canvas';
let hovering = false; // true while a file is being dragged over the canvas

let img = null;   // the last dropped image; we use null as a placeholder to mean "no image yet"
let sound = null; // the last dropped sound

function setup() {
  let canvas = createCanvas(400, 400);
  // drop() calls our function once for every file dropped on the canvas.
  // This is a CALLBACK: we hand p5 a function, and p5 calls it later,
  // whenever a file arrives (like mousePressed or ml5's detectStart).
  canvas.drop(gotFile);

  // optional: light up the canvas while a file is dragged over it
  //uses boolean variables to track state of the drag event
  canvas.dragOver(() => hovering = true);
  canvas.dragLeave(() => hovering = false);

  textAlign(CENTER, CENTER);
}

// `async` lets us use `await` inside this function, the same way we wrote
// `async function setup()` in the week 8 ml5 sketches.
async function gotFile(file) {
  hovering = false;

  // a dropped file is a p5.File: look in the console to see everything inside it
  console.log(file);
  fileInfo = file.name + '\ntype: ' + file.type + '   size: ' + round(file.size / 1024) + ' KB');
  // file.file is the browser's original File object.
  // createObjectURL gives it a temporary URL, so we can load it
  // like any other image or sound, e.g. loadImage('cat.png')
  let url = URL.createObjectURL(file.file);
  loadStatus = 'loading...';

  if (file.type === 'image') {
    loadStatus = 'loading image...';
    // `await` pauses THIS function until the image finishes loading,
    // then gives us the result. It's the same idea as
    //   handPose = await ml5.handPose();
    // in week8 ml5js/simple_hand_recognition.
    // draw() keeps running while we wait, which is why we show 'loading...'.
    img = await loadImage(url);
    // the callback way would be: loadImage(url, gotImage);
    // and then a separate function gotImage(i) { img = i; }
    loadStatus = 'image loaded!';

  } else if (file.type === 'audio') {
    loadStatus = 'loading sound...';
    // same idea as above: wait here until the sound is ready.
    // compare with simple_load_trigger, which uses a callback instead:
    //   loadSound('test.mp3', gotSound);
    sound = await loadSound(url);
    loadStatus = 'sound loaded! click to play';

  } else {
    // not something we know how to use, so stop here
    loadStatus = 'not an image or audio file';
  }
}

function draw() {
  background(30);

  // draw the dropped image, scaled to fit the middle of the canvas
  if (img) {
    let s = min((width - 40) / img.width, 220 / img.height);
    imageMode(CENTER);
    image(img, width / 2, 210, img.width * s, img.height * s);
  }

  // highlight the border while a file is dragged over the canvas
  noFill();
  stroke(hovering ? color(80, 160, 255) : 80);
  strokeWeight(hovering ? 8 : 2);
  rect(0, 0, width, height);

  // what p5 told us about the file
  noStroke();
  fill(255);
  textSize(14);
  text(fileInfo, width / 2, 50);

  // what's happening now
  fill(180);
  textSize(16);
  text(loadStatus, width / 2, 360);
}

function mousePressed() {
  userStartAudio(); // browsers only allow audio after the user interacts with the page
  if (sound) sound.play();
}

// Next step: open keyboard_interface. It uses this same gotFile() pattern,
// but keeps several sounds in an array (the "bank") and uses `nextSlot`
// to decide which slot each new file goes into.
