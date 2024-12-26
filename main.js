import { Board } from "./board.js";

window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas");
  canvas.width = 700;
  canvas.height = 600;
  const ctx = canvas.getContext("2d");
  const msgPanel = document.getElementById("msgPanel");
  const board = new Board(canvas, 7, 6, ctx, msgPanel);

  function animate(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    board.update();
    board.draw(ctx);
    requestAnimationFrame(animate);
  }
  animate(0);
});
