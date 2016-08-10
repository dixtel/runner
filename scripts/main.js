var ENGINE = {};

var timer1;
var score = 0;
function scoreTimer() {
	score++;
}

var timer2;
var spawnTime = 0;
function spawnTimer() {
	spawnTime += 0.1;
}

ENGINE.Gameover = {

	create: function() {
		this.bestScore = score;
	},

	step: function(dt) {
		this.gameOverText = "Game Over! Your score is " + score + ", the best score is " + this.bestScore; 
		if(this.bestScore < score) {
			this.bestScore = score;
			this.gameOverText = "Game Over! Your score is " + score + ", the best score is " + this.bestScore; 

		}

		if(this.app.keyboard.keys.up) {
			this.app.setState( ENGINE.Game );
		}
	},

	render: function() {
		this.app.layer.clear("black");
		this.app.layer.fillStyle("white");
		this.app.layer.font("13px Arial");
		this.app.layer.fillText(this.gameOverText, 13, 19 );
	}

};

ENGINE.Game = {

	enter: function() {
		score = 0;
		timer1 = setInterval(scoreTimer, 500);

		spawnTime = 0;
		timer2 = setInterval(spawnTimer, 100);

		this.player = new this.Player;
		this.ArrayObstacle = [];
		this.ArrayObstacle.push( new this.Obstacle );

		this.obstacleTimeSpawn = 2;
		this.obstacleSpeed = 100;

	},

	leave: function() {
		clearInterval(timer1);
		clearInterval(timer2);
	},

	create: function() {

		this.textScore;

		this.Player = function() {
			this.width = 20,
			this.height = 40,
			this.color = "white",
	
			this.isJump = false,
			this.onGround = true,

			this.yMaxJump = 320,
			this.yAcceleration = 15,
			this.yVelocity = 0,

			this.gravity = 15,

			this.x = 40,
			this.y = app.height - this.height
		};

		this.Obstacle = function() {
			this.width = 10,
			this.height = 20,

			this.color = "white",

			this.x = app.width,
			this.y = app.height - this.height
		};


		this.gameOver = false;
	},

	step: function(dt) {
		var Player = this.player;

		// control
		if(this.app.keyboard.keys.up && Player.onGround) {
			Player.isJump = true;
			Player.onGround = false;
			Player.yVelocity = -Player.yMaxJump; 
			Player.color = "red";
		}

		// move
		if(Player.isJump) {	
			Player.yVelocity += Player.yAcceleration;

			if(Player.yVelocity >= 0) {
				Player.isJump = false;
				Player.yVelocity = 0;
			}
		} else {
			Player.yVelocity += Player.gravity;
		}
		// logic

		if(spawnTime >= this.obstacleTimeSpawn) {
			this.ArrayObstacle.push(new this.Obstacle );
		}

		for (var i = 0; i < this.ArrayObstacle.length; i++) {
			this.ArrayObstacle[i].x -= this.obstacleSpeed * dt;
		}

		for (var i = 0; i < this.ArrayObstacle.length; i++) {
			if(this.ArrayObstacle[i].x <= -Player.width) this.ArrayObstacle.shift();
		}

		if(spawnTime >= this.obstacleTimeSpawn) {
			clearInterval(timer2);
			spawnTime = 0;
			timer2 = setInterval(spawnTimer, 100);
		}

		this.obstacleTimeSpawn -= 0.0002;
		this.obstacleSpeed += 0.05;


		// finish calculate
		Player.y += Player.yVelocity * dt;

		// colission
		if((Player.y + Player.height + 1) > this.app.height) {
			Player.y = this.app.layer.height - Player.height;
			Player.yVelocity = 0;
			Player.onGround = true;
			Player.color = "white";
		}

		for (var i = 0; i < this.ArrayObstacle.length; i++) {
			var obstacle = this.ArrayObstacle[i];

			if(	Player.x + Player.width  > obstacle.x && 
				Player.x + Player.width < obstacle.x + obstacle.width &&
				Player.y + Player.height > obstacle.y &&
				Player.y + Player.height - 1 < obstacle.y + obstacle.height ) {
				this.gameOver = true;
			}

			if(	Player.x > obstacle.x && 
				Player.x < obstacle.x + obstacle.width &&
				Player.y + Player.height > obstacle.y &&
				Player.y + Player.height - 1 < obstacle.y + obstacle.height ) {
				this.gameOver = true;
			}
		}

		if(this.gameOver == true) {
			this.gameOver = false;
			this.app.setState( ENGINE.Gameover );
		}

		if(this.seconds == this.obstacleTimeSpawn) this.seconds = 0;

		this.textScore = score 

	},

	render: function(dt) {
		var Player = this.player;

		this.app.layer.clear("black");

		this.app.layer.fillStyle("white");
		this.app.layer.font("15px Arial");

		this.app.layer.fillText(this.textScore ,200, 19);

		this.app.layer.fillStyle(Player.color);
		this.app.layer.fillRect(Player.x, Player.y, Player.width, Player.height);

		// obstacle
		for (var i = 0; i < this.ArrayObstacle.length; i++) {
			this.app.layer.fillStyle(this.ArrayObstacle[i].color);

			var width = this.ArrayObstacle[i].width;
			var height = this.ArrayObstacle[i].height

			var x = this.ArrayObstacle[i].x
			var y = this.ArrayObstacle[i].y

			this.app.layer.fillRect(x, y, width, height)
		}
	}

};

var app = playground ({

	width: 300,
	height: 150,
	scale: 2,
	smo0thing: false,

	ready: function() {
		this.setState( ENGINE.Game );
	},

});