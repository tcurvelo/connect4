export class Piece {
  constructor(player) {
    this.player = player;
    this.winner = false;
  }

  equals(other) {
    return this.player !== other?.player;
  }

  color() {
    return this.player ? "#2222EE" : "#FFD700";
  }

  background() {
    return this.winner ? "red" : "white";
  }

  win() {
    this.winner = true;
  }

  won() {
    return this.winner;
  }
}
