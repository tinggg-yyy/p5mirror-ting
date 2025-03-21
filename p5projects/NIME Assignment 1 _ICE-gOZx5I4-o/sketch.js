let icicles = [];
let drops = [];
let gravity = 0.5;
let floorHeight;
let keys = [];
let keyWidth;
let fs = false; // 用于跟踪全屏模式状态
let torchImg;

function preload() {
  // 预加载火把图像
  torchImg = loadImage('assets/fire.png'); // 使用新的火把图像URL
}

function setup() {
  createCanvas(windowWidth, windowHeight); // 全屏初始化
  floorHeight = windowHeight - 100; // 地板的位置距离底部100像素
  keyWidth = width / 20; // 将屏幕分为20个键

  // 设置自定义火把鼠标
  noCursor(); 
  cursor(torchImg, torchImg.width / 2, torchImg.height / 2);

  // 初始化键盘（键盘下方）
  for (let i = 0; i < 20; i++) {
    keys.push({
      x: i * keyWidth,
      color: color(0), // 默认黑色
    });
  }

  // 创建5到20个不同长度的冰柱
  for (let i = 0; i < random(15, 20); i++) {
    let totalLength = random(200, 450); // 冰柱的总长度
    let dropHeight = totalLength / floor(random(20, 30)); // 每滴水减少的冰柱长度

    let icicle = {
      x: i * random(50, 100) + 100,
      y: 0, // 冰柱从天花板开始
      length: totalLength, // 冰柱的总长度
      originalLength: totalLength, // 记录初始长度
      dropHeight: dropHeight, // 每滴水减少的高度
      remainingDrops: floor(totalLength / dropHeight), // 计算剩余水滴数量
      nextDropTime: random(1000, 5000), // 下一次水滴的随机时间
      lastDropTime: millis(),
      meltRate: 0.5, // 冰柱融化速度
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
  background(0); // 黑色背景

  let torchWidth = 40;  // 设置火焰图像的宽度 (大约与鼠标大小相当)
  let torchHeight = torchWidth * (torchImg.height / torchImg.width); // 按比例调整高度

  // 绘制火焰图像，使其跟随鼠标移动，并缩放到合适大小
  image(torchImg, mouseX - torchWidth / 2, mouseY - torchHeight / 2, torchWidth, torchHeight);

  for (let i = icicles.length - 1; i >= 0; i--) {
    let icicle = icicles[i];

    // 如果冰柱的长度大于0，继续绘制
    if (icicle.length > 0) {
      stroke(173, 216, 230); // 淡蓝色冰柱
      strokeWeight(5);
      line(icicle.x, icicle.y, icicle.x, icicle.y + icicle.length);

      // 检测火把是否接触到冰柱
      if (dist(mouseX, mouseY, icicle.x, icicle.y + icicle.length) < 20) { // 假设火把与冰柱的接触半径为50
        icicle.length -= icicle.meltRate; // 加速融化
        icicle.nextDropTime = 1000; // 随机生成下一滴水的时间
        if (icicle.length <= 1) {
          icicle.length = 0; // 确保冰柱长度不为负值
        }
      }

      // 处理水滴
      if (icicle.remainingDrops > 0 && millis() - icicle.lastDropTime > icicle.nextDropTime) {
        createDrop(icicle);
        icicle.lastDropTime = millis();
        icicle.nextDropTime = random(1000, 3000); // 随机生成下一滴水的时间
      }
    } else {
      // 如果冰柱长度已经为0，移除该冰柱
      icicles.splice(i, 1);
    }
  }

  // 更新和绘制水滴
  for (let drop of drops) {
    drop.update();
    drop.display();

    // 当水滴碰到地板时播放音效并改变键盘颜色
    if (!drop.hasHitFloor && drop.y >= floorHeight) {
      playTone(drop.icicle);
      drop.hasHitFloor = true; // 确保每个水滴只播放一次音效

      // 改变键盘颜色
      let keyIndex = floor(drop.x / keyWidth);
      if (keyIndex >= 0 && keyIndex < keys.length) {
        keys[keyIndex].color = color(255, 105, 180); // 粉色键盘
      }
    }
  }

  // 移除已碰到地面的水滴
  drops = drops.filter(drop => drop.y < height + 10);

  // 绘制地面
  stroke(255);
  strokeWeight(1);
  line(0, floorHeight, width, floorHeight);

  // 绘制键盘
  for (let key of keys) {
    fill(key.color);
    rect(key.x, floorHeight, keyWidth, height - floorHeight);
  }

  // 恢复键盘颜色
  keys.forEach(key => key.color = color(0)); // 恢复黑色
}

// 创建一个水滴并减少冰柱长度
function createDrop(icicle) {
  drops.push(new Drop(icicle.x, icicle.y + icicle.length, icicle));
  icicle.remainingDrops--;
  icicle.length -= icicle.dropHeight; // 每滴水减少冰柱的长度

  // 如果冰柱长度小于等于1，确保它不会变为负值
  if (icicle.length <= 3) {
    icicle.length = 0; // 设置为0，确保不会出现负长度
  }
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
    fill(173, 216, 230); // 淡蓝色水滴
    noStroke();
    ellipse(this.x, this.y, 10, 10); // 绘制水滴
  }
}

// 当窗口大小改变时，调整画布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  floorHeight = windowHeight - 100; // 调整地板位置
  keyWidth = width / 20; // 重新计算键盘宽度

  // 重新计算键盘的位置
  for (let i = 0; i < keys.length; i++) {
    keys[i].x = i * keyWidth;
  }
}

// 处理键盘按下事件
function keyPressed() {
  if (key === 'f' || key === 'F') {
    fs = !fs; // 切换全屏状态
    fullscreen(fs);
  }
}

