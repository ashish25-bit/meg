import { TokenKind } from './TokenKind';
import { SyntaxToken } from "./SyntaxToken";

export abstract class ExpressionSyntax {
    [x: string]: any;
    abstract kind: TokenKind;
}

export class WorngTokenExpression extends ExpressionSyntax {
    kind: TokenKind;
    constructor() {
        super();
        this.kind = TokenKind.WrongToken;
    }
}

export class LiteralExpressionSyntax extends ExpressionSyntax {
    kind: TokenKind;
    value: number | null;
    constructor(value: number | null) {
        super();
        this.kind = TokenKind.NumberToken;
        this.value = value;
    }
}

export class BinaryExpressSyntax extends ExpressionSyntax {
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
