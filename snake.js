goog.provide('Snake');
goog.provide('Snake.Coordinates');

goog.require('goog.array');
goog.require('goog.date');
goog.require('goog.dom');
goog.require('goog.dom.forms');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.object');
goog.require('goog.style');

/**
 * The size of the snake and gem squares.
 *
 * @const
 * @private
 */
var SQUARE_SIZE = 20;

/**
 * Create a snake game object.
 *
 * @constructor
 */
Snake = function() {
  this.setSnakePieceImages_();

  //speed of snake in moves per second
  this.snakeSpeed = 0;
  this.gameOver = true;
  this.gamePaused = false;
  this.appendPieceToSnake = false;
  this.counter = 0;
  this.snakeLength = 0;
  this.currentDirection = Snake.Direction.RIGHT;
  this.previousDirection = Snake.Direction.RIGHT;
  this.snakeQueue = [];
  this.snakeHeadID = -1;
  this.maxCoords = {
    'x': 0,
    'y': 0
  };
  this.gemCoords = {
    'x': 0,
    'y': 0
  };

  // Used for loading/saving game.
  this.saveGameVariables = {};

  // Listen for key down events.
  goog.events.listen(document, goog.events.EventType.KEYDOWN, this.handleKeyEvent, false, this);
};

Snake.Direction = {
  'UP': 0,
  'DOWN': 1,
  'LEFT': 2,
  'RIGHT': 3
};

/**
 * Determines which snake piece images to use based on the current date.
 */
Snake.prototype.setSnakePieceImages_ = function() {
  var now = new goog.date.Date();
  // TODO: Decide on an image format. Preferably png.
  switch(now.getMonth()) {
    case goog.date.month.OCT:
      this.headUrl = "url('images/head_halloween.png')";
      this.bodyUrl = "url('images/body_halloween.gif')";
      this.gemUrl = "url('images/gem_halloween.png')";
      break;
    case goog.date.month.NOV:
      this.headUrl = "url('images/head_turkey.png')";
      this.bodyUrl = "url('images/body_turkey.png')";
      this.gemUrl = "url('images/gem_turkey.png')";
      break;
    case goog.date.month.DEC:
      this.headUrl = "url('images/head_christmas.png')";
      this.bodyUrl = "url('images/body_christmas.png')";
      this.gemUrl = "url('images/gem_christmas.png')";
      break;
    default:
      this.headUrl = "url('images/head_default.jpg')";
      this.bodyUrl = "url('images/body_default.jpg')";
      this.gemUrl = "url('images/gem_default.png')";
      break;
  }
};

/**
 * Handles the snake game's key events, such as moving the snake with
 * directional arrows or using keyboard shortcuts to start new game.
 *
 * @param {Object} evt The key event.
 * @private
 */
Snake.prototype.handleKeyEvent = function(evt) {
  if (evt) {
    switch (evt.keyCode) {
      case 37:
        if (!this.gamePaused && this.previousDirection != Snake.Direction.RIGHT) {
          this.currentDirection = Snake.Direction.LEFT;
        }
        break;    
      case 38:
        if (!this.gamePaused && this.previousDirection != Snake.Direction.DOWN) {
          this.currentDirection = Snake.Direction.UP;
        }
        break;    
      case 39:
        if (!this.gamePaused && this.previousDirection != Snake.Direction.LEFT) {
          this.currentDirection = Snake.Direction.RIGHT;
        }
        break;    
      case 40:
        if (!this.gamePaused && this.previousDirection != Snake.Direction.UP) {
          this.currentDirection = Snake.Direction.DOWN;
        }
        break;
        
      case 32: // space bar, pause game
        this.pauseGame();
        break;
      case 76: // 'l' key, load game
        this.loadGame();
        break;
      case 78: // 'n' key, new game
        if (this.gameOver) {
          this.init();
        }
        break;
      case 83: // 's' key, save game
        this.saveGame();
        break;
     }
  }
};

/**
 * Initializes a new snake game.
 */
