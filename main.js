const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const canvasNext = document.getElementById('next');
const ctxNext = canvasNext.getContext('2d');

let scoreboard = {
  score: 0,
  level: 0,
  lines: 0
}

function updateScoreboard(category, score) {
  let element = document.getElementById(category);
  if (element) {
    element.textContent = score;
  }
}

let session = new Proxy(scoreboard, {
  set: (target, category, score) => {
    target[category] = score;
    updateScoreboard(category, score);
    return true;
  }
});

let requestId;

moves = {
  [KEY.LEFT]: piece => ({ ...piece, x: piece.x - 1 }),
  [KEY.RIGHT]: piece => ({ ...piece, x: piece.x + 1 }),
  [KEY.DOWN]: piece => ({ ...piece, y: piece.y + 1 }),
  [KEY.SPACE]: piece => ({ ...piece, y: piece.y + 1 }),
  [KEY.UP]: piece => board.rotate(piece)
};

let board = new Board(ctx, ctxNext);
addEventListener();
nextTetronimo();

function nextTetronimo() {
  ctxNext.canvas.width = 4 * BLOCK_SIZE;
  ctxNext.canvas.height = 4 * BLOCK_SIZE;
  ctxNext.scale(BLOCK_SIZE, BLOCK_SIZE);
}

function addEventListener() {
  document.addEventListener('keydown', event => {
    if (event.keyCode === KEY.P) {
      pause();
    }
    if (event.keyCode === KEY.ESC) {
      gameOver();
    } else if (moves[event.keyCode]) {
      event.preventDefault();
      let p = moves[event.keyCode](board.piece);
      if (event.keyCode === KEY.SPACE) {
        while (board.valid(p)) {
          session.score += POINTS.HARD_DROP;
          board.piece.move(p);
          p = moves[KEY.DOWN](board.piece);
        }
      } else if (board.valid(p)) {
        board.piece.move(p);
        if (event.keyCode === KEY.DOWN) {
          session.score += POINTS.SOFT_DROP;
        }
      }
    }
  });
}

function resetGame() {
  session.score = 0;
  session.lines = 0;
  session.level = 0;
  board.reset();
  time = { start: 0, elapsed: 0, level: LEVEL[session.level] };
}

function play() {
  resetGame();
  time.start = performance.now();
  if (requestId) {
    cancelAnimationFrame(requestId);
  }

  freeze();
}

function freeze(now = 0) {
  time.elapsed = now - time.start;
  if (time.elapsed > time.level) {
    time.start = now;
    if (!board.drop()) {
      gameOver();
      return;
    }
  }

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  board.drawPiece();
  requestId = requestAnimationFrame(freeze);
}

function gameOver() {
  cancelAnimationFrame(requestId);
  ctx.fillStyle = 'black';
  ctx.fillRect(1, 3, 8, 1.2);
  ctx.font = '1px Arial';
  ctx.fillStyle = 'red';
  ctx.fillText('GAME OVER', 1.8, 4);
}

function pause() {
  if (!requestId) {
    freeze();
    return;
  }

  cancelAnimationFrame(requestId);
  requestId = null;

  ctx.fillStyle = 'black';
  ctx.fillRect(1, 3, 8, 1.2);
  ctx.font = '1px Arial';
  ctx.fillStyle = 'yellow';
  ctx.fillText('PAUSED', 3, 4);
}
