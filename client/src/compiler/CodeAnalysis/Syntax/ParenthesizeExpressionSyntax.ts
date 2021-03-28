import { TokenKind } from './TokenKind';
import { SyntaxToken } from "./SyntaxToken";
import { ExpressionSyntax } from './ExpressionSyntax';


export class ParenthesizeExpressionSyntax extends ExpressionSyntax {
    kind: TokenKind;
    openBracket: SyntaxToken;
    expression: ExpressionSyntax;
    closeBracket: SyntaxToken;

    constructor(openBracket: SyntaxToken, expression: ExpressionSyntax, closeBracket: SyntaxToken) {
        super();
        this.kind = TokenKind.ParenthesizedExpression;
        this.openBracket = openBracket;
        this.expression = expression;
        this.closeBracket = closeBracket;
    }
}
