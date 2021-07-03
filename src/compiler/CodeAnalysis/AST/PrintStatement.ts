import { Expression } from "./Expression";
import { NodeKind } from "./NodeKind";
import { Types } from "./Types";

export class PrintStatement extends Expression {
  type: string;
  kind: NodeKind;
  variable: Expression;

  constructor(variable: Expression) {
    super();
    this.type = Types.PrintStatement;
    this.kind = NodeKind.PrintStatement;
    this.variable = variable;
  }
}
