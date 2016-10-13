var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext("2d");

ctx.canvas.width  = 800;
ctx.canvas.height = 600;

// Images Globals

var gameTitle, mainTitle;

// Key Position Globals


var mouseX, mouseY;
var mouseDown = false;
var KeyLeft = false;
var KeyRight = false;
var Spacebar = false;

// Where in the game variable

var titlescreen = true;
var levelOne = false;

//Sprite animate global

var spritex = 0;
var onGround = true;

// Mouse position finder function

var getMousePos = function(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
};


var updateMousePos = function() {
	canvas.addEventListener('mousemove', function(evt) {
		var mousePos = getMousePos(canvas, evt);
		
		mouseX = mousePos.x;
		mouseY = mousePos.y;
		
	}, false);
};


var updateMouseClick = function() {
	canvas.addEventListener('mousedown', function(evt) {
	mouseDown = true;
		
	}, false);
	
	canvas.addEventListener('mouseup', function(evt) {
	mouseDown =  false;
		
	}, false);
}

// Key press event handlers
document.onkeydown = function(event){
    if(event.keyCode === 68) {
    	KeyRight = true;
    }    //d

    else if(event.keyCode === 65) {
    	KeyLeft = true;
    }	//a  

    else if(event.keyCode === 32 && onGround) {
    	Spacebar = true;
    	setTimeout(function(){Spacebar = false}, 500); 
    }	// Spacebar 

}


document.onkeyup = function(event){
    if(event.keyCode === 68) {
    	KeyRight = false;
    }    //d

    else if(event.keyCode === 65) {
    	KeyLeft = false
    }//a 
}

// Button Constructor
// Defaults to large buttons. Ofset is from the centre in pixels
function Button(buttonSrc, buttonWidth, Xofset, Yofset, origX, origY, buttonFunc, origButtonWidth = 185) {
	this.buttonWidth = buttonWidth;
	this.button = new Image();
	this.button.src = buttonSrc;
	this.origButtonWidth = origButtonWidth;
	this.origX = origX;
	this.origY = origY;
	this.Xofset = Xofset;
	this.Yofset = Yofset;
	this.x = canvas.width/2 - this.buttonWidth/2 + this.Xofset;
	this.y = canvas.height/2 - this.buttonWidth/2 + this.Yofset;

	this.drawButton = function() {
		if (mouseX > this.x && mouseX < this.x + this.buttonWidth && mouseY > this.y && mouseY < this.y + this.buttonWidth && mouseDown) {
			ctx.drawImage(this.button, this.origX + 390, this.origY, this.origButtonWidth, this.origButtonWidth, this.x, this.y, this.buttonWidth, this.buttonWidth);
			setTimeout(buttonFunc, 300);
		} else if (mouseX > this.x && mouseX < this.x + this.buttonWidth && mouseY > this.y && mouseY < this.y + this.buttonWidth) {
			ctx.drawImage(this.button, this.origX + 195, this.origY, this.origButtonWidth, this.origButtonWidth, this.x, this.y, this.buttonWidth, this.buttonWidth);
		} else  {
			ctx.drawImage(this.button, this.origX, this.origY, this.origButtonWidth, this.origButtonWidth, this.x, this.y, this.buttonWidth, this.buttonWidth);
		}
		
	};
};

// Background Constructor
function Background(backgroundSrc) {
	this.background = new Image();
	this.background.src = backgroundSrc;

	this.draw = function(x) {
		// Works for background width of 2000
		var xpos = x % 2000;
		ctx.drawImage(this.background, xpos, 0);
	}
}


