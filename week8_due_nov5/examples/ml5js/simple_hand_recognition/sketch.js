let vid;
let handPose;
let hands = [];
let paintLayer; 

async function setup() {
  createCanvas(windowWidth, windowHeight);
  console.log("ml5 version:", ml5.version);
  
  vid = createCapture(VIDEO); 
  vid.size(320, 240);
  vid.hide(); 
  
  paintLayer = createGraphics(windowWidth, windowHeight);
  
  handPose = await ml5.handPose();
  handPose.detectStart(vid, gotHands);
}

function draw() {
  background(240); 
  
  image(paintLayer, 0, 0);

  stroke(30);
  strokeWeight(5);
  noFill();
  circle(width / 2, height / 2, 400); 
  
  noStroke();
  fill(30);
  textSize(24);
  textAlign(CENTER);
  text("This is YOU", width / 2, height / 2 + 250);
}

function gotHands(results, err) {
  if (err) {
    console.error(err);
    return;
  }
  if(results.length > 0){
    hands = results;
    printFingerDataKey();
  }
}

function printFingerDataKey() {
  hands.forEach((hand, index) => {
    for (let key of Object.keys(hand)) {
      
      if (key === "index_finger_tip") { 
        let finger = hand[key];
      
        let realColor = vid.get(finger.x, finger.y);
        
        let mappedX = map(finger.x, 0, 320, width, 0); 
        let mappedY = map(finger.y, 0, 240, 0, height);
        
        paintLayer.fill(realColor);
        paintLayer.noStroke();
        paintLayer.circle(mappedX, mappedY, random(10, 25)); 
      }
    }
  });
}