Snake.prototype.init = function() {
  //reset variables
  goog.dom.getElement('finalScore').style.display = 'none';

  // Hold a reference to the game board div and snake speed form,
  // as they're used often.
  this.gameBoardDiv = goog.dom.getElement('gameBoard');
  this.gameBoardSize = goog.style.getContentBoxSize(this.gameBoardDiv);
  this.snakeSpeedForm =
      /** @type {HTMLFormElement} */ (goog.dom.getElement('snakeSpeedForm'));
  
  this.gameOver = false;
  this.gamePaused = false;
  this.counter = 0;
  this.snakeLength = 0;
  this.currentDirection = Snake.Direction.RIGHT;
  this.snakeQueue = new Array();
  this.snakeHeadID = -1;
  this.snakeSpeed = goog.dom.forms.getValueByName(this.snakeSpeedForm, 'snakeSpeed');

  // Disable form.
  goog.dom.forms.setDisabled(this.snakeSpeedForm, true);

  goog.dom.getElement('counter').innerHTML = this.counter;
  this.createGameBoard_();
  //this.gameBoardDiv.innerHTML = "";
  
  // TODO: Probably better to not create the gem piece in code.
  var gemPieceDiv = goog.dom.createElement('div');
  gemPieceDiv.id = 'gemPiece';
  gemPieceDiv.className = 'gem-piece';
  gemPieceDiv.style.backgroundImage = this.gemUrl;
  goog.dom.appendChild(this.gameBoardDiv, gemPieceDiv);
  this.setGemPiece();

  var size = goog.style.getContentBoxSize(this.gameBoardDiv);
  this.maxCoords.y = Math.floor(size.height / SQUARE_SIZE) - 1;
  this.maxCoords.x = Math.floor(size.width / SQUARE_SIZE) - 1;
  var yCoord = Math.floor (this.maxCoords.y / 2);
  var xCoord = Math.floor (this.maxCoords.x / 2);
  
  //create first snake piece
  var snakePieceDiv = goog.dom.createElement('div');
  snakePieceDiv.id = 'snakePiece' + (++this.snakeLength);
  snakePieceDiv.className = 'snake-piece';
  snakePieceDiv.style.top = SQUARE_SIZE * yCoord;
  snakePieceDiv.style.left = SQUARE_SIZE * xCoord;
  snakePieceDiv.style.backgroundImage = this.headUrl;
  goog.dom.appendChild(this.gameBoardDiv, snakePieceDiv);
  
  this.snakeHeadID = this.snakeLength;
  //add first piece to queue
  this.snakeQueue.push(new Snake.Coordinates(this.snakeLength, xCoord, yCoord));
  this.move();
};

Snake.prototype.createGameBoard_ = function() {
  // First clear game board.
  this.gameBoardDiv.innerHTML = "";

  var height = Math.floor(this.gameBoardSize.height / SQUARE_SIZE);
  var width = Math.floor(this.gameBoardSize.width / SQUARE_SIZE);

  var gamePieceRow, gamePieceDiv;
  for (var i = 0; i < height; i++) {
    gamePieceRow = goog.dom.createElement('div');
    gamePieceRow.id = 'row' + i;
    gamePieceRow.style.display = 'block';
    for (var j = 0; j < width; j++) {
      // Create a div to hold a game piece.
      gamePieceDiv = goog.dom.createElement('div');
      gamePieceDiv.id = 'spot' + i + '-' + j;
      gamePieceDiv.style.width = SQUARE_SIZE;
      gamePieceDiv.style.height = SQUARE_SIZE;
      gamePieceDiv.style.display = 'inline-block';
      //gamePieceDiv.style.backgroundImage = this.gemUrl;
      //gamePieceDiv.className = '';
      goog.dom.appendChild(gamePieceRow, gamePieceDiv);
    }
    goog.dom.appendChild(this.gameBoardDiv, gamePieceRow);
  }
};

/**
 * Set's a new gem piece. If x and y coordinates are provided,
 * set those coordinates.  Otherwise, choose random coordinates.
 *
 * @param {number=} xCoord opt_value The gem's x-coordinate (optional).
 * @param {number=} yCoord opt_value The gem's y-coordinate (optional).
 * @private
 */
