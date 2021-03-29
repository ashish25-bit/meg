import { TokenKind } from './TokenKind';
import { ExpressionSyntax } from './ExpressionSyntax';
import { SyntaxToken } from './SyntaxToken';

export class InitializationExpressionSyntax extends ExpressionSyntax {
    left: ExpressionSyntax;
    operator: SyntaxToken;
    right: ExpressionSyntax;
    kind: TokenKind;

    constructor(left: ExpressionSyntax, operator: SyntaxToken, right: ExpressionSyntax) {
        super();
        this.left = left;
        this.operator = operator;
        this.right = right;
        this.kind = TokenKind.InitializationExpression;
    }
}