let scoreDiv = document.getElementById("score");
let score;

let moves;

let agentDiv = document.getElementById("agent");
let agent = "Human";

newGame();

document.addEventListener('keydown', function(event) {
  if (event.keyCode == 78) {
    newGame();
    return undefined;
  }

  if (event.keyCode == 72) {
    agent = "Human";
    showAgent();
    return undefined;
  }

  if (event.keyCode == 71) {
    agent = "Greedy";
    showAgent();
    return undefined;
  }

  if (agent != "Human") {
    return undefined;
  }

  // Human agent
  if (event.keyCode == 39) {
    makeMove(0);
  } else if(event.keyCode == 38) {
    makeMove(1);
  } else if(event.keyCode == 37) {
    makeMove(2);
  } else if(event.keyCode == 40) {
    makeMove(3);
  }
});

// Game loop (for non-human agents)
setInterval(function() {
  if (agent == "Greedy") {
    let maxScore = -1;
    let maxMoves = [];

    for (let i = 0; i < 4; i++) {
      if (!(moves[i]["deadlock"])) {
        let s = moves[i]["score"];
        if (s == maxScore) {
          maxMoves.push(i);
        }
        if (s > maxScore) {
          maxMoves = [i];
          maxScore = s;
        }
      }
    }

    if (maxMoves.length == 0) {
      return undefined;
    }

    let m = maxMoves[Math.floor(Math.random() * maxMoves.length)];
    makeMove(m);
  }
}, 50);

function newGame() {
  score = 0;
  showScore();
  showAgent();

  for (let i = 0; i < 16; i++) {
    setSquare(i, -1);
  }
  setRandom();
  setRandom();

  moves = getMoves(powerGrid);
}

function makeMove(m) {
  let move = moves[m];
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
}

function showScore() {
  scoreDiv.innerHTML = "Score: " + score;
}

function showAgent() {
  agentDiv.innerHTML = "Agent: " + agent;
}

function checkGameOver() {
  let gameOver = moves.reduce(function(t, c) {
    return (t && c["deadlock"]);
  }, true);
  if (gameOver) {
    scoreDiv.innerHTML = "Game Over. Final score: " + score;
  }
}
