import { Expression } from "./Expression";
import { NodeKind } from "./NodeKind";
import { Types } from "./Types";

export class InitializationExpression extends Expression {
    type: string;
    kind: NodeKind;
    left: Expression;
    right: Expression;

    constructor(left: Expression, right: Expression) {
        super();
        this.left = left;
        this.right = right;
        this.kind = NodeKind.InitializationExpression;
        this.type = Types.InitializationExpression;
    }
}