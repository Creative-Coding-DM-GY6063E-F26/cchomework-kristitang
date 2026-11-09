let vid;
let handPose;
let hands = [];
let pressure;
let pressureBlur;
let dye;
let dyeTmp;
let vx;
let vy;
let vxTmp;
let vyTmp;
let flowPrev = {};
let cover = 1;
let originX = 0;
let originY = 0;
let depthSmooth = {};
let clothTex;
let clothShader;

let cols = 100;
let rows = 75;
let meshCols = 120;
let meshRows = 90;
let handClose = 48;

let fingers = [
  ["wrist", "thumb_cmc", "thumb_mcp", "thumb_ip", "thumb_tip"],
  ["wrist", "index_finger_mcp", "index_finger_pip", "index_finger_dip", "index_finger_tip"],
  ["wrist", "middle_finger_mcp", "middle_finger_pip", "middle_finger_dip", "middle_finger_tip"],
  ["wrist", "ring_finger_mcp", "ring_finger_pip", "ring_finger_dip", "ring_finger_tip"],
  ["wrist", "pinky_finger_mcp", "pinky_finger_pip", "pinky_finger_dip", "pinky_finger_tip"]
];

async function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  pixelDensity(1);

  console.log("ml5 version:", ml5.version);

  pressure = new Float32Array(cols * rows);
  pressureBlur = new Float32Array(cols * rows);
  dye = new Float32Array(cols * rows);
  dyeTmp = new Float32Array(cols * rows);
  vx = new Float32Array(cols * rows);
  vy = new Float32Array(cols * rows);
  vxTmp = new Float32Array(cols * rows);
  vyTmp = new Float32Array(cols * rows);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      dye[y * cols + x] = y / (rows - 1);
    }
  }
  clothTex = createImage(cols, rows);
  clothShader = createShader(clothVert, clothFrag);

  vid = createCapture(VIDEO, { flipped: true });
  vid.size(640, 480);
  vid.hide();

  handPose = await ml5.handPose({ maxHands: 2, flipped: true });
  handPose.detectStart(vid, gotHands);
}

function draw() {
  background(32, 78, 190);
  pressure.fill(0);

  if (vid.width > 0) {
    cover = Math.max(width / vid.width, height / vid.height);
    originX = (width - vid.width * cover) / 2;
    originY = (height - vid.height * cover) / 2;
    if (hands.length > 0) {
      readFingerData();
    }
  }

  smoothPressure();
  stepFlow();
  renderCloth3D();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  pixelDensity(1);
}

function gotHands(results, err) {
  if (err) {
    console.error(err);
    return;
  }
  if (results.length > 0) {
    hands = results;
  } else {
    hands = [];
  }
}

function readFingerData() {
  hands.forEach((hand, index) => {
    let span = handSpan(hand);
    if (span <= handClose) return;

    let strength = constrain(map(span, handClose, handClose * 2.4, 0.6, 1), 0.6, 1);
    applyHandDepth(hand, index);

    for (let key of Object.keys(hand)) {
      if (!key.includes("finger") && !key.includes("thumb") && key !== "wrist") continue;
      let finger = hand[key];
      if (!finger || typeof finger.x !== "number") continue;
      let mappedX = map(finger.x, 0, vid.width, originX, originX + vid.width * cover);
      let mappedY = map(finger.y, 0, vid.height, originY, originY + vid.height * cover);
      finger.mappedX = mappedX;
      finger.mappedY = mappedY;
    }

    drawHand(hand, strength);
  });
}

function drawHand(hand, strength) {
  let points = [];
  for (let i = 0; i < fingers.length; i++) {
    for (let j = 0; j < fingers[i].length; j++) {
      let point = hand[fingers[i][j]];
      if (point && typeof point.mappedX === "number") points.push(point);
    }
  }
  if (points.length === 0) return;

  let range = depthRange(points);
  let bone = handSpan(hand);
  if (bone <= 0) bone = 40;

  for (let i = 0; i < fingers.length; i++) {
    softFinger(hand, fingers[i], range, strength, bone);
  }
}

function softFinger(hand, names, range, strength, bone) {
  let points = [];
  for (let i = 0; i < names.length; i++) {
    let point = hand[names[i]];
    if (point && typeof point.mappedX === "number") points.push(point);
  }
  if (points.length < 2) return;

  let fingerWidth = bone * 0.2;
  for (let i = 0; i < points.length - 1; i++) {
    let a = points[i];
    let b = points[i + 1];
    let pressA = pressAmount(a.z, range, strength) * 0.7;
    let pressB = pressAmount(b.z, range, strength) * 0.7;
    let d = dist(a.x, a.y, b.x, b.y);
    let n = Math.max(1, Math.ceil(d / Math.max(fingerWidth * 0.35, 1)));
    for (let s = 0; s <= n; s++) {
      let t = s / n;
      stampGaussian(
        a.mappedX + (b.mappedX - a.mappedX) * t,
        a.mappedY + (b.mappedY - a.mappedY) * t,
        pressA + (pressB - pressA) * t,
        fingerWidth
      );
    }
  }

  let tip = points[points.length - 1];
  stampGaussian(tip.mappedX, tip.mappedY, pressAmount(tip.z, range, strength), bone * 0.13);
}

