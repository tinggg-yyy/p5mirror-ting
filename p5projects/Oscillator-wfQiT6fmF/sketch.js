let sineOsc;
let sqOsc;

function setup() {
  createCanvas(400, 400);
  sineOsc = new p5.Oscillator("sine");
  sqOsc = new p5.Oscillator("sine");
}

function draw() {
  background(220);
}

function mousePressed(){
  sineOsc.start();
  let freq = map(mouseX, 0, width, 150, 650);
  sineOsc.freq(freq);
}

function mouseReleased(){
  sineOsc.stop();
}

function keyPressed(){
  sqOsc.start();
  let freq = map(mouseY, 0, height, 650, 100);
  sqOsc.freq(freq);
}

function keyReleased(){
  sqOsc.stop();
}