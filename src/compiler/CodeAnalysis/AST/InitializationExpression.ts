import { BinaryOperatorKind } from "./BinaryOperatorKind";
import { Expression } from "./Expression";
import { NodeKind } from "./NodeKind";
import { Types } from "./Types";

export class InitializationExpression extends Expression {
    type: string;
    kind: NodeKind;
    left: Expression;
    operator: {kind: BinaryOperatorKind | null, value: string};
    right: Expression;

    constructor(left: Expression, operator: {kind: BinaryOperatorKind | null, value: string}, right: Expression) {
        super();
        this.left = left;
        this.operator = operator;
        this.right = right;
        this.kind = NodeKind.InitializationExpression;
        this.type = Types.InitializationExpression;
    }
}