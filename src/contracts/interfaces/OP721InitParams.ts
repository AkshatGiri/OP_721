export class OP721InitParams {
  readonly name: string;
  readonly symbol: string;

  constructor(name: string, symbol: string) {
    this.name = name;
    this.symbol = symbol;
  }
}