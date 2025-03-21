/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates hand tracking on live video through ml5.handPose and has been modified so the video is mirrored.
 */
let handPose;
let video;

let myOsc;
let thumbX = 0,
  thumbY = 0,
  InX = 0,
  InY = 0;
let freq = 200;
let d = 0;
let cpVoice = new p5.Speech();

function preload() {
  // Load the handPose model
  handPose = ml5.handPose();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create the webcam video and hide it
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
  // start detecting hands from the webcam video
  handPose.detectStart(video, gotHands);

  myOsc = new p5.Oscillator("triangle");
  cpVoice.listVoices();
  cpVoice.setVoice("Nicky");
}

function mousePressed() {
  myOsc.start();
}

function keyPressed(){
  let myPitch = map(d, 0, width, 0, 18);
  cpVoice.setPitch(myPitch);
  cpVoice.speak("Meow meow meow");
}

function draw() {
  // Draw the webcam video
  translate(width, 0); // move to top right corner
  scale(-1.0, 1.0); // flip x-axis backwards
  image(video, 0, 0, width, height);
  noStroke();
  circle((thumbX+InX)/2, (thumbY+InY)/2, d);
}

// Callback function for when handPose outputs data
function gotHands(results) {
  if (results.length > 0) {
    console.log(results);
    thumbX = results[0].thumb_tip.x;
    thumbY = results[0].thumb_tip.y;
    InX = results[0].index_finger_tip.x;
    InY = results[0].index_finger_tip.y;
    d = dist(thumbX, thumbY, InX, InY);
    freq = map(d, 0, width, 150, 800);
    myOsc.freq(freq);
  }
}
