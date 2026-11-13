/**
Code from Simple Melody App tutorial on 
p5js.org
https://p5js.org/tutorials/simple-melody-app/

Updated for p5.js 2.x + p5.sound 0.4.x
**/

// Variable for frequency (middle C).
let myFreq = 262;

// Array of frequencies in C Major.
let frequencies = [
  myFreq,
  myFreq * 9/8,
  myFreq * 5/4,
  myFreq * 4/3,
  myFreq * 3/2,
  myFreq * 5/3,
  myFreq * 15/8,
  myFreq * 2
];

// Melody Object for C Major
let melody = {
  name: 'C Major Scale',
 notesIndex: [0, 4],
 tempo: 140
};

// Empty array for oscillator objects.
let oscillators = [];

// Calculate duration of each note in seconds.
let noteDuration = 60 / melody.tempo;

function setup() {
  createCanvas(400, 400);

  // Initialize oscillators and place in oscillators array.
  for (let freq of frequencies) {
    let osc = new p5.Oscillator(freq);
    osc.amp(0); // start silent so the fade-in works
    oscillators.push(osc);
  }

  //set color mode to HSB (better for using notes to color keys)
  colorMode(HSB);
}

function draw() {
  background(220);
  drawMelody();  
}

// Starts playing the note.
function playNote(n) {
  // Starts oscillator if needed.
  if (oscillators[n].started === false) {
    oscillators[n].start();

    // Starts playing the note by increasing the volume with a 0.01 sec fade-in.
    oscillators[n].amp(0.5, 0.01);
  }

  // Stops playing the note after number of seconds stored in noteDuration * 1000
  setTimeout(stopNote, noteDuration * 1000, n); 
}

// Stops playing the note.
function stopNote(n) {
  // Lower oscillator volume to 0 with a 0.05 sec fade-out.
  oscillators[n].amp(0, 0.05);

  // Stop the oscillator once the fade-out is done
  // (stopping right away cuts off the fade and makes a click).
  setTimeout(() => oscillators[n].stop(), 60);
}

// Plays the notes in a melody.
function play() {
  // Read each [index, note] in melody.notesIndex
  for (let [index, note] of melody.notesIndex.entries()) {
    // Play each note at scheduled time
    setTimeout(playNote, noteDuration * 1000 * index, note);
  }
}

// click a pad to play its note, or click anywhere else to play the melody
function mousePressed() {
  // Browsers block audio until the user interacts with the page.
  userStartAudio();

  let keyWidth = width / frequencies.length;
  let keyTop = keyWidth * 3;
  let keyBottom = keyTop + keyWidth * 2;

  // was the click inside the row of pads?
  if (mouseY > keyTop && mouseY < keyBottom && mouseX > 0 && mouseX < width) {
    let n = floor(mouseX / keyWidth); // which pad, 0 to 7
    playNote(n);
  } else {
    play(); // clicking anywhere else plays the whole melody
  }
}

// User Interface
function drawMelody() {
  // width of each key
  
  let keyWidth = width/frequencies.length;

  // Loop for the number of notes available
  for (let i = 0; i < frequencies.length; i ++) {
    //set x for each element
    let x = i * keyWidth;
    let y = keyWidth*3; // y 3x width
    
    // Draw a rounded key.
    rect(x, y, keyWidth, keyWidth*2, 10);
  }
}

//to try: 
// 1. change the melody to a different scale or song
// 2. change the tempo
// 3. change the instrument (oscillator type)
// use the pads as input and "record" a melody to play back (hint: use an array to store the notes and their timing, then play them back with setTimeout)