function mapFingerToGrid(point) {
  return {
    x: map(point.mappedX, 0, width, 0, cols),
    y: map(point.mappedY, 0, height, 0, rows)
  };
}

function stepFlow() {
  let t = millis() * 0.001;
  for (let i = 0; i < vx.length; i++) {
    vx[i] *= 0.92;
    vy[i] *= 0.92;
  }
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let i = y * cols + x;
      vx[i] += Math.sin(x * 0.17 + t * 0.55) * Math.cos(y * 0.13 - t * 0.38) * 0.025;
      vy[i] += Math.cos(x * 0.11 - t * 0.42) * Math.sin(y * 0.15 + t * 0.33) * 0.025;
    }
  }
  stirFromHands();
  diffuseVelocity();
  advectDye();
}

function stirFromHands() {
  let seen = {};
  for (let h = 0; h < hands.length; h++) {
    let hand = hands[h];
    if (handSpan(hand) <= handClose) continue;
    let cx = 0;
    let cy = 0;
    let mx = 0;
    let my = 0;
    let n = 0;
    let used = {};
    for (let key of Object.keys(hand)) {
      if (used[key]) continue;
      if (!key.includes("finger") && !key.includes("thumb") && key !== "wrist") continue;
      let point = hand[key];
      if (!point || typeof point.mappedX !== "number") continue;
      used[key] = true;
      let g = mapFingerToGrid(point);
      let id = h + ":" + key;
      seen[id] = true;
      let prev = flowPrev[id];
      let dx = 0;
      let dy = 0;
      if (prev) {
        dx = g.x - prev.x;
        dy = g.y - prev.y;
        if (dx > 4) dx = 4;
        if (dx < -4) dx = -4;
        if (dy > 4) dy = 4;
        if (dy < -4) dy = -4;
      }
      flowPrev[id] = { x: g.x, y: g.y };
      addFlow(g.x, g.y, dx * 0.35, dy * 0.35, 16);
      let hot = key.indexOf("tip") >= 0 ? 0.92 : 0.22;
      tintDye(g.x, g.y, hot, key.indexOf("tip") >= 0 ? 0.35 : 0.12, 12);
      cx += g.x;
      cy += g.y;
      mx += dx;
      my += dy;
      n += 1;
    }
    if (n === 0) continue;
    cx /= n;
    cy /= n;
    mx /= n;
    my /= n;
    let reach = 26;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        let dxg = x - cx;
        let dyg = y - cy;
        let fall = Math.exp(-(dxg * dxg + dyg * dyg) / (2 * reach * reach));
        let carry = 0.42 + 0.58 * fall;
        let i = y * cols + x;
        vx[i] += mx * carry * 0.16;
        vy[i] += my * carry * 0.16;
        vx[i] += -dyg * fall * 0.003;
        vy[i] += dxg * fall * 0.003;
        if (vx[i] > 1.6) vx[i] = 1.6;
        if (vx[i] < -1.6) vx[i] = -1.6;
        if (vy[i] > 1.6) vy[i] = 1.6;
        if (vy[i] < -1.6) vy[i] = -1.6;
      }
    }
  }
  for (let key in flowPrev) {
    if (!seen[key]) delete flowPrev[key];
  }
}

function addFlow(gx, gy, ax, ay, sigma) {
  if (ax === 0 && ay === 0) return;
  stampField(gx, gy, sigma, function (i, fall) {
    vx[i] += ax * fall;
    vy[i] += ay * fall;
  });
}

function tintDye(gx, gy, target, amount, sigma) {
  stampField(gx, gy, sigma, function (i, fall) {
    let k = fall * amount;
    dye[i] += (target - dye[i]) * k;
  });
}

function stampField(gx, gy, sigma, write) {
  let radius = sigma * 2.4;
  let x0 = Math.floor(gx - radius);
  let x1 = Math.ceil(gx + radius);
  let y0 = Math.floor(gy - radius);
  let y1 = Math.ceil(gy + radius);
  if (x0 < 0) x0 = 0;
  if (y0 < 0) y0 = 0;
  if (x1 > cols - 1) x1 = cols - 1;
  if (y1 > rows - 1) y1 = rows - 1;
  let inv = 1 / (2 * sigma * sigma);
  for (let y = y0; y <= y1; y++) {
    let dy = y - gy;
    for (let x = x0; x <= x1; x++) {
      let dx = x - gx;
      write(y * cols + x, Math.exp(-(dx * dx + dy * dy) * inv));
    }
  }
}

