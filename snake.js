var s;
var w = 20;
var food;
var direction;
var highScore = 0;

function setup(){
	createCanvas(560,560);
	s = new Snake();
	pickLocation(); // set food location
	direction = createVector(1,0); // set default direction of travel
}

function draw(){
	frameRate(10);
	background(51);
	
	// draw food
	fill(255,0,100);
	rect(food.x,food.y,w,w);
	
	// move and show snake
	s.death();
	s.update();
	s.show();
	
	if(s.total >= highScore){
		highScore = s.total;
	}
	// create new food if food is eaten
	if(s.eat(food)){
		pickLocation();
	}
	fill(255,255,255,100);
	stroke(0);
	textSize(20);
	textStyle(BOLD);
	textAlign(RIGHT);
	text("Score: " + s.total,width-30,50);
	text("Best: " + highScore, width-30,100);
}

function pickLocation(){
	// pick a random column and row based on square size (w)
	var cols = floor(width/w);
	var rows = floor(height/w);
	food = createVector(floor(random(cols)),floor(random(rows)));
	food.mult(w);
}
function Snake(){
	this.x = 0;
	this.y = 0;
	this.xspeed = 1;
	this.yspeed = 0;
	this.total = 0;
	this.tail = [];
	
	this.update = function(){
		// haven't eaten food, shift tail vector
		if(this.total === this.tail.length){
			for (var i = 0; i<this.total-1; i++){
				this.tail[i] = this.tail[i+1];
			}
		}
		// add current position to end of list
		this.tail[this.total-1] = createVector(this.x,this.y);
		
		// get speed from direction
		this.dir(direction);
		
		// move according to specified speed
		this.x = this.x + this.xspeed*w;
		this.y = this.y + this.yspeed*w;
		
		// don't move beyond canvas
		this.x = constrain(this.x,0,width-w);
		this.y = constrain(this.y,0,height-w);
	}
	
	this.show = function(){
		// draw snake
		fill(255);
		stroke(0);
		
		// tail
		for (var i =0; i<this.total; i++){
			rect(this.tail[i].x, this.tail[i].y,w,w);
		}
		// head
		rect(this.x,this.y,w,w);
	}
	
	// set direction of snake
	this.dir = function(direction){
		// don't set new direction if it's opposite
		if(this.xspeed+direction.x){
			this.xspeed = direction.x;
		}
		if(this.yspeed+direction.y){
			this.yspeed = direction.y;
		}
	}
	
	// consume food and grow if head overlaps food
	this.eat = function(pos){
		var d = dist(this.x,this.y,pos.x,pos.y);
		if (d<1){
			this.total++;
			return true;
		}else{
			return false;
		}
	}
	
	// lose tail if head intersects body (or a wall)
	this.death = function(){
		for(var i=0; i<this.tail.length; i++){
			var pos = this.tail[i];
			var d = dist(this.x,this.y,pos.x,pos.y);
			if(d<1){
				this.total = 0;
				this.tail = [];
				//console.log(this.tail)
			}
		}
	}
}

// set directions
function keyPressed(){
	if(keyCode===UP_ARROW){
		direction.set(0,-1);
	}else if(keyCode === DOWN_ARROW){
		direction.set(0,1);
	}else if(keyCode === LEFT_ARROW){
		direction.set(-1,0);
	}else if(keyCode === RIGHT_ARROW){
		direction.set(1,0);
	}else if(key == ' '){
		s.total++;
	}
}