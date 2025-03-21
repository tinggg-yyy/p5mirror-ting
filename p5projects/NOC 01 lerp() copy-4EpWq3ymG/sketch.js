let x = 0;
let y = 0;
function setup() {
createCanvas(400, 400);
 background(220);
}

function draw() {
x = lerp(x, 200, 0.5);
y = lerp(y, 200, 0.5);
(x, y, 30);

}