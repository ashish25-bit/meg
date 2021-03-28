import { Expression } from './Expression';
import { NodeKind } from './NodeKind';

export class LiteralExpression extends Expression {
    type: any;
    kind: NodeKind;
    value: any;

    constructor(value: any) {
        super();
        this.kind = NodeKind.LiteralExpression;
        this.type = typeof (value);
        this.value = value;
    }
}
