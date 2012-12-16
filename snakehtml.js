// This file was automatically generated from snake.soy.
// Please don't edit this file by hand.

if (typeof snake == 'undefined') { var snake = {}; }


snake.gameBoard = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<style>.snake-piece {height: ', soy.$$escapeHtml(opt_data.squareSize), 'px; width: ', soy.$$escapeHtml(opt_data.squareSize), 'px; display: inline-block;}</style>');
  var iLimit8 = opt_data.boardHeight;
  for (var i8 = 0; i8 < iLimit8; i8++) {
    output.append('<div id="row', soy.$$escapeHtml(i8), '">');
    var jLimit12 = opt_data.boardWidth;
    for (var j12 = 0; j12 < jLimit12; j12++) {
      output.append('<div id="spot', soy.$$escapeHtml(i8), '-', soy.$$escapeHtml(j12), '" class="snake-piece"></div>');
    }
    output.append('</div>');
  }
  return opt_sb ? '' : output.toString();
};


snake.app = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<STYLE>body {background: url(\'images/background_snake_halloween.jpg\'); color: white;}.gem-piece {height: ', soy.$$escapeHtml(opt_data.squareSize), 'px; width: ', soy.$$escapeHtml(opt_data.squareSize), 'px; display: block;}.counter {height: 20px; width: 50px; display: inline;}.game-board {height: ', soy.$$escapeHtml(opt_data.squareSize * opt_data.boardHeight), 'px; width: ', soy.$$escapeHtml(opt_data.squareSize * opt_data.boardWidth), 'px; position: absolute; border: 3px solid black; float: left; text-align: left; background: url(\'images/snakeBackground100.jpg\');}.score-message {font: 14px;}.previous-scores {font: 14px; font-decoration: bold; height: 300px; width: 150px; float: right; overflow: scroll;}.content1 {width: 800px;}.previous-scores-text {font-size: 12px; color: blue;}form {display: inline;}.hotkeys {float: left; font: 12px; margin-top: 5px;}.finalScore {float: right; display: none; color: red; text-align: center; padding-top: 10px; font-weight: bold; font-size: 32px;}#pauseGameOverlay {display: none; position: absolute; z-index: 100; top: 0px; left: 0px; height: 100%; width: 100%; background: url(\'images/transparentWhite.png\');}#pauseGameMessage {color: red; height: 100%; width: 100%; font-weight: bold; font-size: 48px; display: -webkit-box; -webkit-box-orient: horizontal; -webkit-box-pack: center; -webkit-box-align: center; display: -moz-box; -moz-box-orient: horizontal; -moz-box-pack: center; -moz-box-align: center; display: box; box-orient: horizontal; box-pack: center; box-align: center;}#pauseButton {z-index: 101;}#saveButton {z-index: 101;}</STYLE><div align="center"><DIV ID="pauseGameOverlay"><DIV ID="pauseGameMessage">Game Paused</DIV></DIV><H1>Welcome to Snake - Special Version for my Baby Nicole <3</H1><P>Use the directional arrows to guide the Snake to the red gems in order to score points. You will lose if you hit the wall or your body.</P><P>You can save game at any time during the game. You can load your previous save once the game is over.</P><FORM ID="snakeSpeedForm" NAME="snakeSpeedForm">Enter snake speed in moves per second:<INPUT TYPE="radio" NAME="snakeSpeed" VALUE="5">5</INPUT><INPUT TYPE="radio" NAME="snakeSpeed" VALUE="10" CHECKED>10</INPUT><INPUT TYPE="radio" NAME="snakeSpeed" VALUE="20">20</INPUT><INPUT TYPE="radio" NAME="snakeSpeed" VALUE="30">30</INPUT><INPUT TYPE="radio" NAME="snakeSpeed" VALUE="40">40</INPUT><INPUT TYPE="radio" NAME="snakeSpeed" VALUE="50">50</INPUT><INPUT TYPE="button" ID="restartButton" VALUE="New Game" ONCLICK="snakeManager.startGame()"><INPUT TYPE="button" ID="loadButton" style="position: relative" VALUE="Load" ONCLICK="snakeManager.loadGame()"></FORM><INPUT TYPE="button" ID="pauseButton" style="position: relative" VALUE="Pause" ONCLICK="snakeManager.pauseGame()"><INPUT TYPE="button" ID="saveButton" style="position: relative" VALUE="Save" ONCLICK="snakeManager.saveGame()"><BR><DIV STYLE="width: 600px; text-align: left"><DIV ID="hotkeys" CLASS="hotkeys">Hotkeys:<LI>N --------> New Game</LI><LI>Space ----> Pause Game</LI><LI>S --------> Save Game</LI><LI>L ----> Load Game</LI></DIV><DIV ID="finalScore" CLASS="finalScore">Game over. Your score is:<DIV ID="finalScoreNum" STYLE="display: inline">0</DIV></DIV></DIV><DIV style="clear: both"><H3>Current Score:<DIV ID="counter" CLASS="counter"></DIV></H3></DIV><DIV ID="content1" class="content1"><DIV ID="gameBoard" CLASS="game-board">');
  snake.gameBoard(opt_data, output);
  output.append('</DIV><DIV ID="previousScores" CLASS="previous-scores">Previous Scores:</DIV></DIV></div>');
  return opt_sb ? '' : output.toString();
};