Snake.prototype.setGemPiece = function(xCoord, yCoord) {
  if (!this.gameBoardSize) {
    // getting size is expensive - perform operation once and store results.
    this.gameBoardSize = goog.style.getContentBoxSize(this.gameBoardDiv);
  }

  var height = Math.floor(this.gameBoardSize.height / SQUARE_SIZE);
  var width = Math.floor(this.gameBoardSize.width / SQUARE_SIZE);
  
  //Make sure gem piece is not set on a piece of snake.
  var randXCoord = xCoord || Math.floor(Math.random()*width);
  var randYCoord = yCoord || Math.floor(Math.random()*height);
  while (!this.areGemCoordinatesValid(randXCoord, randYCoord)) {
    randXCoord = Math.floor(Math.random()*width);
    randYCoord = Math.floor(Math.random()*height);
  }
  //adding gem coordinates
  this.gemCoords.x = randXCoord;
  this.gemCoords.y = randYCoord;
  
  var randHeight = randYCoord * SQUARE_SIZE;
  var randWidth = randXCoord * SQUARE_SIZE;

  var gemDiv = goog.dom.getElement('gemPiece');
  gemDiv.style.marginTop = randHeight;
  gemDiv.style.marginLeft = randWidth;
};

/**
 * Pauses the snake game.
 */
Snake.prototype.pauseGame = function() {
  // If game is over, ignore pause.
  if (this.gameOver) {
    return;
  }
  
  var pauseButton = goog.dom.getElement('pauseButton');
  if (this.gamePaused) {
    this.gamePaused = false;
    if (pauseButton) {
      pauseButton.value = "Pause";
    }
    goog.dom.getElement('pauseGameOverlay').style.display = "none";
    setTimeout('snake.move()', 1000/this.snakeSpeed);
  } else {
    this.gamePaused = true;
    if (pauseButton) {
      pauseButton.value = "Resume";
    }
    goog.dom.getElement('pauseGameOverlay').style.display = "block";
  }
};

/**
 * Represents a piece of the snake.
 * @param {number} id The id of the snake piece.
 * @param {number=} xCoord The piece's x-coordinate.
 * @param {number=} yCoord The piece's y-coordinate.
 * @constructor
 * @private
 */
Snake.Coordinates = function(id, xCoord, yCoord) {
  this.id = id;
  this.xCoord = xCoord || -1;
  this.yCoord = yCoord || -1;
};

/**
 * Gets the specific snake piece given the piece's id.
 *
 * @param {number} id The id of the coordinates.
 * @return {Snake.Coordinates} The snake piece.
 * @private
 */
Snake.prototype.getCoordinates = function(id) {
  return goog.array.find(this.snakeQueue, function(coordsEntry) {
    if (coordsEntry.id == id) {
      return true;
    } else {
      return false;
    }
  });
};

/**
 * Determines if the given coordinates are valid for a gem spot. Coordinates
 * can be invalid if they overlap a piece of the snake.
 *
 * @param {number} xCoord The gem's x-coordinate.
 * @param {number} yCoord The gem's y-coordinate.
 * @return {boolean} Whether or not the gem's coordinates are valid.
 * @private
 */
Snake.prototype.areGemCoordinatesValid = function(xCoord, yCoord) {
  // Coordinates are valid if they don't overlap a part of the snake.
  var coordinates = goog.array.find(this.snakeQueue, function(coordsEntry) {
    if (coordsEntry.xCoord == xCoord && coordsEntry.yCoord == yCoord) {
      return true;
    } else {
      return false;
    }
  });
  return (coordinates == null);
};

/**
 * Checks if the snake went out of bounds or ran into itself.
 *
 * @param {Snake.Coordinates} oldHeadCoordinates The coordinates of
 *     the snake's old head.
 * @return {boolean} Whether or not the game is over.
 * @private
 */
