import { TokenKind } from './TokenKind';
import { SyntaxToken } from "./SyntaxToken";
import { ExpressionSyntax } from './ExpressionSyntax';


export class UnaryExpressionSyntax extends ExpressionSyntax {
    kind: TokenKind;
    operand: ExpressionSyntax;
    operator: SyntaxToken;

    constructor(operator: SyntaxToken, operand: ExpressionSyntax) {
        super();
        this.kind = TokenKind.UnaryExpressionToken;
        this.operator = operator;
        this.operand = operand;
    }
}
