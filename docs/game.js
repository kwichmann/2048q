setRandom();
setRandom();

let moves = getMoves(powerGrid);
let score = 0;

document.addEventListener('keydown', function(event) {
  let move = -1;
  if(event.keyCode == 39) {
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
  console.log(score);
  setRandom();
  moves = getMoves(powerGrid);
});
