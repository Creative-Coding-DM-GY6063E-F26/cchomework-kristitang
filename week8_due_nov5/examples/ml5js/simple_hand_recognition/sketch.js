let vid;
let handPose;
let hands = [];
async function setup() {
  createCanvas(windowWidth,windowHeight);

  console.log("ml5 version:", ml5.version);
  vid = createCapture(VIDEO); 
  vid.size(320, 240);
  //vid.hide();
  background(220);
  handPose = await ml5.handPose();//putting await to make sure the function loaded
  handPose.detectStart(vid, gotHands);
  noLoop();
}


function draw() {
  background(220);
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
    // Iterate over every property key inside the hand object
    for (let key of Object.keys(hand)) {
      console.log(index, key);
      
      if (key.includes("finger")) {
        let finger = hand[key];
        console.log(`Hand ${index} ${key}:`, finger);
        console.log(finger.x,finger.y);
        let mappedX = map(finger.x,0,320,width,0);
        let mappedY = map(finger.y,0, 240, height, 0);
        circle(mappedX,mappedY,10);
      }
    }

  });
}
