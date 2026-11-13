/**
Sound Sequencer (p5.js 2.x + p5.sound 0.4.x)

Click the canvas to start/stop the sequence.
Press 1, 2, 3 to change the pitch of the sample.
**/

let sample;
let seq;
let isLoaded = false;
let isRunning = false;
let tempo = 180;
let viz;
let tempoSlider;

let initialSampleSpeed = 1;
//converting speeds to notes
let frequencies = [
  initialSampleSpeed,
  initialSampleSpeed * 9/8,
  initialSampleSpeed * 5/4,
  initialSampleSpeed * 4/3,
  initialSampleSpeed * 3/2,
  initialSampleSpeed * 5/3,
  initialSampleSpeed * 15/8,
  initialSampleSpeed * 2
];

// p5 2.0 has no preload(). Instead, make setup() async
// and "await" the sound. draw() won't start until setup() finishes.
async function setup() {
  createCanvas(400, 400);
  //you can use any sample you like, but this one is a short oboe staccato note
  sample = await loadSound('373635__sgossner__oboe-staccato-e4-oboe_stacc_f3_v3_rr2_main.wav');
  isLoaded = true;

  //instantiate 1 Viz object
  viz = new Viz(width/2, height/2);
  // min of 20: a tempo of 0 would make setInterval fire nonstop
  tempoSlider = createSlider(20, 200, tempo, 1);
  tempoSlider.position(25, 25);
  textAlign(CENTER);
}

function draw() {
  background(220);

  // did the slider move? update the tempo, and restart the beat if it's playing
  if (tempoSlider.value() !== tempo) {
    tempo = tempoSlider.value();
    if (isRunning) {
      clearInterval(seq);
      startSequence();
    }
  }

  text(tempo, width/2, height/2);
  viz.display();
}

// click to start / stop the sequence
function mousePressed() {
  // ignore clicks up where the tempo slider is, so dragging it doesn't toggle the sequence
  if (mouseY < 60) {
    return;
  }

  // Browsers block audio until the user interacts with the page.
  userStartAudio();

  //if we're not already running
  if (!isRunning) {
    startSequence();
  }
  else {
    clearInterval(seq);
  }
  //toggle isRunning boolean
  isRunning = !isRunning;
}

// play the sample over and over, once per beat at the current tempo
function startSequence() {
  seq = setInterval(function () {
    sample.play();
    viz.regen();
  }, 60000 / tempo); //millis per min / tempo
}

class Viz {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.lifespan = 255;
  }
  display() {
    push();
    noStroke();
    let fillCol = color(255, 0, 0);
    fillCol.setAlpha(this.lifespan);
    fill(fillCol);
    circle(this.x, this.y, 45);
    this.lifespan -= 10;
    pop();
  }
  regen() {
    this.lifespan = 255;
  }
}

function keyPressed() {
  // rate() now changes the speed of the *next* play() call
  if (key === '1') {
    sample.rate(frequencies[0]);
  }
  else if (key === '2') {
    sample.rate(frequencies[1]);
  }
  else if (key === '3') {
    sample.rate(frequencies[2]);
  }
}
