let numbers = [];
let notes = [];
function preload() {
  for (let i = 0; i < 10; i++) {
    numbers[i] = loadSound("voice" + String(i) + ".mp3");
  }
  console.log(numbers);
  for (let i = 0; i < 10; i++) {
    notes[i] = loadSound("organ" + String(i) + ".wav");
  }
  console.log(notes);
}
function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
}
function mousePressed() {
  random(numbers).play();
}
function keyPressed() {
  random(notes).play();
}
