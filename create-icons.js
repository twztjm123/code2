// 图标创建脚本
// 这个脚本可以生成简单的占位符图标
// 实际项目中应该使用专业设计的图标

const fs = require('fs');
const { createCanvas } = require('canvas');

// 创建192x192图标
function createIcon192() {
  const canvas = createCanvas(192, 192);
  const ctx = canvas.getContext('2d');
  
  // 背景
  ctx.fillStyle = '#4a6cf7';
  ctx.fillRect(0, 0, 192, 192);
  
  // 盾牌图标
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(96, 40);
  ctx.bezierCurveTo(60, 40, 40, 70, 40, 96);
  ctx.bezierCurveTo(40, 140, 96, 180, 96, 180);
  ctx.bezierCurveTo(96, 180, 152, 140, 152, 96);
  ctx.bezierCurveTo(152, 70, 132, 40, 96, 40);
  ctx.closePath();
  ctx.fill();
  
  // 锁图标
  ctx.fillStyle = '#4a6cf7';
  ctx.fillRect(80, 100, 32, 40);
  ctx.beginPath();
  ctx.arc(96, 90, 20, 0, Math.PI * 2);
  ctx.fill();
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('icon-192.png', buffer);
  console.log('已创建 icon-192.png');
}

// 创建512x512图标
function createIcon512() {
  const canvas = createCanvas(512, 512);
  const ctx = canvas.getContext('2d');
  
  // 背景
  ctx.fillStyle = '#4a6cf7';
  ctx.fillRect(0, 0, 512, 512);
  
  // 盾牌图标
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(256, 100);
  ctx.bezierCurveTo(160, 100, 100, 180, 100, 256);
  ctx.bezierCurveTo(100, 380, 256, 480, 256, 480);
  ctx.bezierCurveTo(256, 480, 412, 380, 412, 256);
  ctx.bezierCurveTo(412, 180, 352, 100, 256, 100);
  ctx.closePath();
  ctx.fill();
  
  // 锁图标
  ctx.fillStyle = '#4a6cf7';
  ctx.fillRect(212, 280, 88, 120);
  ctx.beginPath();
  ctx.arc(256, 240, 60, 0, Math.PI * 2);
  ctx.fill();
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('icon-512.png', buffer);
  console.log('已创建 icon-512.png');
}

// 创建favicon.ico（简单版本）
function createFavicon() {
  const canvas = createCanvas(32, 32);
  const ctx = canvas.getContext('2d');
  
  // 背景
  ctx.fillStyle = '#4a6cf7';
  ctx.fillRect(0, 0, 32, 32);
  
  // 简单盾牌图标
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(16, 6);
  ctx.bezierCurveTo(10, 6, 6, 10, 6, 16);
  ctx.bezierCurveTo(6, 24, 16, 30, 16, 30);
  ctx.bezierCurveTo(16, 30, 26, 24, 26, 16);
  ctx.bezierCurveTo(26, 10, 22, 6, 16, 6);
  ctx.closePath();
  ctx.fill();
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('favicon.png', buffer);
  console.log('已创建 favicon.png（请手动转换为.ico格式）');
}

// 主函数
function main() {
  console.log('开始创建应用图标...');
  
  try {
    createIcon192();
    createIcon512();
    createFavicon();
    
    console.log('\n图标创建完成！');
    console.log('请注意：favicon.png需要手动转换为.ico格式');
    console.log('可以使用在线转换工具：https://icoconvert.com/');
  } catch (error) {
    console.error('创建图标时出错:', error.message);
    console.log('\n替代方案：');
    console.log('1. 使用在线图标生成器创建图标');
    console.log('2. 将图标文件命名为：icon-192.png, icon-512.png, favicon.ico');
    console.log('3. 放置在与index.html相同的目录下');
  }
}

// 检查是否安装了canvas
try {
  require('canvas');
  main();
} catch (error) {
  console.log('未安装canvas模块，无法生成图标');
  console.log('请运行：npm install canvas');
  console.log('\n或者手动创建以下图标文件：');
  console.log('- icon-192.png (192x192像素)');
  console.log('- icon-512.png (512x512像素)');
  console.log('- favicon.ico (32x32像素)');
  console.log('\n图标设计建议：');
  console.log('- 主色：#4a6cf7（蓝色）');
  console.log('- 图标：盾牌+锁的组合');
  console.log('- 背景：透明或白色');
}
