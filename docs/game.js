let scoreDiv = document.getElementById("score");
let score;
let moves;

newGame();

document.addEventListener('keydown', function(event) {
  let move = -1;
  if(event.keyCode == 78) {
    newGame();
    return undefined;
  } else if(event.keyCode == 39) {
    move = 0;
  } else if(event.keyCode == 38) {
    move = 1;
  } else if(event.keyCode == 37) {
    move = 2;
  } else if(event.keyCode == 40) {
    move = 3;
  }
  if (move == -1) {
    return undefined;
  }
  move = moves[move];
  if (move["deadlock"]) {
     return undefined;
  }
  powerGrid = move["grid"];
  setAllSquares();
  score += move["score"];
  showScore();
  setRandom();
  moves = getMoves(powerGrid);

  checkGameOver();
});

function newGame() {
  score = 0;
  showScore();

  for (let i = 0; i < 16; i++) {
    setSquare(i, -1);
  }
  setRandom();
  setRandom();

  moves = getMoves(powerGrid);
}

function showScore() {
  scoreDiv.innerHTML = "Score: " + score;
}

function checkGameOver() {
  let gameOver = moves.reduce(function(t, c) {
    return (t && c["deadlock"]);
  }, true);
  if (gameOver) {
    scoreDiv.innerHTML = "Game Over. Final score: " + score;
  }
}
