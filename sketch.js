
var player, box, x, y, blockx, blocky, moveY, moveX, dir;

var walls, objects, enemies;

var score, nballs, level;

var map, m;

var bg;

var go, is, es, scenes;

var catchSound;
function preload() {
	song = loadSound('assets/bgsong.mp3');
	
}

function setup() {
	catchSound = loadSound("assets/hit.mp3");
	song.setVolume(0.2);
	song.loop();
	bg = loadImage('assets/bg.png');
	var myCanvas = createCanvas(1000, 600);
	myCanvas.parent("finestrajoc");
	x=100;
	y=150;
	blockx=25;
	blocky=25;
	moveY=2;
	moveX=0;
	score = 0;
	nballs=0;
	level=1;
	m=0;
	go=0;

	walls = new Group();
	objects = new Group();
	enemies = new Group();
	scenes = new Group();

	map=loadJSON("map.json",drawMap);
 
  player = createSprite(75, 75);
	player.addAnimation('right', 'assets/sprite0.png', 'assets/sprite3.png');


	is = createSprite(500,300);
	is.addAnimation('normal','assets/intro.png');
	scenes.add(is);

	createEnemies();
}


function draw() {
	if(keyDown('ENTER')){
		go=1;
	}
	background(bg);

	if (score == nballs && score!=0){
		level+=1;
		player.position.x=75;
		player.position.y=75;
		for(var i=0; i < enemies.length; i++){
			enemies[i].remove();
		}
		drawObjects();
		createEnemies();
	}

  if(keyDown('w')){
		player.position.y-=5;
	}
	if(keyDown('a')){
		player.position.x-=5;
		player.mirrorX(-1);
	}	
  if(keyDown('s')){
		player.position.y+=5;	
	}	
  if(keyDown('d')){
		player.position.x+=5;
		player.mirrorX(1);
	}

  	player.collide(walls);
  	player.collide(objects,catchBall);
	enemies.collide(walls,changeDir);
	if(go!=0){
		player.collide(enemies,gameOver);
	}
	if(go==0){
		drawSprites(scenes);
		song.pause();
	}else{
		if(!song.isPlaying()){
			song.play();
		}

		for(var j=0; j < scenes.length; i++){
			scenes[j].remove();
		}
		drawSprites();
		textSize(50);
		fill(0);
		text('Score: '+str(score), 50, 42);
		text('Level: '+str(level),800, 42);
	}
	
	

}
  
  
function catchBall(spritea, spriteb){
	score+=1;	
	spriteb.remove();
	catchSound.play();
}
	
function changeDir(spritea, spriteb){
	dir = Math.floor(Math.random() * (0 - 4)) + 4;
	if(dir==0){
		spritea.setSpeed(5,0);
		spritea.mirrorX(1);
	}else if(dir == 1){
		spritea.setSpeed(5,90);
	}else if(dir == 2){
		spritea.setSpeed(5,180);
		spritea.mirrorX(-1);
	}else if(dir == 3){
		spritea.setSpeed(5,-90);
	}
}

function drawMap(m){
	blockx=25;
	blocky=25;
	for (var i = 0; i < 240; i++){
		if(map[i] == "x"){
			var newSprite = createSprite(blockx, blocky);
			newSprite.addAnimation('normal', 'assets/squarew.png');
			walls.add(newSprite);
		}else if(map[i] == "-"){
			var newObject = createSprite(blockx, blocky);
			newObject.addAnimation('normal', 'assets/ball.png');
			newObject.depth = 2;
			objects.add(newObject);
			nballs+=1;
		}
		blockx += 50;
		if ((i+1)%20 == 0 && i!=0){
		  blockx = 25;
		  blocky += 50;
		}   
	}

}

function drawObjects(){
	blockx=25;
	blocky=25;
	for (var j = 0; j < 240; j++){
		if(map[j] == "-"){
			var newObject = createSprite(blockx, blocky);
			newObject.addAnimation('normal', 'assets/ball.png');
			newObject.depth = 1;
			objects.add(newObject);
			nballs+=1;
		}
		blockx += 50;
		if ((j+1)%20 == 0 && j!=0){
		  blockx = 25;
		  blocky += 50;
		}   
	}
}

function createEnemies(){
	for (var ii = 0; ii < level; ii++){
		var enemy = createSprite(500, 300);
  	enemy.addAnimation('normal', 'assets/enemy0.png', 'assets/enemy3.png');
		enemy.depth = 10;
		enemy.setSpeed(3,90);
		enemies.add(enemy);
	}
}

function gameOver(){

	es = createSprite(500,300);
	es.addAnimation('normal','assets/gameOver.png');
	scenes.add(es);

	level = 0;
	score = 0;
	nballs = 0;
	player.position.x=75;
	player.position.y=75;
	
	for(var i=0; i < enemies.length; i++){
		enemies[i].remove();
	}
	for(var j=0; j < objects.length; i++){
		objects[j].remove();
	}
	drawObjects();
	createEnemies();
	level = 1;
	go=0;
}
