// change the quotes in this array. Be mindful of the quotation marks!
// this is the only part of the file you need to edit!
const quotes = [
  { text: "is to create something expressive instead of something functional ", source: "Wikipedia" },//https://en.wikipedia.org/wiki/Creative_coding
  { text: "is an act of curiosity", source: "Patrik" },//https://www.patrik-huebner.com/datadesigndictionary/creative-coding/
  { text: "a new interdisciplinary art form that bridges the gap between technologists and artists", source: "Gorilla Sun" }, //https://www.gorillasun.de/blog/creative-coding-the-new-era/
  { text: "writing a poem", source: "Hunter" },//https://guidebook.hdyar.com/creative-coding/creative-coding-fundamentals/what-is-creative-coding/#top
  { text: "digital clay", source: "John" },//https://dl.acm.org/doi/abs/10.5555/553360 & https://www.flong.com/archive/texts/essays/essay_creative_code/index.html
  //Maeda argues that treating a computer like a digital canvas or paintbrush is too limiting. Instead, code is an autonomous artistic environment.
  //Just as a sculptor must understand the properties of marble or clay, a digital artist must understand the nature of code, logic, data input, and processing constraints to truly create
  { text: "making art with code", source: "Art + Code" },//https://processing.github.io/art-plus-code/codeAsCreativeMedium-intro/
  { text: "a School of Thought“ ", source: "Tim" },//https://trcc.timrodenbroeker.de/what-is-creative-coding/
  { text: "a chance for code to be wrong", source: "Sara" } //I personally like this one and found it quite inspiring because it is a reminder that mistakes are part of the process. So I am keeping this one in the array.
];
// no need to edit anything below this line! 
// if you have made an error, you can check your history to see what might have gone wrong

// a variable tht holds the current quote
let quoteIndex = 0;
let current = quotes[0];
let lastSwap = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  buildShell();
  lastSwap = millis();
  addQuoteBox(0);
  quoteIndex = 1;
}

function draw() {
  background(0, 128, 128);
  // each picked line comes out as its own message box
  if (quoteIndex < quotes.length && millis() - lastSwap > 240) {
    addQuoteBox(quoteIndex);
    quoteIndex += 1;
    lastSwap = millis();
  }
}

function buildShell() {
  const style = document.createElement("style");
  style.textContent = `
    body { margin: 0; background: #008080; }
    canvas { position: fixed; inset: 0; z-index: 0; }
    .msgbox, .msgbox p {
      font-family: Tahoma, "MS Sans Serif", sans-serif;
      font-size: 15px;
      font-weight: normal;
      font-style: normal;
      line-height: 1.35;
    }
    .desk {
      position: relative;
      z-index: 1;
      min-height: 100vh;
      padding-bottom: 64px;
    }
    .msgbox {
      position: absolute;
      background: #c0c0c0;
      color: #000;
      padding: 2px;
      border: 2px solid;
      border-color: #fff #404040 #404040 #fff;
      box-shadow: 1px 1px 0 #000;
      animation: comeOut 0.12s linear;
    }
    @keyframes comeOut {
      from { transform: translate(10px, 14px); }
      to { transform: none; }
    }
    .titlebar {
      background: #000080;
      color: #fff;
      font-weight: bold;
      padding: 3px 6px;
    }
    .sheet {
      display: flex;
      align-items: flex-start;
      padding: 12px 12px 10px;
    }
    .mark {
      flex: none;
      width: 32px;
      height: 32px;
      margin: 2px 12px 0 2px;
      border-radius: 50%;
      background: #000080;
      color: #fff;
      font-family: "Times New Roman", serif;
      font-size: 22px;
      font-style: italic;
      font-weight: bold;
      line-height: 32px;
      text-align: center;
    }
    .copy { flex: 1; min-width: 0; }
    .msgbox p { margin: 0 0 8px; }
    .who { text-align: right; margin-bottom: 0; }
    a.enter {
      position: fixed;
      z-index: 50;
      left: 50%;
      bottom: 18px;
      transform: translateX(-50%);
      font-family: Tahoma, "MS Sans Serif", sans-serif;
      font-size: 15px;
      font-weight: normal;
      color: #000;
      background: #c0c0c0;
      text-decoration: none;
      min-width: 86px;
      padding: 4px 18px 5px;
      border: 2px solid;
      border-color: #fff #404040 #404040 #fff;
      box-shadow: 1px 1px 0 #000;
      text-align: center;
    }
    a.enter:active {
      border-color: #404040 #fff #fff #404040;
      box-shadow: none;
    }
  `;
  document.head.appendChild(style);

  const desk = document.createElement("div");
  desk.className = "desk";
  document.body.appendChild(desk);

  const inWeekFolder = location.pathname.indexOf("week2_due_sep17") !== -1;
  const enter = document.createElement("a");
  enter.className = "enter";
  enter.href = inWeekFolder ? "../gallery.html" : "gallery.html";
  enter.textContent = "Enter";
  document.body.appendChild(enter);
}

function addQuoteBox(index) {
  const item = quotes[index];
  const box = document.createElement("div");
  box.className = "msgbox";

  box.style.zIndex = String(2 + index);

  const title = document.createElement("div");
  title.className = "titlebar";
  title.textContent = "Creative Coding";

  const sheet = document.createElement("div");
  sheet.className = "sheet";

  const mark = document.createElement("div");
  mark.className = "mark";
  mark.setAttribute("aria-hidden", "true");
  mark.textContent = "i";

  const copy = document.createElement("div");
  copy.className = "copy";

  const lead = document.createElement("p");
  lead.textContent = "Creative Coding is.....";

  const line = document.createElement("p");
  const words = item.text.trim().replace(/[“”"]/g, "");
  line.textContent = "\u201c" + words + "\u201d";

  const who = document.createElement("p");
  who.className = "who";
  who.textContent = "-" + item.source;

  copy.append(lead, line, who);
  sheet.append(mark, copy);
  box.append(title, sheet);
  document.querySelector(".desk").appendChild(box);
  placeQuoteBoxes();
}

function placeQuoteBoxes() {
  const boxes = document.querySelectorAll(".msgbox");
  const margin = 12;
  const boxWidth = Math.min(420, windowWidth - margin * 2);

  boxes.forEach((box, i) => {
    box.style.width = boxWidth + "px";
    const w = box.offsetWidth;
    const h = box.offsetHeight;
    if (i === 0) {
      box.style.left = Math.max(margin, (windowWidth - w) / 2) + "px";
      box.style.top = Math.max(margin, (windowHeight - h) / 2 - 16) + "px";
      return;
    }
    if (box.dataset.placed === "1") return;
    const maxX = Math.max(margin, windowWidth - w - margin);
    const maxY = Math.max(margin, windowHeight - h - 72);
    box.style.left = (margin + Math.random() * (maxX - margin)) + "px";
    box.style.top = (margin + Math.random() * (maxY - margin)) + "px";
    box.dataset.placed = "1";
  });

  document.querySelector(".desk").style.height = windowHeight + "px";
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  placeQuoteBoxes();
}
