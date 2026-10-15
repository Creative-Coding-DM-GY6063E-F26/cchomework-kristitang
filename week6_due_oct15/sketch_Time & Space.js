//Time & Space Clock

let stars = []; //the scattered stars in the universe

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES);
  
  // Scatter universe over a massive relative area
  for (let i = 0; i < 800; i++) {
    stars.push({
      x: random(-2500, 2500),
      y: random(-2500, 2500),
      z: random(-2500, 2500)
    });
  }
  
}

function draw() {
  background(8, 8, 12);
  orbitControl(); 
  rotateX(-15);
  
  let ms = millis();
  let s = second() + ms / 1000;
  let m = minute() + s / 60;
  let h = hour() % 12 + m / 60;

  // RESPONSIVE SCALING LOGIC
  let isPortrait = height > width;
  let dim = min(width, height);
  
  let scaleFactor = isPortrait ? 0.4 : 0.25; 
  
  let rSec = dim * scaleFactor;
  let rMin = dim * (scaleFactor * 0.7); 
  let rHour = dim * (scaleFactor * 0.35); 
  let orbitRadius = dim * (scaleFactor * 1.3); 

  if (isPortrait) {
    translate(0, -dim * 0.2, 0); 
  }

  // Get calendar orbit and spin angles based on the current date and time
  let currentYear = year();
  let currentMonth = month();
  let currentDay = day();
  
  let daysInMonth = [31, (currentYear % 4 === 0 ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let dayOfYear = 0;
  for (let i = 0; i < currentMonth - 1; i++) {
    dayOfYear += daysInMonth[i];
  }
  dayOfYear += currentDay;

  let fractionalDay = dayOfYear + (hour() / 24.0) + (minute() / 1440.0);
  let orbitAngle = map(fractionalDay, 0, (currentYear % 4 === 0 ? 366 : 365), 0, 360);

  let continuousHour = hour() + (minute() / 60.0) + (s / 3600.0);
  let spinAngle = map(continuousHour, 0, 24, 0, 360);

  //Starts moving based on the ms
  push();
  rotateY(ms * 0.0005);
  rotateX(ms * 0.0002);
  
  strokeWeight(2);
  stroke(255, 255, 255, 180); 
  beginShape(POINTS);
  for (let i = 0; i < stars.length; i++) {
    vertex(stars[i].x, stars[i].y, stars[i].z);
  }
  endShape();
  pop();

  //Orbit path
  push();
  rotateX(90); 
  noFill();
  strokeWeight(1);
  stroke(255, 255, 255, 50); 
  circle(0, 0, orbitRadius * 2);
  pop();

  //Earth/Clock's rotation
  let earthX = cos(orbitAngle - 90) * orbitRadius; 
  let earthZ = sin(orbitAngle - 90) * orbitRadius;

  push();
  translate(earthX, 0, earthZ);
  rotateZ(23.5); //The earth's axial tilt. So the clock/earth's Z axis(the hour hand) is tilted.
  rotateY(spinAngle); 

  // Making it a topological clock so that we can actually read earth time
  let ambientR = map(sin(ms * 0.03), -1, 1, 40, 200);
  let ambientG = map(sin(ms * 0.04 + 100), -1, 1, 40, 200);
  let ambientB = map(sin(ms * 0.05 + 200), -1, 1, 40, 255);
  let ambientColor = color(ambientR, ambientG, ambientB);

  //Used lerpColor to create a smooth transition and also add motion to the clock hands. 
  let secPulse = map(sin(ms * 0.15), -1, 1, 0.2, 0.8); 
  let colorSec = lerpColor(ambientColor, color(255, 30, 30), secPulse);

  let minPulse = map(sin(ms * 0.1), -1, 1, 0.2, 0.8);
  let colorMin = lerpColor(ambientColor, color(30, 255, 30), minPulse);

  let hourPulse = map(sin(ms * 0.05), -1, 1, 0.2, 0.8);
  let colorHour = lerpColor(ambientColor, color(80, 100, 255), hourPulse);

  let aS = map(s, 0, 60, 0, 360) - 90;
  let aM = map(m, 0, 60, 0, 360) - 90;
  let aH = map(h, 0, 12, 0, 360) - 90;

  // X-Y: Sec & Min
  drawReferenceDial(rSec, color(255, 255, 255, 60), dim); // Draw the reference dial for seconds and minutes.
  //Use rSec for the radius since seconds hand is the longest and I want the reference dial to encompass both hands.
  
  push();
  rotateZ(aS); 
  drawTopologicalRing(rSec, colorSec, ms, dim);
  drawClockHand(rSec, colorSec, dim);
  pop();

  push();//Isolate the minute hand's rotation and drawing
  rotateZ(aM);
  drawTopologicalRing(rMin, colorMin, ms, dim);
  drawClockHand(rMin, colorMin, dim);
  pop();

  // X-Z: Hour
  push(); // Isolate the hour hand's rotation and drawing
  rotateX(90); // Lay canvas flat for the hour hand to rotate around the Z-axis. 
  drawReferenceDial(rHour, color(255, 255, 255, 60), dim);
  
  rotateZ(aH); 
  drawTopologicalRing(rHour, colorHour, ms, dim);
  drawClockHand(rHour, colorHour, dim);
  pop(); 
}

// This function draws the static 12-hour tick marks around the clock.
function drawReferenceDial(radius, col, dim) {
  push();
  stroke(col);
  for (let i = 0; i < 12; i++) {
    let angle = map(i, 0, 12, 0, 360) - 90; 
    let innerR = radius + (dim * 0.005);
    let outerR = radius + (dim * 0.02);
    //Pushed the tick marks out a bit to make them more visible and not overlap with the clock hands.
    //Calculate the coordinates for the inner and outer points of the tick marks
    let x1 = cos(angle) * innerR;
    let y1 = sin(angle) * innerR;
    let x2 = cos(angle) * outerR;
    let y2 = sin(angle) * outerR;

    if (i % 3 === 0) {
      strokeWeight(max(2, dim * 0.004));
      line(x1, y1, 0, x2 + cos(angle)*(dim * 0.01), y2 + sin(angle)*(dim * 0.01), 0); //Thicker, longer tick marks for 3, 6, and 9 o'clock
      if (i === 0) {//Add a special 3D anchor marker for 12 o'clock
        push();
        translate(x2 + cos(angle)*(dim * 0.02), y2 + sin(angle)*(dim * 0.02), 0);
        noStroke();
        fill(255, 255, 255, 50);
        box(dim * 0.008); 
        pop();
      }
    } else {//Draw a thinner, shorter standard tick mark for the other hours
      strokeWeight(max(1, dim * 0.002));
      line(x1, y1, 0, x2, y2, 0);
    }
  }
  pop();
}

//Creating 3D "worm" tube along the plane of the clock hands.
//timeOffset is used to animate the distortion over time.
function drawTopologicalRing(radius, col, timeOffset, dim) {
  noFill();
  strokeWeight(max(1, dim * 0.003)); // Scale line thickness based on screen size
  
  // Draw 8 concentric circles stacked along the Z-axis to build a 3D "tube"
  for (let j = 0; j < 8; j++) {
    beginShape(); 
    
    // Calculate color fade and Z-depth ONCE per layer (much faster)
    // Front layer (j=0) is fully opaque (255), back layer (j=8) is nearly invisible (10)
    stroke(red(col), green(col), blue(col), map(j, 0, 8, 255, 10));
    let z = map(j, 0, 8, 0, -dim * 0.05); // Push older layers backwards into the screen
    
    // Calculate 60 points to form a single smooth circle
    for (let i = 0; i <= 60; i++) {
      let angle = map(i, 0, 60, 0, 360);
      
      // Base coordinates
      let x = radius * cos(angle);
      let y = radius * sin(angle);
      // Sampling a 3D spatial coordinate (x,y,z) plus a 4th dimension (timeOffset).
      let noiseVal = noise(
        x * 0.015, 
        y * 0.015, 
        z * 0.02 + timeOffset * 0.001 //Here is The Engine of Time!
        //By adding time to the Z-axis, the 3D tube is dragged through the invisible noise landscape along the Z-axis.
      );

      // Map the noise value into a physical push/pull distance (-2% to +2% of screen size)
      let distortion = map(noiseVal, 0, 1, -dim * 0.02, dim * 0.02);
      
      // Draw the final vertex
      vertex(
        x + cos(angle) * distortion, 
        y + sin(angle) * distortion, 
        z
      );
    }
    endShape(CLOSE); 
  }
}

function drawClockHand(radius, col, dim) {
  stroke(col);
  strokeWeight(max(1.5, dim * 0.004));
  line(0, 0, 0, radius, 0, 0);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}