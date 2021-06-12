var trex, trexRunning, trexEnd;
var ground, groundImage, invGround;
var cloud, cloudImage;
var ob1, ob2, ob3, ob4, ob5, ob6, ob;
var cloudGroup, obsGroup;
var PLAY = 1;
var END = 0;
var gamestate = PLAY;
var score = 0;
var gameOver, restart, overImg, reImg;
var bg, die, jump, sunny;

//loading animation for images and sounds 
function preload() {
  trexRunning = loadAnimation("trex_1.png", "trex_2.png", "trex_3.png");
  groundImage = loadImage("ground.png");
  cloudImage = loadImage("cloud.png");
  ob1 = loadImage("obstacle1.png");
  ob2 = loadImage("obstacle2.png");
  trexEnd = loadAnimation("trex_collided.png");
  reImg = loadImage("restart.png");
  overImg = loadImage("gameOver.png");
  die = loadSound("collided.wav");
  jump = loadSound("jump.wav");
  bg = loadImage("backgroundImg.png");
  sunny = loadImage("sun.png");

}

//creating sprites & etc.
function setup() {
  //create objects
  createCanvas(windowWidth, windowHeight);
  trex = createSprite(50, height - 120, 50, 20);
  ground = createSprite(width / 2, height, width, 20);
  invGround = createSprite(width / 2, height - 70, width, 20);
  restart = createSprite(width / 2, height / 2);
  gameOver = createSprite(width / 2, (height / 2) - 50);
  sun = createSprite(width-50, 100, 10,10);
  sun.addImage(sunny);
  sun.scale = 0.1;

  //set visibility to false at least temporarily
  restart.visible = false;
  gameOver.visible = false;
  restart.addImage(reImg);
  gameOver.addImage(overImg);
  restart.scale = 0.1;

  invGround.visible = false;

  //make animations/addImages/scale
  trex.addAnimation("tr", trexRunning);
  ground.addImage(groundImage);
  trex.addAnimation("end", trexEnd);
  trex.depth = invGround.depth + 5;
  cloudGroup = new Group();
  obsGroup = new Group();

}

function draw() {

  //set background color 
  background(bg);
  
  trex.collide(invGround);
  trex.scale = 0.08;

  if (gamestate == 1) {
    //make the ground move backwards
    ground.velocityX = -(5 + 3 * score / 100);

    //make infinite ground
    if (ground.x < 0) {
      ground.x = (ground.width / 2);
    }

    //framecount code to display clouds/obstacles/etc. at certain intervals
    if (frameCount % 60 == 0) {
      cloudSpawn();

    }

    if (frameCount % 120 == 0) {
      obstacle();
    }

    //make t-rex jump
    if (touches.length > 0 || keyDown("space") && (trex.y > height - 100)) {
      trex.velocityY = -10;
      jump.play();
      touches = [];
    }


    trex.velocityY += 0.5;

    /*
    if (trex.isTouching(obsGroup)) {
      trex.velocityY = -10;
      jump.play();

    }
    */
    if (trex.isTouching(obsGroup)) {
      gamestate = 0;
      die.play();
    }

    trex.debug = true;
    trex.setCollider("circle", 0, 0, 60);
    //trex.setCollider("rectangle", 0,0, 300, trex.height);
    score = score + Math.round(frameCount / 60);

  }

  else if (gamestate == 0) {
    //make the ground stop
    ground.velocityX = 0;
    trex.velocityY = 0;
    obsGroup.setVelocityXEach(0);
    cloudGroup.setVelocityXEach(0);
    trex.changeAnimation("end", trexEnd);
    cloudGroup.setLifetimeEach(-2)
    obsGroup.setLifetimeEach(-2)
    restart.visible = true;
    gameOver.visible = true;

    if (mousePressedOver(restart)) {
      gameRestart();
    }
  }



  // Make text for score display
  text("Score : " + score, width-100, 30)


  drawSprites();
}

//clouds made
function cloudSpawn() {
  cloud = createSprite(width, height-300, 40, 10);
  cloud.velocityX = -(5 + score / 100);
  cloud.y = Math.round(random(40, 60));
  cloud.addImage(cloudImage);
  cloud.depth = trex.depth;
  trex.depth += 1;
  cloud.lifetime = 200;
  cloudGroup.add(cloud);
}


//obstacles are made
function obstacle() {
  var rand = Math.round(random(1, 2));
  ob = createSprite(width, height-95, 10, 50);
  ob.scale = 0.5;
  ob.velocityX = -(5 + (3 * score / 120));
  ob.lifetime = -(width/ob.velocityX);
  switch (rand) {
    case 1:
      ob.addImage(ob1);
      break;
    case 2:
      ob.addImage(ob2);
      break;
  }
  obsGroup.add(ob);

}

function gameRestart() {
  gamestate = PLAY;
  score = 0;
  cloudGroup.destroyEach();
  obsGroup.destroyEach();
  trex.changeAnimation("tr", trexRunning);
  gameOver.visible = false;
  restart.visible = false;
}