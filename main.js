(function() {
	// get canvas and context
	var canvas = document.getElementById('play');
	var context = canvas.getContext('2d');

	// get canvas mouse event coordinates
	function relMouseCoords(event){
		var totalOffsetX = 0;
		var totalOffsetY = 0;
		var canvasX = 0;
		var canvasY = 0;
		var currentElement = this;

		do {
			totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
			totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
		}
		while(currentElement = currentElement.offsetParent)

		canvasX = event.pageX - totalOffsetX;
		canvasY = event.pageY - totalOffsetY;

		return {x:canvasX, y:canvasY};
	}
	HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;
	
	// setup the game board
	setupBoard();
	// declare game variables
	var turnOfPlayer, numberOfTurns, cellArray, gameOver;
	// give game variables values
	gameInit();

	canvas.addEventListener('click', function(e) {
		// get coords of click on canvas
		var coords = canvas.relMouseCoords(e);
		// turn canvas coords to cell coords in multiples of 100
		var cellCoords = {
			x: Math.ceil(coords.x / 100) * 100,
			y: Math.ceil(coords.y / 100) * 100
		}

		/*  if gameOver = false and cell is not empty then execute 
			marks the symbol of player then pushes cell coordinates to cellArray
			then changes turn of player. Also checks if win only if there have been atleast 5 turns played

			if gameOver = true, resets the game
		*/
		if(!gameOver && checkCellEmpty([cellCoords.x, cellCoords.y])) {
			if(turnOfPlayer === 'X') {
				markX(cellCoords.x, cellCoords.y);
				cellArray.push([cellCoords.x, cellCoords.y, 'X']);
				numberOfTurns++;
				turnOfPlayer = 'O';
				if(numberOfTurns >= 5) {
					if(checkWin([cellCoords.x, cellCoords.y, 'X'])) {
						console.log('X wins');
						gameOver = true;
					}
				}
			} else if(turnOfPlayer === 'O') {
				markO(cellCoords.x, cellCoords.y);
				cellArray.push([cellCoords.x, cellCoords.y, 'O']);
				numberOfTurns++;
				turnOfPlayer = 'X';
				if(numberOfTurns >= 5) {
					if(checkWin([cellCoords.x, cellCoords.y, 'O'])) {
						console.log('O wins');
						gameOver = true;
					}
				}
			}
		} else if(gameOver || numberOfTurns === 9) {
			reset();
		}
	});

	// create the board
	function setupBoard() {
		context.beginPath();
		context.moveTo(100, 000);
		context.lineTo(100, 300);
		context.moveTo(200, 000);
		context.lineTo(200, 300);
		context.moveTo(000, 100);
		context.lineTo(300, 100);
		context.moveTo(000, 200);
		context.lineTo(300, 200);
		context.closePath();
		context.lineWidth = 1;
		context.strokeStyle = '#000000';
		context.stroke();
	}

	function gameInit() {
		// game begins with turn of player X
		turnOfPlayer = 'X';
		// number of turns already happened
		numberOfTurns = 0;
		// array in which coords of cells are stored
		cellArray = [];
		// has game ended?
		gameOver = false;
	}

	function reset() {
		context.clearRect(0, 0, 300, 300);
		setupBoard();
		gameInit();
	}

	/* checks if there is win by first checking horizontally then vertically then diagonally */
	function checkWin(playerArray) {
		var xCount = 0;
		var yCount = 0;
		var leftDiag = 0;
		var rightDiag = 0;
		for(var i = 0; i < cellArray.length; i++) {
			// y axis doesn't change position
			if(playerArray[1] === cellArray[i][1] && playerArray[2] === cellArray[i][2]) xCount++;
			if(xCount === 3) {
				context.beginPath();
				context.moveTo(0, playerArray[1] - 50);
				context.lineTo(300, playerArray[1] - 50);
				context.closePath();
				context.lineWidth = 8;
				context.strokeStyle = '#333333';
				context.stroke();
				return true;
			}
			// x axis doen't change position
			if(playerArray[0] === cellArray[i][0] && playerArray[2] === cellArray[i][2]) yCount++;
			if(yCount === 3) {
				context.beginPath();
				context.moveTo(playerArray[0] - 50, 0);
				context.lineTo(playerArray[0] - 50, 300);
				context.closePath();
				context.lineWidth = 8;
				context.strokeStyle = '#333333';
				context.stroke();
				return true;
			}
			// top-left diagonal has x = y
			if(playerArray[0] === playerArray[1]) {
				// first check if player is same then hardcoded comparisions
				if(playerArray[2] === cellArray[i][2] && ((cellArray[i][0] === 100 && cellArray[i][1] === 100) || (cellArray[i][0] === 200 && cellArray[i][1] === 200) || (cellArray[i][0] === 300 && cellArray[i][1] === 300))) {
					leftDiag++;
				}
			}
			if(leftDiag === 3) {
				context.beginPath();
				context.moveTo(0, 0);
				context.lineTo(300, 300);
				context.closePath();
				context.lineWidth = 8;
				context.strokeStyle = '#333333';
				context.stroke();
				return true;
			}
			// top-right diagonal has x - y = 200 or -200
			// special check for (2, 2) cell
			if(Math.abs(playerArray[0] - playerArray[1]) === 200 || playerArray[0] === playerArray[1]) {
				// first check if player is same then harcoded comparisions
				if(playerArray[2] === cellArray[i][2] && ((cellArray[i][0] === 300 && cellArray[i][1] === 100) || (cellArray[i][0] === 200 && cellArray[i][1] === 200) || (cellArray[i][0] === 100 && cellArray[i][1] === 300))) {
					rightDiag++;
				}
			}
			if(rightDiag === 3) {
				context.beginPath();
				context.moveTo(300, 0);
				context.lineTo(0, 300);
				context.closePath();
				context.lineWidth = 8;
				context.strokeStyle = '#333333';
				context.stroke();
				return true;
			}
		}
		return false;
	}

	/* check if given x and y positions have not already been filled i.e. contained inside cellArray */
	function checkCellEmpty(coordsArray) {
		for(var i = 0; i < cellArray.length; i++) {
			if(coordsArray[0] === cellArray[i][0] && coordsArray[1] === cellArray[i][1]) return false;
		}
		return true;
	} 

	function markX(x, y) {
		context.beginPath();
		context.moveTo(x - 90, y - 90);
		context.lineTo(x - 10, y - 10);
		context.moveTo(x - 90, y - 10);
		context.lineTo(x - 10, y - 90);
		context.closePath();
		context.lineWidth = 7;
		context.strokeStyle = '#FF3535';
		context.stroke();
	}

	function markO(x, y) {
		context.beginPath();
		context.arc(x - 50, y - 50, 40, 0, 2 * Math.PI);
		context.closePath();
		context.lineWidth = 7;
		context.strokeStyle = '#5093E4';
		context.stroke();
	}
})()