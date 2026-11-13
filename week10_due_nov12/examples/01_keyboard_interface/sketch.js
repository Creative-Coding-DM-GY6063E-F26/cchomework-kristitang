// Keyboard sampler
// 1. Drag & drop audio files onto the canvas to fill a 4-slot sample bank
// 2. Press A S D F to play the sample in each slot
// 3. UP / DOWN arrows change the playback speed (and pitch)
//    LEFT arrow plays samples backwards, RIGHT arrow plays them forwards

const BANK_KEYS = ['a', 's', 'd', 'f'];
let bank = [null, null, null, null]; // the loaded sounds
let names = ['', '', '', ''];        // file names, for display
let nextSlot = 0;                    // which slot the next dropped file goes into

let speed = 1;      // playback rate: 1 = normal, 2 = double speed / octave up
let direction = 1;  // 1 = forwards, -1 = backwards

let flash = [0, 0, 0, 0]; // brightness of each pad, so pads light up when played

function setup() {
  let canvas = createCanvas(400, 400);
  // drop() calls our function once for every file dropped on the canvas
  canvas.drop(gotFile);
  textAlign(CENTER, CENTER);
}

async function gotFile(file) {
  if (file.type !== 'audio') {
    console.log('not an audio file:', file.name);
    return;
  }

  // claim a slot right away, so several files dropped at once each get their own
  let slot = nextSlot;
  nextSlot = (nextSlot + 1) % bank.length;
  names[slot] = 'loading...';

  // make a temporary URL for the dropped file and load it like any other sound
  let url = URL.createObjectURL(file.file);
  let sound = await loadSound(url);
  sound.playMode('restart'); // re-pressing a key restarts the sample

  // match the current speed and direction
  sound.rate(speed);
  sound.node.reverse = direction < 0;

  if (bank[slot]) bank[slot].stop();
  bank[slot] = sound;
  names[slot] = file.name;
}

function draw() {
  background(30);

  // draw the four pads
  let padW = width / bank.length;
  for (let i = 0; i < bank.length; i++) {
    let x = i * padW;
    let filled = bank[i] !== null;

    fill(filled ? color(60 + flash[i], 120 + flash[i] * 0.5, 200) : 60);
    stroke(30);
    strokeWeight(4);
    rect(x + 4, 120, padW - 8, 160, 8);

    noStroke();
    fill(255);
    textSize(32);
    text(BANK_KEYS[i].toUpperCase(), x + padW / 2, 180);
    textSize(10);
    let label = names[i] || 'empty';
    if (filled && label.length > 14) {
      label = label.slice(0, 12) + '…'; // shorten long file names to fit in the pad
    }
    text(label, x + padW / 2, 240);

    flash[i] = max(0, flash[i] - 8); // fade the flash
  }

  // status text
  fill(255);
  textSize(16);
  text('drop audio files onto the canvas', width / 2, 40);
  text(`speed: ${speed.toFixed(2)}x   direction: ${direction > 0 ? 'forward ▶' : '◀ reverse'}`, width / 2, 330);
  textSize(12);
  fill(180);
  text('A S D F: play   ↑ ↓: speed   ← →: direction', width / 2, 370);
}

function keyPressed() {
  userStartAudio(); // browsers only allow audio after the user interacts with the page

  // A S D F -> play a sample from the bank
  let slot = -1; // -1 means "not a sample key"
  if (key === 'a' || key === 'A') {
    slot = 0;
  } else if (key === 's' || key === 'S') {
    slot = 1;
  } else if (key === 'd' || key === 'D') {
    slot = 2;
  } else if (key === 'f' || key === 'F') {
    slot = 3;
  }

  if (slot !== -1) {
    if (bank[slot]) {
      bank[slot].play();
      flash[slot] = 120;
    }
    return;
  }

  // arrows -> speed and direction
  if (keyIsDown(UP_ARROW)) {
    speed = min(speed + 0.1, 3);
  } else if (keyIsDown(DOWN_ARROW)) {
    speed = max(speed - 0.1, 0.1);
  } else if (keyIsDown(LEFT_ARROW)) {
    direction = -1;
  } else if (keyIsDown(RIGHT_ARROW)) {
    direction = 1;
  } else {
    return;
  }

  // apply the new settings to every sound in the bank
  for (let sound of bank) {
    if (!sound) continue;
    sound.rate(speed);

    // p5.sound doesn't have a reverse() method, but the Tone.js player
    // underneath it (sound.node) does: setting .reverse flips the audio data
    sound.node.reverse = direction < 0;
    console.log('reversing sound', direction < 0);//using a condition to return a boolean value to the console
  }

  return false; // stop the arrow keys from scrolling the page
}