function Knight() {
	this.sprite = new Image();
	this.sprite.src = 'img/Sprites/knight/knightidle.png';
	this.width = 588;
	this.widthx = 130*0.8;
	this.heighty = 165*0.8;
	this.jump = [0, 20, 20, 15, 10, 0, -10, -15, -20, -20];
	this.jumpspeed = 8;

	this.hp = 100;
	this.shield = 100;

	this.lookingleft = true;

	this.movementy = canvas.height - this.heighty - 50;
	this.movementx = 0;
	this.knightx = 0;

	// used for the sprite animation
	this.origX = [0, this.width, this.width*2, this.width*3, this.width*4, this.width*5, this.width*6, this.width*7, this.width*8, this.width*9];
	
	this.draw = function() {
		// substitutes x for movement x so movement continues to log even though the drawing is stopped mid page.
		ctx.drawImage(this.sprite, this.origX[spritex], 0, 520, 660, this.knightx, this.movementy, this.widthx, this.heighty);

		// Updates Knight x (knights relative position on the canvas)
		if (this.knightx >= canvas.width/2) {
			this.knightx = canvas.width/2;
		}

		//checks for movement and attack
		if (Spacebar) {
			onGround = false;
			this.movementy += -this.jumpspeed;
			if (this.lookingleft) {
				this.sprite.src = 'img/Sprites/knight/knightjump.png';
			} else {
				this.sprite.src = 'img/Sprites/knight/knightjumpmirror.png';
			}

		}
		if (KeyLeft) {
			this.sprite.src = 'img/Sprites/knight/knightrunmirror.png';
			this.movementx -= 5;
			this.knightx -= 5;
			this.lookingleft = false;
		} else if (KeyRight) {
			this.sprite.src = 'img/Sprites/knight/knightrun.png';
			this.movementx += 5;
			this.knightx += 5;
			this.lookingleft = true;
		} else if (this.lookingleft) {
			this.sprite.src = 'img/Sprites/knight/knightidle.png';
		} else {
			this.sprite.src = 'img/Sprites/knight/knightidlemirror.png';
		}

		// checks for gravity

		if (this.movementy < canvas.height - this.heighty - 50 && !Spacebar) {
			this.movementy += this.jumpspeed;
			onGround = false;
		} else {
			onGround = true;
		}

	};
}

function draw() {
	var backgroundRelativeMovement = (levelOneGame.knight.movementx / 4) * -1;

	if (titlescreen) {
		ctx.drawImage(gameTitle, 0, 0, canvas.width, canvas.height);
		ctx.drawImage(mainTitle, canvas.width/2 - 330, 100);

		var startButton = new Button('img/GUI/Button.png', 100, 0, canvas.height*0.3, 0, 620, moveToGame);
		var scoresButton = new Button('img/GUI/Button.png', 100, -150, canvas.height*0.3, 0, 4626, moveToGame);
		var settingsButton = new Button('img/GUI/Button.png', 100, 150, canvas.height*0.3, 0, 4823, moveToGame);

		startButton.drawButton();
		scoresButton.drawButton();
		settingsButton.drawButton();
	} else {
		levelOneGame.background.draw(backgroundRelativeMovement);
		levelOneGame.knight.draw();
		levelOneGame.healthbar.drawWrap();
		levelOneGame.healthbar.drawBar();
	}
}


function initGameTitle() {
	gameTitle = new Image();
	gameTitle.src = 'img/BG/title.jpg'; 

	mainTitle = new Image();
	mainTitle.src = 'img/Knightmare-Title.png';

}

var moveToGame = function() {
	titlescreen = false;
	levelOne = true;
}

function spriteanimate() {
	if (spritex >=9) {
		spritex = 0;
	} else {
		spritex++;
	}
}



var Bar = function() {
	this.barwrap = new Image();
	this.barwrap.src = 'img/GUI/Windows.png';

	this.drawWrap = function() {
		ctx.drawImage(this.barwrap, 3038, 3388, 520, 150, 0, 0, 260, 75);
	}
	this.drawBar = function() {
		ctx.drawImage(this.barwrap, 4152, 3382, 320, 60, 62, 16, 165, 30);
	}
}


var levelOneGame = {
	background: new Background('img/BG/BG1-roll.png'),
	knight: new Knight(),
	healthbar: new Bar()
}



function runGame() {
	updateMousePos();
	updateMouseClick();

	// Changes

	// Update

	// Draw
	draw();
}


$(document).ready(function(){

  	initGameTitle();

  	setInterval(runGame, 1000/60);
  	setInterval(spriteanimate, 100);

});