function diffuseVelocity() {
  let r = 5;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let sumX = 0;
      let sumY = 0;
      let n = 0;
      let x0 = x - r < 0 ? 0 : x - r;
      let x1 = x + r > cols - 1 ? cols - 1 : x + r;
      let row = y * cols;
      for (let k = x0; k <= x1; k++) {
        sumX += vx[row + k];
        sumY += vy[row + k];
        n += 1;
      }
      vxTmp[row + x] = sumX / n;
      vyTmp[row + x] = sumY / n;
    }
  }
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      let sumX = 0;
      let sumY = 0;
      let n = 0;
      let y0 = y - r < 0 ? 0 : y - r;
      let y1 = y + r > rows - 1 ? rows - 1 : y + r;
      for (let k = y0; k <= y1; k++) {
        sumX += vxTmp[k * cols + x];
        sumY += vyTmp[k * cols + x];
        n += 1;
      }
      vx[y * cols + x] = sumX / n;
      vy[y * cols + x] = sumY / n;
    }
  }
}

function advectDye() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let i = y * cols + x;
      let sample = sampleDye(x - vx[i], y - vy[i]);
      let base = y / (rows - 1);
      dyeTmp[i] = sample * 0.985 + base * 0.015;
    }
  }
  let swap = dye;
  dye = dyeTmp;
  dyeTmp = swap;
}

function sampleDye(x, y) {
  if (x < 0) x = 0;
  if (y < 0) y = 0;
  if (x > cols - 1.001) x = cols - 1.001;
  if (y > rows - 1.001) y = rows - 1.001;
  let x0 = Math.floor(x);
  let y0 = Math.floor(y);
  let tx = x - x0;
  let ty = y - y0;
  let x1 = x0 + 1 < cols ? x0 + 1 : x0;
  let y1 = y0 + 1 < rows ? y0 + 1 : y0;
  let a = dye[y0 * cols + x0];
  let b = dye[y0 * cols + x1];
  let c = dye[y1 * cols + x0];
  let d = dye[y1 * cols + x1];
  return (a + (b - a) * tx) * (1 - ty) + (c + (d - c) * tx) * ty;
}

function stampGaussian(mx, my, amount, sigmaVideo) {
  if (amount <= 0) return;

  let x = map(mx, 0, width, 0, cols);
  let y = map(my, 0, height, 0, rows);
  let sigma = sigmaVideo * cover * (cols / width);
  if (sigma < 1.3) sigma = 1.3;
  if (sigma > 16) sigma = 16;

  let radius = sigma * 2.7;
  let x0 = Math.floor(x - radius);
  let x1 = Math.ceil(x + radius);
  let y0 = Math.floor(y - radius);
  let y1 = Math.ceil(y + radius);
  if (x0 < 0) x0 = 0;
  if (y0 < 0) y0 = 0;
  if (x1 > cols - 1) x1 = cols - 1;
  if (y1 > rows - 1) y1 = rows - 1;

  let inv = 1 / (2 * sigma * sigma);
  for (let py = y0; py <= y1; py++) {
    let row = py * cols;
    let dy = py - y;
    for (let px = x0; px <= x1; px++) {
      let dx = px - x;
      let falloff = amount * Math.exp(-(dx * dx + dy * dy) * inv);
      if (falloff > pressure[row + px]) pressure[row + px] = falloff;
    }
  }
}

function handSpan(hand) {
  if (!hand.wrist || !hand.middle_finger_mcp) return 0;
  return dist(hand.wrist.x, hand.wrist.y, hand.middle_finger_mcp.x, hand.middle_finger_mcp.y);
}

function smoothPressure() {
  let r = 3;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let sum = 0;
      let n = 0;
      let x0 = x - r < 0 ? 0 : x - r;
      let x1 = x + r > cols - 1 ? cols - 1 : x + r;
      let row = y * cols;
      for (let k = x0; k <= x1; k++) {
        sum += pressure[row + k];
        n += 1;
      }
      pressureBlur[row + x] = sum / n;
    }
  }
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      let sum = 0;
      let n = 0;
      let y0 = y - r < 0 ? 0 : y - r;
      let y1 = y + r > rows - 1 ? rows - 1 : y + r;
      for (let k = y0; k <= y1; k++) {
        sum += pressureBlur[k * cols + x];
        n += 1;
      }
      pressure[y * cols + x] = sum / n;
    }
  }
}

