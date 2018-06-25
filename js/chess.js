var board,
  game = new Chess(),
  statusEl = $('#status'),
  fenEl = $('#fen'),
  pgnEl = $('#pgn');

const newGame = () => {
    board,
    game = new Chess(),
    statusEl = $('#status'),
    fenEl = $('#fen'),
    pgnEl = $('#pgn');
    board = ChessBoard('board', cfg);
}
// do not pick up pieces if the game is over
// only pick up pieces for the side to move
const onDragStart = function(source, piece, position, orientation) {
  if (game.game_over() === true || piece.search(/^b/) !== -1){
    return false;
  }
};

const onDrop = function(source, target) {
  // see if the move is legal
  const move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  });

  // illegal move
  if (move === null) return 'snapback';

  //computer Turn
  window.setTimeout(computerMove,250);

  updateStatus();
};

// update the board position after the piece snap
// for castling, en passant, pawn promotion
const onSnapEnd = function() {
  board.position(game.fen());
};

const updateStatus = function() {
  let status = '';

  let moveColor = 'White';
  if (game.turn() === 'b') {
    moveColor = 'Black';
  }

  // checkmate?
  if (game.in_checkmate() === true) {
    status = 'Game over, ' + moveColor + ' is in checkmate.';
  }

  // draw?
  else if (game.in_draw() === true) {
    status = 'Game over, drawn position';
  }

  // game still on
  else {
    status = moveColor + ' to move';

    // check?
    if (game.in_check() === true) {
      status += ', ' + moveColor + ' is in check';
    }
  }

  statusEl.html(status);
  fenEl.html(game.fen());
  pgnEl.html(game.pgn());
};

let cfg = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
};

const computerMove = () =>{
  let possibleMoves = game.moves();

  //if the game is over, don't make any moves
  if (possibleMoves.length === 0){
    if(game.in_checkmate()){
      alert("Checkmate! You win!")
    }
    if(game.in_stalemate()){
      alert("Stalemate! Game is a draw!")
    }
    return
  }

  let randomNumber = Math.floor(Math.random() * possibleMoves.length);
  game.move(possibleMoves[randomNumber]);
  board.position(game.fen());
}

board = ChessBoard('board', cfg);

updateStatus();
