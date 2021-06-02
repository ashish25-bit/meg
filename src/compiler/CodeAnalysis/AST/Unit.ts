import { Expression } from "./Expression";
import { Scope } from "./Scope";

export class Unit {
  public expression: Expression;
  public scope: Scope;

  constructor(exp: Expression, sc: Scope) {
    this.scope = sc;
    this.expression = exp;
  }
}