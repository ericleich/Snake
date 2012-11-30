goog.provide('Snake');
goog.provide('SnakeManager');
goog.provide('SnakeMap');
goog.provide('SnakeState');

goog.require('goog.array');
goog.require('goog.date');
goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.dom.forms');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.events.KeyCodes');
goog.require('goog.object');
goog.require('goog.style');
goog.require('goog.structs.Queue');

/**
 * The size of the snake and gem squares.
 *
 * @const
 * @private
 */
var SQUARE_SIZE = 20;

/**
 * Manages the snake game.
 *
 * @constructor
 */
SnakeManager = function() {
  this.gameOver = true;
  this.gamePaused = false;
  this.snakeSpeed = 10;

  this.map = null;
  this.gemCoordinates = null;

  /** Currently assumes one snake. Make an array to support multiple snakes. */
  this.snake = new Snake(1);

  /** Used for saving/loading game. */
  this.hasSavedGame = false;
  this.saveGameVariables = {};


  // Listen for key down events.
  goog.events.listen(document, goog.events.EventType.KEYDOWN, this.handleKeyEvent, false, this);
};

/**
 * Handles the snake game's key events, such as moving the snake with
 * directional arrows or using keyboard shortcuts to start new game.
 *
 * @param {Object} event The key event.
 * @private
 */
SnakeManager.prototype.handleKeyEvent = function(event) {
  if (event) {
    switch (event.keyCode) {
      case goog.events.KeyCodes.LEFT:
      case goog.events.KeyCodes.UP:
      case goog.events.KeyCodes.RIGHT:
      case goog.events.KeyCodes.DOWN:
        if (!this.gamePaused) {
          this.snake.changeDirection(event.keyCode);
        }
        break;
      case goog.events.KeyCodes.SPACE:
        this.pauseGame();
        break;
      case goog.events.KeyCodes.L:
        if (this.gameOver) {
          this.loadGame();
        }
        break;
      case goog.events.KeyCodes.N:
        if (this.gameOver) {
          this.startGame();
        }
        break;
      case goog.events.KeyCodes.S:
        if (!this.gameOver) {
          this.saveGame();
        }
        break;
     }
  }
};

/**
 * Starts a new snake game.
 */
SnakeManager.prototype.startGame = function() {
  // Hold a reference to the game board div and snake speed form,
  // as they're used often.
  this.gameBoardDiv = goog.dom.getElement('gameBoard');
  this.snakeSpeedForm =
      /** @type {HTMLFormElement} */ (goog.dom   .getElement('snakeSpeedForm'));
  
  // Reset variables.
  this.gameOver = false;
  this.gamePaused = false;
  this.snakeSpeed = goog.dom.forms.getValueByName(
      this.snakeSpeedForm, 'snakeSpeed');
  this.snake = new Snake(1);

  // Reset UI elements.
  goog.dom.forms.setDisabled(this.snakeSpeedForm, true);
  goog.dom.getElement('finalScore').style.display = 'none';
  goog.dom.setTextContent(goog.dom.getElement('counter'), '0');

  // Set up game board.
  var gameBoardDivSize = goog.style.getContentBoxSize(this.gameBoardDiv);
  this.gameBoardSize = gameBoardDivSize.scale(1 / SQUARE_SIZE).floor();
  this.createGameBoard_();
  this.map = new SnakeMap(this.gameBoardSize);

  // Create first snake piece and gem.
  var centerRow = Math.floor(this.gameBoardSize.height / 2);
  var centerColumn = Math.floor(this.gameBoardSize.width / 2);
  var headCoordinates = new SnakeCoordinates(centerRow, centerColumn);
  this.map.setCoordinates(headCoordinates, SnakeMap.piece.HEAD);
  this.snake.append(headCoordinates);
  this.setNewGemCoordinates();

  // Start moving the snake.
  this.move();
};

/**
 * Creates a div for each valid position on the game board.
 *
 * @private
 */
SnakeManager.prototype.createGameBoard_ = function() {
  // First clear game board.
  goog.dom.removeChildren(this.gameBoardDiv);

  var gamePieceRow, gamePieceDiv;
  for (var i = 0; i < this.gameBoardSize.height; i++) {
    gamePieceRow = goog.dom.createElement(goog.dom.TagName.DIV);
    gamePieceRow.id = 'row' + i;
    for (var j = 0; j < this.gameBoardSize.width; j++) {
      // Create a div to hold a game piece.
      gamePieceDiv = goog.dom.createElement(goog.dom.TagName.DIV);
      gamePieceDiv.id = 'spot' + i + '-' + j;
      goog.style.setHeight(gamePieceDiv, SQUARE_SIZE);
      goog.style.setWidth(gamePieceDiv, SQUARE_SIZE);
      goog.style.setInlineBlock(gamePieceDiv);
      goog.dom.appendChild(gamePieceRow, gamePieceDiv);
    }
    goog.dom.appendChild(this.gameBoardDiv, gamePieceRow);
  }
};

