class Piece {
  x;
  y;
  color;
  shape;
  ctx;
  typeId;

  constructor(ctx) {
    this.ctx = ctx;
    this.spawn();
  }

  spawn() {
    this.typeId = this.randomizeTetrominoType(COLORS.length - 1);
    this.shape = SHAPES[this.typeId];
    this.color = COLORS[this.typeId];
    this.x = 0;
    this.y = 0;
  }

  drawPiece() {
    this.ctx.fillStyle = this.color;
    this.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.ctx.fillRect(this.x + x, this.y + y, 1, 1);
        }
      });
    });
  }

  move(piece) {
    this.x = piece.x;
    this.y = piece.y;
    this.shape = piece.shape;
  }

  setStartingPosition() {
    this.x = this.typeId === 4 ? 4 : 3;
  }

  randomizeTetrominoType(differentTypes) {
    return Math.floor(Math.random() * differentTypes + 1);
  }
}
