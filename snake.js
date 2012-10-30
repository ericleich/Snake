goog.provide('Snake');
goog.provide('SnakeMap');
goog.provide('SnakeState');

goog.require('goog.array');
goog.require('goog.date');
goog.require('goog.dom');
goog.require('goog.dom.forms');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.object');
goog.require('goog.style');
goog.require('goog.structs.Queue');

/**
 * Represents the state of the snake game.
 *
 * @constructor
 * @private
 */
SnakeState = function() {
  this.speed = 10;
  this.length = 1;
  this.appendPieceToSnake = false;
  this.currentDirection = SnakeState.Direction.RIGHT;
  this.previousDirection = SnakeState.Direction.RIGHT;
};

/**
 * Clones the snake's state.
 *
 * @return {SnakeState} A deep copy clone of the snake's state.
 */
SnakeState.prototype.clone = function() {
  var clone = new SnakeState();
  clone.speed = this.speed;
  clone.length = this.length;
  clone.appendPieceToSnake = this.appendPieceToSnake;
  clone.currentDirection = this.currentDirection;
  clone.previousDirection = this.previousDirection;
  return clone;
};

/**
 * Get's the snake state's score.
 *
 * @return {number} The score for the snake.
 */
SnakeState.prototype.getScore = function() {
  return this.length - 1;
};

/**
 * Enum for the snake's direction.
 *
 * @enum {number}
 */
SnakeState.Direction = {
  'UP': 0,
  'DOWN': 1,
  'LEFT': 2,
  'RIGHT': 3
};

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

  this.gameOver = true;
  this.gamePaused = false;

  this.state = new SnakeState();
  /**
   * Represents the body of the snake. The "head" of the queue is the tail of
   * the snake's body.
   * @type {goog.structs.Queue}
   */
  this.snakeQueue = new goog.structs.Queue();

  // Used for loading/saving game.
  this.saveGameVariables = {};

  // Listen for key down events.
  goog.events.listen(document, goog.events.EventType.KEYDOWN, this.handleKeyEvent, false, this);
};

/**
 * Determines which snake piece images to use based on the current date.
 *
 * @private
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
        if (!this.gamePaused &&
            this.state.previousDirection != SnakeState.Direction.RIGHT) {
          this.state.currentDirection = SnakeState.Direction.LEFT;
        }
        break;    
      case 38:
        if (!this.gamePaused &&
            this.state.previousDirection != SnakeState.Direction.DOWN) {
          this.state.currentDirection = SnakeState.Direction.UP;
        }
        break;    
      case 39:
        if (!this.gamePaused &&
            this.state.previousDirection != SnakeState.Direction.LEFT) {
          this.state.currentDirection = SnakeState.Direction.RIGHT;
        }
        break;    
      case 40:
        if (!this.gamePaused &&
            this.state.previousDirection != SnakeState.Direction.UP) {
          this.state.currentDirection = SnakeState.Direction.DOWN;
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
  // Hold a reference to the game board div and snake speed form,
  // as they're used often.
  this.gameBoardDiv = goog.dom.getElement('gameBoard');
  this.snakeSpeedForm =
      /** @type {HTMLFormElement} */ (goog.dom.getElement('snakeSpeedForm'));
  
  // Reset variables.
  this.state = new SnakeState();
  this.state.gameOver = false;
  this.snakeQueue = new goog.structs.Queue();
  this.state.snakeSpeed = goog.dom.forms.getValueByName(
      this.snakeSpeedForm, 'snakeSpeed');

  // Reset UI elements.
  goog.dom.forms.setDisabled(this.snakeSpeedForm, true);
  goog.dom.getElement('finalScore').style.display = 'none';
  goog.dom.getElement('counter').innerHTML = this.state.getScore();

  // Set up game board.
  var gameBoardDivSize = goog.style.getContentBoxSize(this.gameBoardDiv);
  this.gameBoardSize = gameBoardDivSize.scale(1 / SQUARE_SIZE).floor();
  this.createGameBoard_();
  this.map = new SnakeMap(this.gameBoardSize);

  // Create first snake piece and gem.
  var centerRow = Math.floor(this.gameBoardSize.height / 2);
  var centerColumn = Math.floor(this.gameBoardSize.width / 2);
  this.currentHead = new SnakeCoordinates(centerRow, centerColumn);
  this.map.setCoordinates(this.currentHead, SnakeMap.piece.HEAD);
  this.snakeQueue.enqueue(this.currentHead);
  this.setNewGemCoordinates();

  // Start moving the snake.
  this.move();
};

/**
 * Creates a div for each valid position on the game board.
 *
 * @private
 */
