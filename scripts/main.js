var ENGINE = {};


ENGINE.Gameover = {

	create: function() {
		this.app.layer.font("10px Arial");
		this.text = "Game Over!"
	},

	step: function(dt) {
		console.log("test1");
	},

	render: function(dt) {
		this.app.layer.clear("black");
		this.app.layer.fillStyle("white");
		this.app.layer.fillText(this.text, this.app.width - (this.app.width / 2), this.app.height - (this.app.height/2));
	}

};

ENGINE.Game = {
	create: function() {

		this.text;
		this.app = app;

		this.Player = {
			width: 20,
			height: 40,
			color: "white",
	
			isJump: false,
			onGround: true,

			yMaxJump: 370,
			yAcceleration: 44,
			yVelocity: 0,

			gravity: 35,

			x: 20,
			y: 20
		};

		this.ArrayObstacle = [];
		this.obstacleTimeSpawn = 50;
		this.obstacleSpeed = 100;
		this.Obstacle = function() {
			this.width = 10,
			this.height = 20,

			this.color = "white",

			this.x = app.width,
			this.y = app.height - this.height
		};

		this.seconds = 0;
		this.score = 0;
		this.gameOver = false;

		this.ArrayObstacle.push( new this.Obstacle );
	},

	step: function(dt) {
		var Player = this.Player;

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

		this.seconds++;
		this.score++;

		if(this.seconds >= this.obstacleTimeSpawn) {
			this.ArrayObstacle.push(new this.Obstacle );
		}

		for (var i = 0; i < this.ArrayObstacle.length; i++) {
			this.ArrayObstacle[i].x -= this.obstacleSpeed * dt;
		}

		for (var i = 0; i < this.ArrayObstacle.length; i++) {
			if(this.ArrayObstacle[i].x <= -Player.width) this.ArrayObstacle.shift();
		}


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
			this.app.setState( ENGINE.Gameover );
		}

		if(this.seconds == this.obstacleTimeSpawn) this.seconds = 0;

		this.text = "pv:" + Player.yVelocity + 
					" dt:" + dt + 
					" s:" + this.seconds + 
					" s:" + this.score / 10 +
					" arrobst:" + this.ArrayObstacle.length;
	},

	render: function(dt) {
		var Player = this.Player;

		this.app.layer.clear("black");

		this.app.layer.fillStyle("white");
		this.app.layer.font("10px Arial");
		this.app.layer.fillText(this.text ,0 , 10);

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

var app = new PLAYGROUND.Application ({

	width: 300,
	height: 150,
	scale: 2,
	smo0thing: false,

	ready: function() {
		this.setState( ENGINE.Game );
	},

});