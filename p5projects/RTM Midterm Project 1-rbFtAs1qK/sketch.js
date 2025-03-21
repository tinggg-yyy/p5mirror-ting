let trebleClef, bassClef;
let letters = 'abcdefghijklmnopqrstuvwxyz';
let notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5', 
             'C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C2', 'D2', 'E2', 'F2', 'G2'];
let synth;

function setup() {
  createCanvas(800, 400);
  synth = new p5.PolySynth();

  textSize(32);
  trebleClef = loadImage('https://upload.wikimedia.org/wikipedia/commons/6/6a/Gclef.svg');
  bassClef = loadImage('https://upload.wikimedia.org/wikipedia/commons/9/9b/Fclef.svg');
}

function draw() {
  background(255);

  // Draw treble staff (upper 5 lines)
  drawStaff(100);
  image(trebleClef, 30, 80, 60, 150);

  // Draw bass staff (lower 5 lines)
  drawStaff(250);
  image(bassClef, 30, 230, 60, 150);
}

function drawStaff(y) {
  stroke(0);
  strokeWeight(2);
  for (let i = 0; i < 5; i++) {
    line(100, y + i * 20, 700, y + i * 20);
  }
}

function keyPressed() {
  let index = letters.indexOf(key.toLowerCase());
  if (index !== -1) {
    let note = notes[index];
    let yPosition = mapNoteToY(index);

    // Draw the letter on the staff
    fill(0);
    text(key.toUpperCase(), 150 + index * 20, yPosition);

    // Play the corresponding note
    synth.play(note, 0.5, 0, 0.5);
  }
}

function mapNoteToY(index) {
  if (index < 14) { // Treble clef notes (C4 - B5)
    return map(index, 0, 13, 160, 100); // Adjust Y for treble clef range
  } else { // Bass clef notes (C2 - B3)
    return map(index, 14, 25, 310, 250); // Adjust Y for bass clef range
  }
}
