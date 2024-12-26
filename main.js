import { InputHandler } from "./input.js";
import { Piece } from "./piece.js";

window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 700;
  canvas.height = 600;
  const cols = 7;
  const rows = 6;

  const players = {
    YELLOW: 0,
    BLUE: 1,
  };

  class Board {
    constructor(canvas, cols, rows) {
      this.width = canvas.width;
      this.height = canvas.height;
      this.cols = cols;
      this.rows = rows;
      this.pieces = Array.from(Array(this.cols), () => Array(this.rows));
      this.columns = [];
      this.done = false;
      this.currentPlayer = players.YELLOW;

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

        for (let j = 0; j < this.rows; j++) {
          if (this.pieces[col][j] === undefined) {
            this.pieces[col][j] = new Piece(this.currentPlayer, false);
            break;
          }
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
        this.currentPlayer =
          (this.currentPlayer + 1) % Object.keys(players).length;
      }
    }

    draw() {
      ctx.fillStyle = "white";
      ctx.strokeStyle = "green";
      ctx.lineWidth = 1;
      ctx.fillRect(this.x, this.y, this.width, this.height);
      for (let i = 0; i < this.cols; i++) {
        ctx.stroke(this.columns[i]);
      }
      for (let j = 0; j < this.rows; j++) {
        ctx.strokeRect(
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
              ctx.fillStyle = piece.background();
              ctx.fillRect(
                (i * this.width) / this.cols,
                this.height - ((j + 1) * this.height) / this.rows,
                this.width / this.cols,
                this.height / this.rows
              );
            }

            ctx.fillStyle = piece.color();
            ctx.beginPath();
            ctx.arc(
              (i * this.width) / this.cols + this.width / this.cols / 2,
              this.height * (1 - j / this.rows - 1 / this.rows / 2),
              this.width / this.cols / 2.5,
              0,
              Math.PI * 2
            );
            ctx.fill();
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

  const board = new Board(canvas, cols, rows);

  function animate(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    board.update();
    board.draw(ctx);
    requestAnimationFrame(animate);
  }
  animate(0);
});
