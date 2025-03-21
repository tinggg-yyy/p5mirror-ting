let r;
let g;
let b;
let ampadj = 3;

function setup() {
  createCanvas(550, 450);
}

function draw() {
  background(0, 10);
  for (let i = 0; i < 40; i++) {
    drawWave(random(-100, height + 100), random(0.01, 0.3));
  }
}

function drawWave(y, freqAdj) {
  for (let x = 0; x < width; x += 1) {
    let freq, amp;

    freq = frameCount * 0.01;
    amp = mouseY *0.01;
    let sinForAmp = sin(freq) * amp;

    freq = frameCount * freqAdj;
    amp = 1;
    let sinForFreq = sin(freq) * amp;

    freq = x * 0.01 + frameCount * 0.3 + sinForFreq;
    ampadj = lerp(ampadj, 8, 0.2);
    amp = ampadj * sinForAmp;
    let sinValue = sin(freq) * amp;

    //color
    r = map(noise(freq), 0, 1, 100, 255);
    g = map(noise(freq), 0, 1, 100, 150);
    b = map(noise(freq), 0, 1, 255, 80);
    noStroke();
    fill(r, g, b);
    circle(x, y + sinValue, noise(freq) * 8);
  }
}
