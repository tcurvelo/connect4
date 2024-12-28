import { Piece } from "./piece.js";
import { InputHandler } from "./input.js";
import { MessageHandler } from "./messages.js";

const players = {
  YELLOW: 0,
  BLUE: 1,
};

export class Board {
  constructor(canvas, cols, rows, ctx, msgPanel) {
    this.width = canvas.width;
    this.height = canvas.height;
    this.cols = cols;
    this.rows = rows;
    this.ctx = ctx;
    this.msgPanel = msgPanel;

    this.pieces = Array.from(Array(this.cols), () => Array(this.rows));
    this.columns = [];
    this.done = false;
    this.currentPlayer = players.YELLOW;
    this.messageHandler = new MessageHandler(
      navigator.language || navigator.userLanguage
    );

    console.log(this.messageHandler);

    for (let i = 0; i < this.cols; i++) {
      let column = new Path2D();
      column.rect(
        (i * this.width) / this.cols,
        0,
        this.width / this.cols,
        this.height
      );
      this.columns.push(column);
    }
    this.input = new InputHandler(canvas);
  }

  update() {
    if (!this.done && this.input.clicked.length > 0) {
      let x = this.input.clicked[0];
      let col = Math.floor((x / this.width) * this.cols);
      this.input.clicked = [];

      let colFull = true;
      for (let j = 0; j < this.rows; j++) {
        if (this.pieces[col][j] === undefined) {
          this.pieces[col][j] = new Piece(this.currentPlayer, false);
          colFull = false;
          break;
        }
      }
      if (colFull) {
        return;
      }
      // Check for a win
      let winnerRow = this.checkForWin();
      if (winnerRow) {
        for (const { x, y } of winnerRow) {
          this.pieces[x][y].win();
        }
        this.done = true;
        console.log("Player " + this.currentPlayer + " wins!");
      }

      // Update the current player
      if (!this.done) {
        this.currentPlayer =
          (this.currentPlayer + 1) % Object.keys(players).length;
      }
    }

    if (this.done) {
      if (this.currentPlayer === players.YELLOW) {
        this.setMessage(this.messageHandler.YELLOW_WON);
      } else {
        this.setMessage(this.messageHandler.BLUE_WON);
      }
    } else {
      if (this.currentPlayer === players.YELLOW) {
        this.setMessage(this.messageHandler.YELLOW_TIME);
      } else {
        this.setMessage(this.messageHandler.BLUE_TIME);
      }
    }
  }

  setMessage(message) {
    this.msgPanel.innerText = message;
  }

  draw() {
    this.ctx.fillStyle = "white";
    this.ctx.strokeStyle = "green";
    this.ctx.lineWidth = 1;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
    for (let i = 0; i < this.cols; i++) {
      this.ctx.stroke(this.columns[i]);
    }
    for (let j = 0; j < this.rows; j++) {
      this.ctx.strokeRect(
        0,
        (j * this.height) / this.rows,
        this.width,
        this.height
      );
    }

    // Draw the pieces
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        let piece = this.pieces[i][j];

        if (piece != undefined) {
          // highlight the winner piece
          if (this.done && piece.won()) {
            this.ctx.fillStyle = piece.background();
            this.ctx.fillRect(
              (i * this.width) / this.cols,
              this.height - ((j + 1) * this.height) / this.rows,
              this.width / this.cols,
              this.height / this.rows
            );
          }

          this.ctx.fillStyle = piece.color();
          this.ctx.beginPath();
          this.ctx.arc(
            (i * this.width) / this.cols + this.width / this.cols / 2,
            this.height * (1 - j / this.rows - 1 / this.rows / 2),
            this.width / this.cols / 2.5,
            0,
            Math.PI * 2
          );
          this.ctx.fill();
        }
      }
    }
  }

  checkForWin() {
    const directions = [
      { x: 1, y: 0 }, // horizontal
      { x: 0, y: 1 }, // vertical
      { x: 1, y: 1 }, // diagonal down-right
      { x: 1, y: -1 }, // diagonal up-right
    ];

    const checkDirection = (x, y, dx, dy) => {
      const piece = this.pieces[x][y];
      if (piece === undefined) return false;
      let winnerRow = [{ x: x, y: y }];
      for (let k = 1; k < 4; k++) {
        let _x = x + k * dx;
        let _y = y + k * dy;
        if (piece.equals(this.pieces[_x]?.[_y])) return false;
        winnerRow.push({ x: _x, y: _y });
      }
      return winnerRow;
    };

    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        for (const { x, y } of directions) {
          let winnerRow = checkDirection(i, j, x, y);
          if (winnerRow) return winnerRow;
        }
      }
    }

    return false;
  }
}
