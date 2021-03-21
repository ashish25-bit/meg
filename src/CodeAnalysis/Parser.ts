import {
    ExpressionSyntax,
    BinaryExpressSyntax,
    ParenthesizeExpressionSyntax,
    LiteralExpressionSyntax,
    WorngTokenExpression
} from './ExpressionSyntax';
import { Lexer } from './Lexer';
import { SyntaxToken } from './SyntaxToken';
import { TokenKind } from './TokenKind';

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

    operatorPrecedence(kind: TokenKind): number {
        switch(kind) {
            case TokenKind.MultiplyToken:
            case TokenKind.DivideToken:
                return 2;

            case TokenKind.PlusToken:
            case TokenKind.MinusToken:
                return 1;
            
            default:
                return 0;
        }
    }

    parser() {
        this.setTokens();
        return this.parseExpression();
    }

    parseExpression(precedence: number = 0): ExpressionSyntax {
        let left:ExpressionSyntax = this.parsePrimaryExpression();

        while (this.getCurrent().kind != TokenKind.EndOfFileToken) {
            let nextPrecendece:number = this.operatorPrecedence(this.getCurrent().kind);
            if (nextPrecendece == 0 || nextPrecendece <= precedence)
                break;

            let operatorToken = this.nextToken();
            let right = this.parseExpression(nextPrecendece);
            left = new BinaryExpressSyntax(left, operatorToken, right);
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
            let expression = this.parseTerm(true);
            if (this.matchKind(TokenKind.CloseBracketToken))
                return new ParenthesizeExpressionSyntax(left, expression, this.nextToken());
        }

        if (this.matchKind(TokenKind.NumberToken))
            return new LiteralExpressionSyntax(this.nextToken().value);
        return new WorngTokenExpression();
    }
}
