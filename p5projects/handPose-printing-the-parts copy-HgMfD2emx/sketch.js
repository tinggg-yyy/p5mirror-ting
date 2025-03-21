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
let leftInX = 0,
  leftInY = 0,
  rightInX = 0,
  rightInY = 0;
let freq = 200;
let d = 0;

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

  myOsc = new p5.Oscillator("sine");
}

function mousePressed() {
  myOsc.start();
}

function draw() {
  // Draw the webcam video
  translate(width, 0); // move to top right corner
  scale(-1.0, 1.0); // flip x-axis backwards
  image(video, 0, 0, width, height);
  circle((leftInX+rightInX)/2, (leftInY+rightInY)/2, d);
}

// Callback function for when handPose outputs data
function gotHands(results) {
  if (results.length > 1) {
    console.log(results);
    leftInX = results[0].index_finger_tip.x;
    leftInY = results[0].index_finger_tip.y;
    rightInX = results[1].index_finger_tip.x;
    rightInY = results[1].index_finger_tip.y;
    d = dist(leftInX, leftInY, rightInX, rightInY);
    freq = map(d, 0, width, 150, 650);
    myOsc.freq(freq);
  }
}