Snake.prototype.createGameBoard_ = function() {
  // First clear game board.
  this.gameBoardDiv.innerHTML = "";

  var gamePieceRow, gamePieceDiv;
  for (var i = 0; i < this.gameBoardSize.height; i++) {
    gamePieceRow = goog.dom.createElement('div');
    gamePieceRow.id = 'row' + i;
    gamePieceRow.style.display = 'block';
    for (var j = 0; j < this.gameBoardSize.width; j++) {
      // Create a div to hold a game piece.
      gamePieceDiv = goog.dom.createElement('div');
      gamePieceDiv.id = 'spot' + i + '-' + j;
      gamePieceDiv.style.width = SQUARE_SIZE;
      gamePieceDiv.style.height = SQUARE_SIZE;
      gamePieceDiv.style.display = 'inline-block';
      goog.dom.appendChild(gamePieceRow, gamePieceDiv);
    }
    goog.dom.appendChild(this.gameBoardDiv, gamePieceRow);
  }
};

/**
 * Sets new gem coordinates. If gem coordinates are provided, set those
 * coordinates. Otherwise, choose random coordinates.
 *
 * @param {SnakeCoordinates=} opt_gemCoordinates The gem's coordinates.
 * @return {SnakeCoordinates} The new gem coordinates.
 * @private
 */
