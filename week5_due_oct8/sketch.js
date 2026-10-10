function setup() {
  createCanvas(windowWidth, windowHeight);
  background('peachpuff');
}

function draw() {
  background('peachpuff');
  let s = second();
  let m = minute();
  let h = hour();
  let time = h + ':' + m + ':' + s;
  //print(time);
  console.log('second: ' + s);
  let sMapped = map(s, 0, 60, 0, width/2);
  circle(s/60 * width, height/2, 100);
  circle(m/60 * width, height/2, 100);
  circle(h/24 * width, height/2, 100);
  //circle(sMapped, height/2, 100);
}