Snake.prototype.isGameOver = function(oldHeadCoordinates) {
  var gameOver = false;
  
  // Test that coordinates are within game board.
  switch (this.currentDirection) {
    case Snake.Direction.LEFT:
      gameOver = (oldHeadCoordinates.xCoord <= 0);
      break;
    case Snake.Direction.UP:
      gameOver = (oldHeadCoordinates.yCoord <= 0);
      break;
    case Snake.Direction.RIGHT:
      gameOver = (oldHeadCoordinates.xCoord >= this.maxCoords.x);
      break;
    case Snake.Direction.DOWN:
      gameOver = (oldHeadCoordinates.yCoord >= this.maxCoords.y);
      break;
  }

  if (!gameOver) {
    // Test that snake doesn't overlap.
    var coordinates = goog.array.find(this.snakeQueue, function(coordsEntry) {
      if (coordsEntry.xCoord == oldHeadCoordinates.xCoord &&
          coordsEntry.yCoord == oldHeadCoordinates.yCoord &&
          coordsEntry.id != oldHeadCoordinates.id) {
        return true;
      } else {
        return false;
      }
    });
    if (coordinates) {
      gameOver = true;
    }
  }
  
  return gameOver;
};

/**
 * Moves the snake 1 position in the current direction.
 */
Snake.prototype.move = function() {
  // If game is paused, don't move.
  if (this.gamePaused) {
    return;
  }
  
  var oldHead = this.getCoordinates(this.snakeHeadID);
  this.gameOver = this.isGameOver(oldHead);
  if (this.gameOver) {
    var finalScoreNumDiv = goog.dom.getElement('finalScoreNum');
    finalScoreNumDiv.innerHTML = this.counter;
    var finalScoreDiv = goog.dom.getElement('finalScore');
    finalScoreDiv.style.display = 'inline';
    
    // Enable form.
    goog.dom.forms.setDisabled(this.snakeSpeedForm, false);

    var previousScoresTextDiv = goog.dom.createElement('div');
    previousScoresTextDiv.className = 'previous-scores-text';
    previousScoresTextDiv.innerHTML = this.counter;
    var previousScoresDiv = goog.dom.getElement('previousScores');
    goog.dom.appendChild(previousScoresDiv, previousScoresTextDiv);
  } else {
    var newHead, newHeadDiv;
    var oldHeadDiv = goog.dom.getElement('snakePiece' + this.snakeHeadID);
    // Make new div if a piece needs to be appended.
    // Otherwise grab the tail and set to head.
    if (this.appendPieceToSnake) {
      newHeadDiv = goog.dom.createElement('div');
      newHeadDiv.id = 'snakePiece' + ++this.snakeLength;
      newHeadDiv.className = 'snake-piece';
      newHeadDiv.style.top = oldHeadDiv.offsetTop;
      newHeadDiv.style.left = oldHeadDiv.offsetLeft;
      
      goog.dom.appendChild(this.gameBoardDiv, newHeadDiv);
      
      newHead = new Snake.Coordinates(this.snakeLength);
      this.appendPieceToSnake = false;
    } else {     
      newHead = this.snakeQueue.shift();
      newHeadDiv = goog.dom.getElement('snakePiece' + newHead.id);
    }
    newHead.xCoord = oldHead.xCoord;
    newHead.yCoord = oldHead.yCoord;

    switch (this.currentDirection) {
      case Snake.Direction.LEFT:
        newHead.xCoord--;
        newHeadDiv.style.left = newHead.xCoord * SQUARE_SIZE;
        newHeadDiv.style.top = newHead.yCoord * SQUARE_SIZE;
        break;
      case Snake.Direction.UP:
        newHead.yCoord--;
        newHeadDiv.style.left = newHead.xCoord * SQUARE_SIZE;
        newHeadDiv.style.top = newHead.yCoord * SQUARE_SIZE;
        break;
      case Snake.Direction.RIGHT:
        newHead.xCoord++;
        newHeadDiv.style.left = newHead.xCoord * SQUARE_SIZE;
        newHeadDiv.style.top = newHead.yCoord * SQUARE_SIZE;
        break;
      case Snake.Direction.DOWN:
        newHead.yCoord++;
        newHeadDiv.style.left = newHead.xCoord * SQUARE_SIZE;
        newHeadDiv.style.top = newHead.yCoord * SQUARE_SIZE;
        break;  
    }
    
    // Set snake head.
    oldHeadDiv.style.backgroundImage = this.bodyUrl;
    newHeadDiv.style.backgroundImage =  this.headUrl;
    
    this.snakeHeadID = newHead.id;
    this.snakeQueue.push(newHead);

    this.previousDirection = this.currentDirection;
    
    if (this.testGemOverlap_(newHeadDiv)) {
      this.appendPieceToSnake = true;
      this.setGemPiece();
      
      var counterDiv = goog.dom.getElement('counter');
      if (counterDiv) {
        counterDiv.innerHTML = ++this.counter;
      }
    }
    setTimeout('snake.move()', 1000/this.snakeSpeed);
  } 
};