/**
 * Sets new gem coordinates. If gem coordinates are provided, set those
 * coordinates. Otherwise, determine random coordinates.
 *
 * @param {SnakeCoordinates=} opt_gemCoordinates The gem's coordinates.
 * @private
 */
SnakeManager.prototype.setNewGemCoordinates = function(opt_gemCoordinates) {
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
};

/**
 * Moves each snake 1 position in its current direction.
 */
SnakeManager.prototype.move = function() {
  // If game is paused, don't move.
  if (this.gamePaused) {
    return;
  }

  var newHeadCoordinates = this.snake.move();
  switch (this.map.getPiece(newHeadCoordinates)) {
    case SnakeMap.piece.UNKNOWN:
      // Potential corner case in multiplayer - snake dies but tail is still
      // there. Don't want to clear in 1 player mode though, so comment for now.
      // this.map.clearCoordinates(this.snake.removeTail());
      // Don't show piece going over the edge.
      this.notifyGameOver();
      return;
    case SnakeMap.piece.GEM:
      goog.dom.setTextContent(
          goog.dom.getElement('counter'), (this.snake.getScore()) + "");
      this.setNewGemCoordinates();
      break;
    default:
      this.map.clearCoordinates(this.snake.removeTail());
  }

  var oldPiece = this.map.setCoordinates(
      newHeadCoordinates, SnakeMap.piece.HEAD);
  if (oldPiece === SnakeMap.piece.BODY || oldPiece === SnakeMap.piece.HEAD) {
    this.notifyGameOver();
  } else {
    setTimeout('snakeManager.move()', 1000/this.snakeSpeed);
  }
};

/**
 * Checks if the snake went out of bounds or ran into itself.
 *
 * @param {SnakeCoordinates} newHeadCoordinates The coordinates of
 *     the snake's new head.
 * @return {boolean} Whether or not the game is over.
 * @private
 */
SnakeManager.prototype.isGameOver = function(newHeadCoordinates) {
  return !this.map.coordinatesValid(newHeadCoordinates);
};

/**
 * Notifies the UI that the game is over.
 */
SnakeManager.prototype.notifyGameOver = function() {
  this.gameOver = true;
  goog.dom.setTextContent(
      goog.dom.getElement('finalScoreNum'), this.snake.getScore() + "");
  goog.style.setInlineBlock(goog.dom.getElement('finalScore'));
  
  // Enable form.
  goog.dom.forms.setDisabled(this.snakeSpeedForm, false);

  var previousScoresTextDiv = goog.dom.createElement(goog.dom.TagName.DIV);
  goog.dom.classes.set(previousScoresTextDiv, 'previous-scores-text');
  goog.dom.setTextContent(previousScoresTextDiv, this.snake.getScore() + "");
  var previousScoresDiv = goog.dom.getElement('previousScores');
  goog.dom.appendChild(previousScoresDiv, previousScoresTextDiv);
};

/**
 * Saves the state of the snake game.
 */
SnakeManager.prototype.saveGame = function() {
  if (!this.gameOver) {
    this.saveGameVariables['snake'] = this.snake.clone();
    this.saveGameVariables['snakeSpeed'] = this.snakeSpeed;
    this.saveGameVariables['gemCoordinates'] = this.gemCoordinates.clone();
    this.hasSavedGame = true;
  }
};

/**
 * Loads a previously saved snake game. The current game should be completed
 * before a new game can be loaded.
 */
SnakeManager.prototype.loadGame = function() {
  if (!this.gameOver || !this.hasSavedGame) {
    return;
  }
    
  // Reset snake variables.
  this.gameOver = false;
  this.gamePaused = false;
  this.snake = this.saveGameVariables['snake'];
  this.snakeSpeed = this.saveGameVariables['snakeSpeed'];
  this.gemCoordinates = this.saveGameVariables['gemCoordinates'];
  // Make deep copies of the queue and coordinates again, as they may
  // be needed on the next load.
  this.saveGame();
  
  // Reset radio option.
  var radio = this.snakeSpeedForm.elements['snakeSpeed'];
  for (var index = 0; index < radio.length; index++) {
    if (parseInt(radio[index].value, 10) != this.snakeSpeed) {
      radio[index].checked = false;
    } else {
      radio[index].checked = true;
    }
  }
  
  // Reset UI variables.
  goog.dom.forms.setDisabled(this.snakeSpeedForm, true);
  goog.dom.getElement('finalScore').style.display = 'none';
  goog.dom.setTextContent(
      goog.dom.getElement('counter'), this.snake.getScore() + "");

  // Recreate game board.
  this.createGameBoard_();
  this.map = new SnakeMap(this.gameBoardSize);
  this.setNewGemCoordinates(this.gemCoordinates);

  goog.array.forEach(this.snake.getValues(), function(coordinates) {
    if (this.snake.isHead(coordinates)) {
      this.map.setCoordinates(coordinates, SnakeMap.piece.HEAD);
    } else {
      this.map.setCoordinates(coordinates, SnakeMap.piece.BODY);
    }
  }, this);
  
  this.pauseGame();
};