Snake.prototype.setNewGemCoordinates = function(opt_gemCoordinates) {
  // Make sure gem piece is not set on a piece of snake.
  var randomRow = opt_gemCoordinates ? opt_gemCoordinates.row :
      Math.floor(Math.random() * this.gameBoardSize.width);
  var randomColumn = opt_gemCoordinates ? opt_gemCoordinates.column :
      Math.floor(Math.random() * this.gameBoardSize.height);
  while (!this.map.setGem(randomRow, randomColumn)) {
    randomRow = Math.floor(Math.random() * this.gameBoardSize.width);
    randomColumn = Math.floor(Math.random() * this.gameBoardSize.height);
  }
  this.gemCoordinates = new SnakeCoordinates(randomRow, randomColumn);
  return new SnakeCoordinates(randomRow, randomColumn);
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
    setTimeout('snake.move()', 1000/this.state.speed);
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
 *
 * @param {number} row The piece's row number.
 * @param {number} column The piece's column number.
 * @constructor
 * @private
 */
SnakeCoordinates = function(row, column) {
  this.row = row;
  this.column = column;
};

/**
 * Clones the snake coordinates.
 *
 * @return {SnakeCoordinates} A deep copy clone of the snake coordinates.
 */
SnakeCoordinates.prototype.clone = function() {
  return new SnakeCoordinates(this.row, this.column);
};

/**
 * Compares two SnakeCoordinates.
 *
 * @param {SnakeCoordinates} other The other SnakeCoordinates to compare.
 * @return {boolean} Whether or not the snake coordinates are equal.
 */
SnakeCoordinates.prototype.equals = function(other) {
  return this.row === other.row && this.column === other.column;
};

/**
 * Checks if the snake went out of bounds or ran into itself.
 *
 * @param {SnakeCoordinates} newHeadCoordinates The coordinates of
 *     the snake's new head.
 * @return {boolean} Whether or not the game is over.
 * @private
 */
Snake.prototype.isGameOver = function(newHeadCoordinates) {
  return !this.map.coordinatesValid(newHeadCoordinates);
};


/**
 * Moves the snake 1 position in the current direction.
 */
Snake.prototype.move = function() {
  // If game is paused, don't move.
  if (this.gamePaused) {
    return;
  }
  var newHead = this.currentHead.clone();
  switch (this.state.currentDirection) {
    case SnakeState.Direction.LEFT:
      newHead.column--;
      break;
    case SnakeState.Direction.UP:
      newHead.row--;
      break;
    case SnakeState.Direction.RIGHT:
      newHead.column++;
      break;
    case SnakeState.Direction.DOWN:
      newHead.row++;
      break;
  }
  if (this.gameOver = this.isGameOver(newHead)) {
    goog.dom.getElement('finalScoreNum').innerHTML = this.state.getScore();
    goog.dom.getElement('finalScore').style.display = 'inline';
    
    // Enable form.
    goog.dom.forms.setDisabled(this.snakeSpeedForm, false);

    var previousScoresTextDiv = goog.dom.createElement('div');
    previousScoresTextDiv.className = 'previous-scores-text';
    previousScoresTextDiv.innerHTML = this.state.getScore();
    var previousScoresDiv = goog.dom.getElement('previousScores');
    goog.dom.appendChild(previousScoresDiv, previousScoresTextDiv);
  } else {

    if (this.state.appendPieceToSnake) {
      // Gem accounted for.
      this.state.appendPieceToSnake = false;
    } else {
      // Remove the tail. 
      var tail = this.snakeQueue.dequeue();
      this.map.clearCoordinates(tail);
    }
    
    // Set snake head.
    if (this.state.length !== 1) {
      // Ensures current head is not also the tail.
      this.map.setCoordinates(this.currentHead, SnakeMap.piece.BODY);
    }
    this.map.setCoordinates(newHead, SnakeMap.piece.HEAD);
    this.snakeQueue.enqueue(newHead);

    this.state.previousDirection = this.state.currentDirection;
    this.currentHead = newHead;
    
    // Check if gem was found.
    if (this.map.gemOverlaps(newHead)) {
      this.state.length++;
      this.state.appendPieceToSnake = true;
      this.setNewGemCoordinates();
      
      var counterDiv = goog.dom.getElement('counter');
      if (counterDiv) {
        counterDiv.innerHTML = this.state.getScore();
      }
    }
    setTimeout('snake.move()', 1000/this.state.speed);
  } 
};

/**
 * Gets a deep copy of the snake body pieces.
 *
 * @return {goog.structs.Queue} A deep copy of the snake body.
 * @private
 */
Snake.prototype.getDeepCopyQueue = function() {
  var snakeQueueDeepCopy = new goog.structs.Queue();
  goog.array.forEach(this.snakeQueue.getValues(), function(coordinates) {
    snakeQueueDeepCopy.enqueue(coordinates);
  }, this);
  return snakeQueueDeepCopy;
};

/**
 * Saves the state of the snake game.
 */
Snake.prototype.saveGame = function() {
  if (!this.gameOver) {
    this.saveGameVariables['snakeQueue'] = this.getDeepCopyQueue();
    this.saveGameVariables['state'] = this.state.clone();
    this.saveGameVariables['currentHead'] = this.currentHead.clone();
    this.saveGameVariables['gemCoordinates'] = this.gemCoordinates.clone();
  }
};

/**
 * Loads a previously saved snake game. The current game must be completed
 * before a new game can be loaded.
 */
Snake.prototype.loadGame = function() {
  if (!this.gameOver || goog.object.getCount(this.saveGameVariables) != 4) { 
    return;
  }
    
  // Reset snake variables.
  this.gameOver = false;
  this.snakeQueue = this.saveGameVariables['snakeQueue'];
  this.currentHead = this.saveGameVariables['currentHead'];
  this.state = this.saveGameVariables['state'];
  this.gemCoordinates = this.saveGameVariables['gemCoordinates'];
  // Make deep copies of the queue and coordinates again, as they may
  // be needed on the next load.
  this.saveGameVariables['snakeQueue'] = this.getDeepCopyQueue();
  this.saveGameVariables['currentHead'] = this.currentHead.clone();
  this.saveGameVariables['state'] = this.state.clone();
  this.saveGameVariables['gemCoordinates'] = this.gemCoordinates.clone();
  
  // Reset radio option.
  var radio = this.snakeSpeedForm.elements['snakeSpeed'];
  for (var index = 0; index < radio.length; index++) {
    if (parseInt(radio[index].value, 10) != this.state.speed) {
      radio[index].checked = false;
    } else {
      radio[index].checked = true;
    }
  }
  
  // Reset UI variables.
  goog.dom.forms.setDisabled(this.snakeSpeedForm, true);
  goog.dom.getElement('finalScore').style.display = 'none';
  goog.dom.getElement('counter').innerHTML = this.state.getScore();

  // Recreate game board.
  this.createGameBoard_();
  this.map = new SnakeMap(this.gameBoardSize);
  this.setNewGemCoordinates(this.gemCoordinates);

  goog.array.forEach(this.snakeQueue.getValues(), function(coordinates) {
    if (this.currentHead.equals(coordinates)) { // Set head.
      this.map.setCoordinates(coordinates, SnakeMap.piece.HEAD);
    } else { // Set body.
      this.map.setCoordinates(coordinates, SnakeMap.piece.BODY);
    }
  }, this);
  
  this.pauseGame();
};

/**
 * Represents the map of the snake game. Is also responsible for showing
 * snake piece elements on the screen.
 *
 * @param {goog.math.Size} size The size of the map.
 * @constructor
 * @private
 */
SnakeMap = function(size) {
  this.size = size;
  /** 
   * Represents the game board. Uses a 2D array indexed by [row][column],
   * where the number of rows is the height of the map, and the number of
   * columns is the width of the map.
   *
   * @private
   */
  this.map_ = new Array();
  for (var index = 0; index < this.size.height; index++) {
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
 * Sets the map value to the given piece for the provided position.
 *
 * @param {SnakeCoordinates} coordinates The coordinates to set.
 * @param {SnakeMap.piece} piece The piece to set at the coordinate position.
 */
SnakeMap.prototype.setCoordinates = function(coordinates, piece) {
  if (this.coordinatesInBounds_(coordinates)) {
    this.map_[coordinates.row][coordinates.column] = piece;
    var pieceDiv = goog.dom.getElement('spot' + coordinates.row + '-' + coordinates.column);
    switch (piece) {
      case SnakeMap.piece.EMPTY:
        pieceDiv.style.backgroundImage = '';
        break;
      case SnakeMap.piece.HEAD:
        pieceDiv.style.backgroundImage = this.headUrl;
        break;
      case SnakeMap.piece.BODY:
        pieceDiv.style.backgroundImage = this.bodyUrl;
        break;
      case SnakeMap.piece.GEM:
        pieceDiv.style.backgroundImage = this.gemUrl;
        break;
    }
  }
};

/**
 * Clears the map at the provided position.
 *
 * @param {SnakeCoordinates} coordinates The coordinates to clear.
 */
SnakeMap.prototype.clearCoordinates = function(coordinates) {
  if (this.coordinatesInBounds_(coordinates)) {
    this.map_[coordinates.row][coordinates.column] = SnakeMap.piece.EMPTY;
    goog.dom.getElement('spot' + coordinates.row + '-' + coordinates.column).style.backgroundImage = '';
  }
};

/**
 * Sets the gem on the game board if passed a valid position.
 *
 * @param {number} row The row of the new gem placement.
 * @param {number} column The column of the new gem placement.
 * @return {boolean} Whether or not the gem spot is valid.
 */
SnakeMap.prototype.setGem = function(row, column) {
  if (!this.coordinatesValid(new SnakeCoordinates(row, column))) {
    return false;
  }

  // Set new gem.
  this.map_[row][column] = SnakeMap.piece.GEM;
  goog.dom.getElement('spot' + row + '-' + column).style.backgroundImage = this.gemUrl;
  
  // Hold gem placement for next time.
  this.gemRow = row;
  this.gemColumn = column;
  return true;
};

/**
 * Determines whether or not the gem overlaps with the snake head.
 *
 * @param {SnakeCoordinates} headCoordinates The snake head's coordinates.
 * @return {boolean} Whether or not the snake head touched the gem.
 */
SnakeMap.prototype.gemOverlaps = function(headCoordinates) {
  if (!this.coordinatesInBounds_(headCoordinates)) {
    return false;
  }

  return headCoordinates.row === this.gemRow &&
      headCoordinates.column === this.gemColumn;
};

/**
 * Determines whether or not the current coordinates are in bounds and don't
 * overlap with another piece of snake.
 *
 * @param {SnakeCoordinates} headCoordinates The snake head's coordinates.
 * @return {boolean} Whether or not the coordinates are valid.
 */
SnakeMap.prototype.coordinatesValid = function(headCoordinates) {
  return this.coordinatesInBounds_(headCoordinates) &&
      this.map_[headCoordinates.row][headCoordinates.column] !=
          SnakeMap.piece.BODY &&
      this.map_[headCoordinates.row][headCoordinates.column] !=
          SnakeMap.piece.HEAD;
};

/**
 * Determines whether or not the current coordinates are in bounds.
 *
 * @param {SnakeCoordinates} coordinates The coordinates.
 * @return {boolean} Whether or not the coordinates are in bounds.
 * @private
 */
SnakeMap.prototype.coordinatesInBounds_ = function(coordinates) {
  return coordinates.row >= 0 &&
      coordinates.row < this.size.height &&
      coordinates.column >= 0 &&
      coordinates.column < this.size.width;
};

/**
 * Enum for snake piece type.
 *
 * @enum {number}
 */
SnakeMap.piece = {
  'EMPTY': 0,
  'HEAD': 1,
  'BODY': 2,
  'GEM': 3
};

goog.exportSymbol('Snake', Snake);
goog.exportSymbol('SnakeState', SnakeState);
goog.exportProperty(Snake.prototype, 'move', Snake.prototype.move);
goog.exportProperty(Snake.prototype, 'saveGame', Snake.prototype.saveGame);
goog.exportProperty(Snake.prototype, 'loadGame', Snake.prototype.loadGame);
goog.exportProperty(Snake.prototype, 'init', Snake.prototype.init);
