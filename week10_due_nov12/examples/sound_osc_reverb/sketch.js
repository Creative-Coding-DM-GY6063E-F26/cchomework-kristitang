/**
Oscillator + Reverb (p5.js 2.x + p5.sound 0.4.x)

Press and hold to play.
  mouseX = pitch
  mouseY = reverb amount (top = wet, bottom = dry)
**/

let osc, reverb, fft;

function setup() {
  createCanvas(400, 400);

  osc = new p5.Oscillator(220, 'sawtooth');
  osc.amp(0); // start silent

  // reverb with a 3 second decay
  reverb = new p5.Reverb(3);

  // Routing: oscillators go straight to the speakers by default.
  // Unplug it, then plug it into the reverb (the reverb goes to the speakers).
  // (p5.Reverb no longer has a .process() method -- use connect instead.)
  osc.disconnect();
  osc.connect(reverb);

  // analyze what comes out of the reverb
  fft = new p5.FFT(256);
  fft.setInput(reverb);
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

  let f = map(mouseX, 0, width, 110, 880, true);
  osc.freq(f, 0.05);

  // wet: 0 = no reverb, 1 = only reverb
  let wet = map(mouseY, height, 0, 0, 1, true);
  reverb.wet(wet);

  noStroke();
  fill(0);
  text('press and hold to play', 5, 20, width - 20);
  text('freq: ' + nf(f, 0, 1) + '   reverb: ' + nf(wet, 0, 2), 5, height - 20);

  // spectrum values are 0.0 - 1.0, convert to decibels to see more detail
  let spectrum = fft.analyze();
  fill(255, 0, 255);
  for (let i = 0; i < spectrum.length; i++) {
    let x = map(i, 0, spectrum.length, 0, width);
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
