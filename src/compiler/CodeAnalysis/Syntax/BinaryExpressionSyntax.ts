import { TokenKind } from './TokenKind';
import { SyntaxToken } from "./SyntaxToken";
import { ExpressionSyntax } from './ExpressionSyntax';


export class BinaryExpressionSyntax extends ExpressionSyntax {
    kind: TokenKind;
    left: ExpressionSyntax;
    operator: SyntaxToken;
    right: ExpressionSyntax;

    constructor(left: ExpressionSyntax, operator: SyntaxToken, right: ExpressionSyntax) {
        super();
        this.left = left;
        this.operator = operator;
        this.right = right;
        this.kind = TokenKind.BinaryExpressionToken;
    }
}
