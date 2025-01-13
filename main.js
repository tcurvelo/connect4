import { Board } from "./board.js";

window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas");
  canvas.width = Math.min(this.document.documentElement.clientWidth, 700);
  canvas.height = (canvas.width / 7) * 6;
  const ctx = canvas.getContext("2d");
  const msgPanel = document.getElementById("msgPanel");
  const board = new Board(canvas, 7, 6, ctx, msgPanel);

  document.getElementById("reset").addEventListener("click", () => {
    board.reset();
  });

  function animate(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    board.update();
    board.draw(ctx);
    requestAnimationFrame(animate);
  }
  animate(0);
});