/**
 * Determines whether or not the gem overlaps with the snake heard.
 *
 * @param {Object} snakeHeadDiv THe div element of the snake head.
 * @return {boolean} Whether or not the ggem overlaps with the snake head.
 * @private
 */
Snake.prototype.testGemOverlap_ = function(snakeHeadDiv) {
  var overlap = false;
  if (snakeHeadDiv) {
    var gemDiv = goog.dom.getElement('gemPiece');
    overlap = (snakeHeadDiv.style.top == gemDiv.style.marginTop &&
               snakeHeadDiv.style.left == gemDiv.style.marginLeft);
  }
  return overlap;
};

/**
 * Gets a deep copy of the snake body pieces.
 *
 * @return {Array.<Snake.Coordinates>} A deep copy of the snake body.
 * @private
 */
Snake.prototype.getDeepCopyQueue = function() {
  var snakeQueueDeepCopy = new Array();
  var snakeCoordinates;
  for (var index = 0; index < this.snakeQueue.length; index++) {
    snakeCoordinates = this.snakeQueue[index];
    snakeQueueDeepCopy.push(
        new Snake.Coordinates(snakeCoordinates.id,
                              snakeCoordinates.xCoord,
                              snakeCoordinates.yCoord));
  }
  return snakeQueueDeepCopy;
};

/**
 * Gets a deep copy of the snake body pieces.
 *
 * @return {Object} A deep copy of the snake body.
 * @private
 */
Snake.prototype.getDeepCopyGemCoords = function() {
  return {
    'x': this.gemCoords.x,
    'y': this.gemCoords.y
  }
};

/**
 * Saves the state of the snake game.
 */
Snake.prototype.saveGame = function() {
  if (!this.gameOver) {
    this.saveGameVariables['snakeQueue'] = this.getDeepCopyQueue();
    this.saveGameVariables['snakeHeadID'] = this.snakeHeadID;
    this.saveGameVariables['counter'] = this.counter;
    this.saveGameVariables['snakeLength'] = this.snakeLength;
    this.saveGameVariables['snakeSpeed'] = this.snakeSpeed;
    this.saveGameVariables['currentDirection'] = this.currentDirection;
    this.saveGameVariables['previousDirection'] = this.previousDirection;
    this.saveGameVariables['gemCoords'] = this.getDeepCopyGemCoords();
  }
};

/**
 * Loads a previously saved snake game. The current game must be completed
 * before a new game can be loaded.
 */
