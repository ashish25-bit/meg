import { Expression } from './Expression';
import { NodeKind } from './NodeKind';
import { Types } from './Types';

export class VariableExpression extends Expression {
    type: string;
    kind: NodeKind;
    value: string;

    constructor(value: string) {
        super();
        this.kind = NodeKind.VariableExpression;
        this.value = value;
        this.type = Types.VariableExpression;
    }
}