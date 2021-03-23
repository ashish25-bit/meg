import {
    ExpressionSyntax,
    BinaryExpressionSyntax,
    ParenthesizeExpressionSyntax,
    LiteralExpressionSyntax,
    WorngTokenExpression,
    UnaryExpressionSyntax
} from './ExpressionSyntax';
import { Lexer } from './Lexer';
import { SyntaxToken } from './SyntaxToken';
import { TokenKind } from './TokenKind';
import {
    binaryOperatorPrecedence,
    unaryOperatorPrecedence
} from './OperatorPrecedence';
import { getKeywordKind } from './Keyword';

export class Parser {
    private expression: string;
    private tokens: Array<SyntaxToken>;
    private position: number;
    private _errors: Array<string>;

    constructor(exp: string) {
        this.expression = exp;
        this.tokens = [];
        this.position = 0;
        this._errors = [];
    }

    get errors(): Array<string> {
        return this._errors;
    }

    setTokens(): void {
        this.expression += '\0';
        const lexer = new Lexer(this.expression);

        let token: SyntaxToken = lexer.nextToken();
        while (token.kind !== TokenKind.EndOfFileToken) {
            if (token.kind !== TokenKind.BadToken && token.kind !== TokenKind.WhiteSpaceToken)
                this.tokens.push(token);
            token = lexer.nextToken();
        }
        this.tokens.push(token);
        this._errors = [...lexer.errors];
    }

    nextToken(): SyntaxToken {
        const current = this.getCurrent();
        this.position++;
        return current;
    }

    getCurrent(): SyntaxToken {
        return this.tokens[this.position];
    }

    parser(): ExpressionSyntax {
        this.setTokens();
        const expression = this.parseExpression();
        this.matchKind(TokenKind.EndOfFileToken);
        return expression;
    }

    parseExpression(precedence: number = 0): ExpressionSyntax {
        let left:ExpressionSyntax;

        let unaryPrecedence = unaryOperatorPrecedence(this.getCurrent().kind);

        if (unaryPrecedence != 0 && unaryPrecedence >= precedence) {
            let operator: SyntaxToken = this.nextToken();

            // if the expression is -1*2+3
            if (this.getCurrent().kind === TokenKind.NumberToken)
                left = new UnaryExpressionSyntax(operator, this.parsePrimaryExpression());
            
            else {
                let operand: ExpressionSyntax = this.parseExpression();
                left = new UnaryExpressionSyntax(operator, operand)
            }
        }
        else
            left = this.parsePrimaryExpression();

        while (this.getCurrent().kind != TokenKind.EndOfFileToken) {
            let nextPrecendence:number = binaryOperatorPrecedence(this.getCurrent().kind);
            if (nextPrecendence == 0 || nextPrecendence <= precedence)
                break;

            let operatorToken = this.nextToken();
            let right = this.parseExpression(nextPrecendence);
            left = new BinaryExpressionSyntax(left, operatorToken, right);
        }
        return left;
    }

    matchKind(kind: TokenKind): boolean {
        if (this.getCurrent().kind === kind)
            return true;
        // report error
        this._errors.push(`ERROR: Unexpected token ${TokenKind[this.getCurrent().kind]}, expected ${TokenKind[kind]}`);
        return false;
    }

    parsePrimaryExpression(): ExpressionSyntax {
        if (this.getCurrent().kind === TokenKind.OpenBracketToken) {
            let left = this.nextToken();
            let expression = this.parseExpression();
            if (this.matchKind(TokenKind.CloseBracketToken))
                return new ParenthesizeExpressionSyntax(left, expression, this.nextToken());
        }

        else if (
            this.getCurrent().kind === TokenKind.BooleanTrueToken ||
            this.getCurrent().kind === TokenKind.BooleanFalseToken
        ) {
            const kind = this.getCurrent().value === true ? TokenKind.BooleanTrueToken : TokenKind.BooleanFalseToken;
            return new LiteralExpressionSyntax(this.nextToken().value, kind);
        }

        if (this.matchKind(TokenKind.NumberToken))
            return new LiteralExpressionSyntax(this.nextToken().value, TokenKind.NumberToken);
        return new WorngTokenExpression();
    }
}
