export class InputHandler {
  constructor(canvas) {
    this.clicked = [];
    canvas.addEventListener("mouseup", (event) => {
      this.clicked = [event.offsetX, event.offsetY];
    });
  }
}
