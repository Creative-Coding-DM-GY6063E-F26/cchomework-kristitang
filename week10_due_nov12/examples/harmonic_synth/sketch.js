/**
Harmonic Synth (p5.js 2.x + p5.sound 0.4.x)

The new p5.sound removed p5.Pulse (and its pulse width control).
Instead, this sketch uses a regular p5.Oscillator and lets mouseX
choose how many harmonics ("partials") make up the wave.
  'square1'  = just the fundamental (sounds like a sine)
  'square32' = 32 harmonics (bright, buzzy, close to a real square wave)
**/

let osc, fft;
let partials = 1;

function setup() {
  createCanvas(400, 400);

  osc = new p5.Oscillator(220, 'square1');
  osc.amp(0); // start silent

  // In the new p5.sound, FFT does NOT listen to everything automatically.
  // We have to tell it what to analyze. 256 = number of frequency bins.
  fft = new p5.FFT(256);
  fft.setInput(osc);
}

function mousePressed() {
  // Browsers block audio until the user interacts with the page.
  userStartAudio();
  if (!osc.started) {
    osc.start();
  }
  osc.amp(0.5, 0.02);
}

function mouseReleased() {
  osc.amp(0, 0.2);
}

function draw() {
  background(220);

  // map mouseX to a number of harmonics between 1 and 32
  let n = floor(map(mouseX, 0, width, 1, 33));
  n = constrain(n, 1, 32);
  // only rebuild the wave when the number actually changes
  if (n !== partials) {
    partials = n;
    osc.setType('square' + partials);
  }

  noStroke();
  fill(0);
  text('press and hold to play', 5, 20, width - 20);
  text('harmonics: ' + partials, 5, height - 20);

  // spectrum values are now 0.0 - 1.0 (not 0 - 255),
  // so we convert to decibels to make quiet harmonics visible
  let spectrum = fft.analyze();
  fill(255, 0, 255);
  for (let i = 0; i < spectrum.length; i++) {
    let x = map(i, 0, spectrum.length, 0, width);
    //we use log10 because the decibel scale is logarithmic, and we multiply by 20 to convert amplitude to decibels
    let db = 20 * Math.log10(spectrum[i]);
    let h = map(db, -100, 0, 0, height, true);
    rect(x, height, width / spectrum.length, -h);
  }

  let waveform = fft.waveform();
  noFill();
  stroke(20);
  beginShape();
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = map(waveform[i], -1, 1, 0, height);
    vertex(x, y);
  }
  endShape();
}
