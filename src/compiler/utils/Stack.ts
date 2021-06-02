export class Stack<T> {
  private stack: T[];
  private _top: number;

  constructor () {
    this._top = -1;
    this.stack = [];
  }

  get _stack(): T[] {
    return this.stack;
  }

  public top(): T {
    if (this.isEmpty())
      throw new Error("Empty stack");

    return this.stack[this._top];
  }

  public size(): number {
    return this.stack.length;
  }

  public isEmpty(): boolean {
    return this._top === -1;
  }

  public push(data: T): void {
    this.stack.push(data);
    this._top++;
  }

  public pop(): void {
    if (this.isEmpty()) return;

    this.stack.pop();
    this._top--;
  }
}