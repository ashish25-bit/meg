import { TokenKind } from './TokenKind';
import { ExpressionSyntax } from './ExpressionSyntax';


export class VariableExpressionSyntax extends ExpressionSyntax {
    kind: TokenKind;
    token: string;

    constructor(token: string) {
        super();
        this.kind = TokenKind.VariableExpression;
        this.token = token;
    }
}