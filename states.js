class Blue {
  constructor(fsm) {
    this.fsm = fsm;
  }
  change() {
    this.fsm.transitionTo(new Red(this.fsm));
  }
  toString() {
    return "Blue";
  }
  inputHandler(input) {
    console.log("Blue input handler");
  }

}
