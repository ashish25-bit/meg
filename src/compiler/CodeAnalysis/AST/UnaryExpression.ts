import { Expression } from './Expression';
import { NodeKind } from './NodeKind';
import { UnaryOperatorKind } from './UnaryOperatorKind';
import { Types } from './Types';

export class UnaryExpression extends Expression {
    type: string;
    kind: NodeKind;
    operand: Expression;
    operator: {kind: UnaryOperatorKind | null, value: string};

    constructor(operand: Expression, operator: {kind: UnaryOperatorKind | null, value: string}) {
        super();
        this.operand = operand;
        this.operator = operator;
        this.type = Types.UnaryExpression;
        this.kind = NodeKind.UnaryExpression;
    }
}