Snake.prototype.loadGame = function() {
  if (!this.gameOver || goog.object.getCount(this.saveGameVariables) != 8) { 
    return;
  }
    
  //reset variables
  goog.dom.getElement('finalScore').style.display = 'none';
  this.gameOver = false;
  
  this.snakeQueue = this.saveGameVariables['snakeQueue'];
  this.snakeHeadID = this.saveGameVariables['snakeHeadID'];
  this.counter = this.saveGameVariables['counter'];
  this.snakeLength = this.saveGameVariables['snakeLength'];
  this.snakeSpeed = this.saveGameVariables['snakeSpeed'];
  this.currentDirection = this.saveGameVariables['currentDirection'];
  this.previousDirection = this.saveGameVariables['previousDirection'];
  this.gemCoords = this.saveGameVariables['gemCoords'];
  // Make deep copies of the queue and coordinates again, as they may
  // be needed on the next load.
  this.saveGameVariables['snakeQueue'] = this.getDeepCopyQueue();
  this.saveGameVariables['gemCoords'] = this.getDeepCopyGemCoords();
  
  // Reset radio option.
  var radio = this.snakeSpeedForm.elements['snakeSpeed'];
  for (var index = 0; index < radio.length; index++) {
    if (parseInt(radio[index].value, 10) != this.snakeSpeed) {
      radio[index].checked = false;
    } else {
      radio[index].checked = true;
    }
  }
  //goog.dom.forms.setValue(document.snakeSpeedForm.snakeSpeed, '' + this.snakeSpeed);
  
  // Disable form.
  goog.dom.forms.setDisabled(this.snakeSpeedForm, true);
  
  goog.dom.getElement('counter').innerHTML = this.counter;
  this.gameBoardDiv.innerHTML = "";
  
  var gemPieceDiv = goog.dom.createElement('div');
  gemPieceDiv.id = 'gemPiece';
  gemPieceDiv.className = 'gem-piece';
  gemPieceDiv.style.backgroundImage = this.gemUrl;
  goog.dom.appendChild(this.gameBoardDiv, gemPieceDiv);
  this.setGemPiece(this.gemCoords.x, this.gemCoords.y);

  goog.array.forEach(this.snakeQueue, function(coordsEntry) {
    var snakePieceDiv = goog.dom.createElement('div');
    snakePieceDiv.id = 'snakePiece' + coordsEntry.id;
    snakePieceDiv.className = 'snake-Piece';
    snakePieceDiv.style.top = SQUARE_SIZE * coordsEntry.yCoord;
    snakePieceDiv.style.left = SQUARE_SIZE * coordsEntry.xCoord;
    if (coordsEntry.id == this.snakeHeadID) { // Set head.
      snakePieceDiv.style.backgroundImage = this.headUrl;
    } else { // Set body.
      snakePieceDiv.style.backgroundImage = this.bodyUrl;
    }
    goog.dom.appendChild(this.gameBoardDiv, snakePieceDiv);
  }, this);
  
  this.pauseGame();
};

/**
 * Represents the map of the snake game. Is also responsible for showing
 * snake piece elements on the screen.
 *
 * @param {number} width The width of the map.
 * @param {number} height The height of the map.
 * @constructor
 * @private
 */
SnakeMap = function(width, height) {
  this.width = width;
  this.height = height;
  /** @private */
  this.map_ = new Array();
  for (var index = 0; index < height; index++) {
    this.map_[index] = new Array();
  }

  /** TODO: Remove duplicate. Copied from snake class. */
  var now = new goog.date.Date();
  // TODO: Decide on an image format. Preferably png.
  switch(now.getMonth()) {
    case goog.date.month.OCT:
      this.headUrl = "url('images/head_halloween.png')";
      this.bodyUrl = "url('images/body_halloween.gif')";
      this.gemUrl = "url('images/gem_halloween.png')";
      break;
    case goog.date.month.NOV:
      this.headUrl = "url('images/head_turkey.png')";
      this.bodyUrl = "url('images/body_turkey.png')";
      this.gemUrl = "url('images/gem_turkey.png')";
      break;
    case goog.date.month.DEC:
      this.headUrl = "url('images/head_christmas.png')";
      this.bodyUrl = "url('images/body_christmas.png')";
      this.gemUrl = "url('images/gem_christmas.png')";
      break;
    default:
      this.headUrl = "url('images/head_default.jpg')";
      this.bodyUrl = "url('images/body_default.jpg')";
      this.gemUrl = "url('images/gem_default.png')";
      break;
  }
};

/**
 * Sets the gem on the game board.
 *
 * @param {number} xCoord The x-coordinate of the new gem placement.
 * @param {number} yCoord The y-coordinate of the new gem placement.
 * @return {boolean} Whether or not the gem spot is valid.
 */
SnakeMap.prototype.setGem = function(xCoord, yCoord) {
  if (this.map_[xCoord][yCoord]) {
    return false;
  }
  this.map_[xCoord][yCoord] = SnakeMap.piece.GEM;
  goog.dom.getElement('spot' + xCoord + '-' + yCoord).style.backgroundImage = this.gemUrl;
  return true;
};

SnakeMap.piece = {
  'EMPTY': 0,
  'HEAD': 1,
  'BODY': 2,
  'GEM': 3
};

goog.exportSymbol('Snake', Snake);
goog.exportSymbol('Snake.prototype.move', Snake.prototype.move);
goog.exportSymbol('Snake.prototypesaveGame', Snake.prototype.saveGame);
goog.exportSymbol('Snake.prototype.loadGame', Snake.prototype.loadGame);
goog.exportSymbol('Snake.prototype.init', Snake.prototype.init);