function depthRange(points) {
  let near = Infinity;
  let far = -Infinity;
  for (let i = 0; i < points.length; i++) {
    let z = points[i].z;
    if (typeof z !== "number" || Number.isNaN(z)) continue;
    if (z < near) near = z;
    if (z > far) far = z;
  }
  if (!isFinite(near) || far - near < 0.0001) {
    return { near: 0, far: 1, flat: true };
  }
  return { near: near, far: far, flat: false };
}

function rawDepth(point) {
  if (!point) return null;
  if (typeof point.z3D === "number" && !Number.isNaN(point.z3D)) return point.z3D;
  if (point.keypoint3D && typeof point.keypoint3D.z === "number" && !Number.isNaN(point.keypoint3D.z)) {
    return point.keypoint3D.z;
  }
  return null;
}

function applyHandDepth(hand, index) {
  for (let key of Object.keys(hand)) {
    if (!key.includes("finger") && !key.includes("thumb") && key !== "wrist") continue;
    let point = hand[key];
    if (!point) continue;
    let z = rawDepth(point);
    if (z === null) continue;
    let id = "h" + index + ":" + key;
    let prev = depthSmooth[id];
    if (typeof prev !== "number") prev = z;
    let next = prev + (z - prev) * 0.85;
    depthSmooth[id] = next;
    point.z = next;
  }
}

function pressAmount(z, range, strength) {
  if (typeof z !== "number" || Number.isNaN(z)) return 0;
  if (range.flat) return strength * 0.45;
  let t = (range.far - z) / (range.far - range.near);
  if (t < 0) t = 0;
  if (t > 1) t = 1;
  let contact = t * t * (3 - 2 * t);
  return (0.34 + 0.66 * contact) * strength;
}

function renderCloth3D() {
  writeClothTex();

  shader(clothShader);
  clothShader.setUniform("uPressure", clothTex);
  clothShader.setUniform("uDepth", Math.min(width, height) * 0.1);
  noStroke();

  push();
  ortho(-width / 2, width / 2, -height / 2, height / 2, -2000, 2000);
  translate(-width / 2, -height / 2, 0);

  for (let y = 0; y < meshRows - 1; y++) {
    beginShape(TRIANGLE_STRIP);
    for (let x = 0; x < meshCols; x++) {
      vertex(
        x * (width / (meshCols - 1)),
        y * (height / (meshRows - 1)),
        0,
        x / (meshCols - 1),
        y / (meshRows - 1)
      );
      vertex(
        x * (width / (meshCols - 1)),
        (y + 1) * (height / (meshRows - 1)),
        0,
        x / (meshCols - 1),
        (y + 1) / (meshRows - 1)
      );
    }
    endShape();
  }
  pop();
  resetShader();
}

function writeClothTex() {
  clothTex.loadPixels();
  let pix = clothTex.pixels;
  for (let i = 0; i < pressure.length; i++) {
    let v = pressure[i];
    if (v < 0) v = 0;
    if (v > 1) v = 1;
    let p = i * 4;
    let d = dye[i];
    if (d < 0) d = 0;
    if (d > 1) d = 1;
    pix[p] = v * 255;
    pix[p + 1] = d * 255;
    pix[p + 2] = 0;
    pix[p + 3] = 255;
  }
  clothTex.updatePixels();
}

let clothVert = `
precision highp float;
attribute vec3 aPosition;
attribute vec2 aTexCoord;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform sampler2D uPressure;
uniform float uDepth;
varying vec2 vUv;
void main() {
  vUv = aTexCoord;
  float p = texture2D(uPressure, vUv).r;
  float glow = p * p * (3.0 - 2.0 * p);
  vec4 pos = vec4(aPosition, 1.0);
  pos.z += glow * uDepth;
  gl_Position = uProjectionMatrix * uModelViewMatrix * pos;
}
`;

let clothFrag = `
precision highp float;
uniform sampler2D uPressure;
varying vec2 vUv;
void main() {
  vec4 tex = texture2D(uPressure, vUv);
  float p = tex.r;
  float dye = tex.g;
  float glow = p * p * (3.0 - 2.0 * p);

  vec3 blue = vec3(0.16, 0.42, 0.92);
  vec3 red = vec3(0.93, 0.10, 0.08);
  vec3 field = mix(blue, red, dye);
  vec3 glowBlue = mix(vec3(0.26, 0.54, 0.97), field, 0.5);
  vec3 col = field;
  float body = smoothstep(0.0, 0.55, glow);
  col = mix(col, glowBlue, body * (1.0 - smoothstep(0.4, 0.92, glow)));
  col = mix(col, red, smoothstep(0.38, 0.92, glow));
  gl_FragColor = vec4(col, 1.0);
}
`;
