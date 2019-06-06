const dogeSrc = "http://assets.stickpng.com/thumbs/5845e770fb0b0755fa99d7f4.png";
const cateSrc = "https://i.dlpng.com/static/png/262880_thumb.png";
const lazerSrc = "https://sitejerk.com/images/lightning-6.png";

const doge = new Image();
const catePool = [];
const numberOfSimultaneousCates = 5;
let lazerPool = [];

let currentRotation = 0;
const rotationSpeed = 5;
const cateAproachingSpeed = 2;
const lazerSpeed = 6;

let isLeftKeyPressed = false;
let isRightKeyPressed = false;
let isUpKeyPressed = false;
let isDownKeyPreseed = false;

const canvasElement =  document.getElementById('main');
const maxDistance = Math.max(canvasElement.offsetHeight, canvasElement.offsetWidth);

function init() {
  doge.src = dogeSrc;

  for(let i = 0; i < 5; ++i){
    catePool[i] = new Image();
    catePool[i].src = cateSrc;
    catePool[i].distance = maxDistance *  (1 + Math.random());
    catePool[i].angle = Math.random() * 360;
  }

  window.onkeydown = (event) => {
    if(event.key == 'ArrowRight') isRightKeyPressed = true;
    if(event.key == 'ArrowLeft') isLeftKeyPressed = true;
    if(event.key == 'ArrowUp') isUpKeyPressed = true;
    if(event.key == 'ArrowDown') isDownKeyPreseed = true;

    if(event.key == " ") {
      const newLazer = new Image();
      newLazer.src = lazerSrc;
      newLazer.distance = 0;
      newLazer.angle = currentRotation;
      lazerPool.push(newLazer);
    }

    console.log("Event key > #"+event.key+"#");
    console.log("Lazer pool > "+lazerPool.length);
  };
  
  window.onkeyup = (event) => {
    if(event.key == 'ArrowRight') isRightKeyPressed = false;
    if(event.key == 'ArrowLeft') isLeftKeyPressed = false;
    if(event.key == 'ArrowUp') isUpKeyPressed = false;
    if(event.key == 'ArrowDown') isDownKeyPreseed = false;
  };

  window.requestAnimationFrame(draw);
}

function draw(){
  //Calcular posición de doge :
  if(isRightKeyPressed){
    currentRotation -= rotationSpeed;
  }

  if(isLeftKeyPressed){
    currentRotation += rotationSpeed;
  }

  //Calcular posición de cates :
  catePool.forEach((cate)=>{
    cate.distance -= cateAproachingSpeed;
    if(cate.distance <= 0) cate.distance = 0;
  });

  //Calcular posición de lazers
  lazerPool.forEach((lazer)=>{
    lazer.distance += lazerSpeed;
  });
  lazerPool = lazerPool.filter(lazer => lazer.distance <= maxDistance);

  //Calcular cates alzancados por lazers
  lazerPool.forEach((lazer)=>{
    catePool.forEach((cate)=>{
      const posXCate = Math.cos(cate.angle * (2* Math.PI / 360)) * cate.distance;
      const posYCate = Math.sin(cate.angle * (2* Math.PI / 360)) * cate.distance;
      const posXLazer= Math.cos(lazer.angle * (2* Math.PI / 360)) * lazer.distance;
      const posYLazer= Math.sin(lazer.angle * (2* Math.PI / 360)) * lazer.distance;

      //Caja de colisión de cate
      if(posXCate - 50 < posXLazer &&
        posXCate + 50 > posXLazer &&
        posYCate -50 < posYLazer &&
        posYCate + 50 > posYLazer){
          //Si le damos a cate, reiniciar su posición fuera de la pantalla y permitir que vuelva a atacar
          cate.distance = maxDistance *  (1 + Math.random());
          cate.angle = Math.random() * 360;
        }
    })
  });

  const time = new Date();
  const canvas =canvasElement.getContext('2d');
  canvasElement.height = canvasElement.offsetHeight;
  canvasElement.width = canvasElement.offsetWidth;
  canvas.fillStyle = 'rgba(0, 255, 255, 1)';
  canvas.clearRect(0, 0, canvasElement.offsetWidth, canvasElement.offsetHeight);

  // Dibujar a doge
  canvas.translate(canvasElement.offsetWidth/2, canvasElement.offsetHeight/2);
  canvas.save();

  canvas.rotate((2 * Math.PI / 360) * currentRotation);
  canvas.drawImage(doge, -50, -50, 100, 100);
  canvas.restore();

  // Dibujar cates
  catePool.forEach((cate)=>{
    canvas.save();
    canvas.rotate((2 * Math.PI / 360) * cate.angle);
    canvas.translate(cate.distance, 0);
    canvas.drawImage(cate, -50, -50, 100, 100);
    canvas.restore();
  });

  // Dibujar lazers
  lazerPool.forEach((lazer)=>{
    canvas.save();
    canvas.rotate((2 * Math.PI / 360) * lazer.angle);
    canvas.translate(lazer.distance, 0);
    canvas.drawImage(lazer, -25, -25, 50, 50);
    canvas.restore();
  });

  window.requestAnimationFrame(draw);
}

window.requestAnimationFrame(init);