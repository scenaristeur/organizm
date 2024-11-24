export class InputHistory {
  constructor() {
    this.history = [];
  }

  add(input) {
    this.history.push(input);
  }

  get() {
    console.log("get");
    return this.history;
  }
}