/**
 * Pauses the snake game.
 */
SnakeManager.prototype.pauseGame = function() {
  if (this.gameOver) {
    return;
  }
  
  this.gamePaused = !this.gamePaused;
  goog.dom.getElement('pauseButton').value =
      this.gamePaused ? "Resume" : "Pause";
  goog.dom.getElement('pauseGameOverlay').style.display =
      this.gamePaused ? "block" : "none";

  if (!this.gamePaused) {
    setTimeout('snakeManager.move()', 1000/this.snakeSpeed);
  }
};

/**
 * Creates a snake object.
 *
 * @param {number} id The snake's id.
 * @constructor
 */
Snake = function(id) {
  this.setSnakePieceImages_();
  
  this.id = id;
  this.currentDirection = Snake.Direction.RIGHT;
  this.previousDirection = Snake.Direction.RIGHT;
  this.head = null;
  /**
   * Represents the body of the snake. The "head" of the queue is the tail of
   * the snake's body.
   * @type {goog.structs.Queue}
   */
  this.snakeQueue = new goog.structs.Queue();
};

/**
 * Enum for the snake's direction.
 *
 * @enum {number}
 */
Snake.Direction = {
  'UP': 1,
  'DOWN': 2,
  'LEFT': 3,
  'RIGHT': 4
};

/**
 * Clones a snake.
 *
 * @return {Snake} The snake's clone.
 */
Snake.prototype.clone = function() {
  var clone = new Snake(this.id);
  clone.currentDirection = this.currentDirection;
  clone.previousDirection = this.previousDirection;
  clone.snakeQueue = new goog.structs.Queue();
  goog.array.forEach(this.snakeQueue.getValues(), function(coordinates) {
    clone.append(coordinates);
  }, this);
  return clone;
};

/**
 * Get's the snake's score.
 *
 * @return {number} The snake's score.
 */
Snake.prototype.getScore = function() {
  return this.snakeQueue.getCount() - 1;
};

/**
 * Get's the snake's length.
 *
 * @return {number} The snake's length.
 */
Snake.prototype.getLength = function() {
  return this.snakeQueue.getCount();
};

/**
 * Get's the snake's coordinates as an array.
 *
 * @return {Array.<SnakeCoordinates>} The snake's array coordinates.
 */
Snake.prototype.getValues = function() {
  return this.snakeQueue.getValues();
};

/**
 * Determines whether or not the coordinates are the head coordinates.
 *
 * @param {SnakeCoordinates} coordinates The snake coordinates to compare.
 * @return {boolean} Whether or not the coordinates represent the head.
 */
Snake.prototype.isHead = function(coordinates) {
  return this.head && this.head.equals(coordinates);
};


/**
 * Adds a piece to the snake.
 *
 * @param {SnakeCoordinates} coordinates The coordinates to append.
 * @return {SnakeCoordinates|null} The old head coordinates, if any.
 */
Snake.prototype.append = function(coordinates) {
  var oldHead = this.head;
  this.head = coordinates;
  this.snakeQueue.enqueue(coordinates);
  return oldHead;
};

/**
 * Removes the snake's tail coordinates.
 *
 * @return {SnakeCoordinates} The tail coordinates.
 */
