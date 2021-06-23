import { Expression } from "./Expression";
import { NodeKind } from "./NodeKind";
import { VariableExpression } from "./VariableExpression";

export class VariableDeclarationExpression extends Expression {
    type: string;
    kind: NodeKind;
    variable: VariableExpression;
    initializer: Expression;

    constructor(variable: VariableExpression, initializer: Expression) {
        super();
        this.variable = variable;
        this.initializer = initializer;
        this.type = 'declaration-statement';
        this.kind = NodeKind.VariableDeclarationExpression;
    }
}