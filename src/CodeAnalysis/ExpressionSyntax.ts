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
    value: number | null | boolean;
    constructor(value: number | null | boolean, kind: TokenKind) {
        super();
        this.kind = kind;
        this.value = value;
    }
}

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

export class UnaryExpressionSyntax extends ExpressionSyntax {
    kind: TokenKind;
    operand: ExpressionSyntax;
    operator: SyntaxToken;

    constructor(operator: SyntaxToken, operand: ExpressionSyntax) {
        super();
        this.kind = TokenKind.UnaryExpressionSToken;
        this.operator = operator;
        this.operand = operand;
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