Snake.prototype.removeTail = function() {
  return /** @type {SnakeCoordinates} */ this.snakeQueue.dequeue();
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
 * Changes the snake's direction based on user input.
 *
 * @param {number} keyCode The event key code. Can be UP, DOWN, LEFT, or RIGHT.
 * @private
 */
Snake.prototype.changeDirection = function(keyCode) {
  switch (keyCode) {
    case goog.events.KeyCodes.LEFT:
      if (this.previousDirection != Snake.Direction.RIGHT) {
        this.currentDirection = Snake.Direction.LEFT;
      }
      break;
    case goog.events.KeyCodes.UP:
      if (this.previousDirection != Snake.Direction.DOWN) {
        this.currentDirection = Snake.Direction.UP;
      }
      break;
    case goog.events.KeyCodes.RIGHT:
      if (this.previousDirection != Snake.Direction.LEFT) {
        this.currentDirection = Snake.Direction.RIGHT;
      }
      break;
    case goog.events.KeyCodes.DOWN:
      if (this.previousDirection != Snake.Direction.UP) {
        this.currentDirection = Snake.Direction.DOWN;
      }
      break;
   }
};

/**
 * Moves the snake one space in the current direction.
 *
 * @return {SnakeCoordinates} The new head coordinates.
 */
Snake.prototype.move = function() {
  var newHead = this.head.clone();
  switch (this.currentDirection) {
    case Snake.Direction.LEFT:
      newHead.column--;
      break;
    case Snake.Direction.UP:
      newHead.row--;
      break;
    case Snake.Direction.RIGHT:
      newHead.column++;
      break;
    case Snake.Direction.DOWN:
      newHead.row++;
      break;
  }
  this.head = newHead;
  this.snakeQueue.enqueue(newHead);
  this.previousDirection = this.currentDirection;
  return newHead;
}

/**
 * Gets the snakes desired new head coordinates. THe snake returns the
 * coordinates representing where it would like to move.
 *
 * @return {SnakeCoordinates} The new desired head coordinates.
 */
Snake.prototype.getNewHeadCoordinates = function() {
  var newHead = this.head.clone();
  switch (this.currentDirection) {
    case Snake.Direction.LEFT:
      newHead.column--;
      break;
    case Snake.Direction.UP:
      newHead.row--;
      break;
    case Snake.Direction.RIGHT:
      newHead.column++;
      break;
    case Snake.Direction.DOWN:
      newHead.row++;
      break;
  }
  return newHead;
}

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
 * @param {SnakeCoordinates} coordinates The position on the map.
 * @return {SnakeMap.piece} The piece at the provided coordinate.
 */
SnakeMap.prototype.getPiece = function(coordinates) {
  var piece = SnakeMap.piece.UNKNOWN;
  if (this.coordinatesInBounds_(coordinates)) {
    piece = this.map_[coordinates.row][coordinates.column] ||
        SnakeMap.piece.EMPTY;
  }
  return piece;
};

/**
 * Sets the map value to the given piece for the provided position. If
 * setting the head piece, the old head will be set to a body piece.
 *
 * @param {SnakeCoordinates} coordinates The coordinates to set.
 * @param {SnakeMap.piece} The piece to set in that coordinate position.
 * @return {SnakeMap.piece} The old piece in that coordinate position.
 */
SnakeMap.prototype.setCoordinates = function(coordinates, piece) {
  var oldPiece = this.getPiece(coordinates);
  if (this.coordinatesInBounds_(coordinates)) {
    this.map_[coordinates.row][coordinates.column] = piece;
    var pieceDiv = goog.dom.getElement('spot' + coordinates.row + '-' +
        coordinates.column);
    switch (piece) {
      case SnakeMap.piece.EMPTY:
        pieceDiv.style.backgroundImage = '';
        break;
      case SnakeMap.piece.HEAD:
        pieceDiv.style.backgroundImage = this.headUrl;
        // Set old head to body.
        if (this.headCoordinates &&
            this.getPiece(this.headCoordinates) === SnakeMap.piece.HEAD) {
          var oldHeadDiv = goog.dom.getElement('spot' +
            this.headCoordinates.row + '-' + this.headCoordinates.column);
          oldHeadDiv.style.backgroundImage = this.bodyUrl;
        }
        this.headCoordinates = coordinates;
        break;
      case SnakeMap.piece.BODY:
        pieceDiv.style.backgroundImage = this.bodyUrl;
        break;
      case SnakeMap.piece.GEM:
        pieceDiv.style.backgroundImage = this.gemUrl;
        break;
    }
  }
  return oldPiece;
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
  'UNKNOWN': 0,
  'EMPTY': 1,
  'HEAD': 2,
  'BODY': 3,
  'GEM': 4
};

goog.exportSymbol('Snake', Snake);
goog.exportSymbol('SnakeManager', SnakeManager);
goog.exportSymbol('SnakeState', SnakeState);
goog.exportProperty(SnakeManager.prototype, 'move', SnakeManager.prototype.move);
goog.exportProperty(SnakeManager.prototype, 'startGame', SnakeManager.prototype.startGame);
goog.exportProperty(SnakeManager.prototype, 'saveGame', SnakeManager.prototype.saveGame);
goog.exportProperty(SnakeManager.prototype, 'loadGame', SnakeManager.prototype.loadGame);
