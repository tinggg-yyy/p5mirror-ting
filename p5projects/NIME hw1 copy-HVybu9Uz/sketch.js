let icicles = [];
let drops = [];
let gravity = 0.5;
let floorHeight = 500;

function setup() {
  createCanvas(800, 600);

  // 创建5个不同长度的冰柱
  for (let i = 0; i < 5; i++) {
    let totalLength = random(150, 300); // 冰柱的总长度
    let dropHeight = totalLength / floor(random(5, 10)); // 每滴水减少的冰柱长度

    let icicle = {
      x: i * 100 + 100,
      y: 100,
      length: totalLength, // 冰柱的总长度
      originalLength: totalLength, // 记录初始长度
      dropHeight: dropHeight, // 每滴水减少的高度
      remainingDrops: floor(totalLength / dropHeight), // 计算剩余水滴数量
      nextDropTime: random(1000, 3000), // 下一次水滴的随机时间
      lastDropTime: millis(),
      // 创建p5振荡器和包络
      tone: new p5.Oscillator('sine'), 
      env: new p5.Envelope(0.01, 1, 0.2, 0.5) // 设置包络 (攻击, 持续, 衰减, 释放)
    };
    
    // 初始化振荡器并连接包络
    icicle.tone.start();
    icicle.tone.amp(icicle.env);
    icicles.push(icicle);
  }
}

function draw() {
  background(220);
  
  // 绘制冰柱
  for (let icicle of icicles) {
    stroke(0);
    strokeWeight(5);
    line(icicle.x, icicle.y, icicle.x, icicle.y + icicle.length);
    
    // 处理水滴
    if (icicle.remainingDrops > 0 && millis() - icicle.lastDropTime > icicle.nextDropTime) {
      createDrop(icicle);
      icicle.lastDropTime = millis();
      icicle.nextDropTime = random(1000, 3000); // 随机生成下一滴水的时间
    }
  }
  
  // 更新和绘制水滴
  for (let drop of drops) {
    drop.update();
    drop.display();
    
    // 当水滴碰到地板时播放音效
    if (!drop.hasHitFloor && drop.y >= floorHeight) {
      playTone(drop.icicle);
      drop.hasHitFloor = true; // 确保每个水滴只播放一次音效
    }
  }

  // 移除已碰到地面的水滴
  drops = drops.filter(drop => drop.y < height + 10);
  
  // 绘制地面
  stroke(0);
  strokeWeight(1);
  line(0, floorHeight, width, floorHeight);
}

// 创建一个水滴并减少冰柱长度
function createDrop(icicle) {
  drops.push(new Drop(icicle.x, icicle.y + icicle.length, icicle));
  icicle.remainingDrops--;
  icicle.length -= icicle.dropHeight; // 每滴水减少冰柱的长度
}

// 播放水滴音效
function playTone(icicle) {
  let frequency = map(icicle.x, 0, width, 200, 800); // 将x位置映射为频率
  icicle.tone.freq(frequency); // 设置频率
  icicle.env.play(); // 播放音效
}

// 水滴类
class Drop {
  constructor(x, y, icicle) {
    this.x = x;
    this.y = y;
    this.speed = 0;
    this.icicle = icicle;
    this.hasHitFloor = false;
  }
  
  update() {
    this.speed += gravity; // 模拟重力
    this.y += this.speed; // 移动水滴
  }
  
  display() {
    fill(200, 0, 200);
    noStroke();
    ellipse(this.x, this.y, 10, 10); // 绘制水滴
  }
}

