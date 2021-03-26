import { getKeywordKind } from './Keyword';
import { SyntaxToken } from './SyntaxToken';
import { TokenKind } from './TokenKind';

export class Lexer {
    private expression: string;
    private position: number;
    private _errors: Array<string>;

    constructor(expression: string) {
        this.expression = expression;
        this.position = -1;
        this._errors = [];
    }

    private next = (): void => { this.position++; };
    private initializePos = (): void => { this.position = -1; };

    get errors(): Array<string> {
        return this._errors;
    }

    getChar(): string {
        if (this.position === this.expression.length)
            return '\0';
        return this.expression[this.position];
    }

    // checks whether the char is a digit or not
    isDigit(): boolean {
        const char: string = this.getChar();
        return !isNaN(parseFloat(char)) || char === '.';
    }

    isAlpha(): boolean {
        const char: string = this.getChar();
        return (char >= 'a' && char <= 'z') || char >= 'A' && char <= 'Z';
    }

    nextToken(): SyntaxToken {
        this.next();
        let ch: string = this.getChar();

        // end of file
        if (ch === '\0')
            return new SyntaxToken('EOF', TokenKind.EndOfFileToken, null);

        // is a whiteSpace
        if (ch === ' ') {
            let str = "";
            while (this.getChar() == ' ') {
                str = str + ' ';
                this.next();
            }
            this.position--;
            return new SyntaxToken(str, TokenKind.WhiteSpaceToken, null);
        }

        // ch is a digit
        if (this.isDigit()) {
            let num: string = "";
            while (this.isDigit()) {
                num += this.getChar();
                this.next();
            }

            const isNumber: boolean = !isNaN(parseFloat(num));

            this.position--;

            return new SyntaxToken(
                num,
                isNumber ? TokenKind.NumberToken : TokenKind.BadToken,
                isNumber ? parseFloat(num) : null
            );
        }

        if (this.isAlpha()) {
            let str: string = "";
            while (this.isAlpha()) {
                str += this.getChar();
                this.next();
            }

            if (this.getChar() !== '\0' && this.getChar() !== ' ')
                this.position--;

            const kind: TokenKind = getKeywordKind(str);
            if (kind === TokenKind.IdentifierToken)
                return new SyntaxToken(str, kind, null);

            if (kind === TokenKind.BooleanTrueToken)
                return new SyntaxToken(str, kind, true);

            if (kind === TokenKind.BooleanFalseToken)
                return new SyntaxToken(str, kind, false);
        }

        // binary and operator
        if (ch === '&') {
            this.next();
            if (this.getChar() == '&')
                return new SyntaxToken('&&', TokenKind.BinaryAndOperator, null);
            // // can add the bitwise &
            // else 
            //     return new SyntaxToken('&&', TokenKind.BitwiseAndOperator, null);
        }

        // binary or operator
        if (ch === '|') {
            this.next();
            if (this.getChar() == '|')
                return new SyntaxToken('||', TokenKind.BinaryOrOperator, null);
            // // can add the bitwise |
            // else 
            //     return new SyntaxToken('&&', TokenKind.BitwiseOrOperator, null);
        }

        // equals operator
        if (ch === '=') {
            this.next();
            if (this.getChar() === '=')
                return new SyntaxToken('==', TokenKind.EqualityOperator, null)
        }

        if (ch === '!') {
            this.next();
            if (this.getChar() == '=')
                return new SyntaxToken('!=', TokenKind.NotEqualOperator, null);
            
            this.position--;
            return new SyntaxToken('!', TokenKind.UnaryNotOperator, null);
        }

        if (ch === '+')
            return new SyntaxToken('+', TokenKind.PlusToken, null);

        if (ch === '-')
            return new SyntaxToken('-', TokenKind.MinusToken, null);

        if (ch === '*')
            return new SyntaxToken('*', TokenKind.MultiplyToken, null);

        if (ch === '/')
            return new SyntaxToken('/', TokenKind.DivideToken, null);

        if (ch === '(')
            return new SyntaxToken('(', TokenKind.OpenBracketToken, null);

        if (ch === ')')
            return new SyntaxToken(')', TokenKind.CloseBracketToken, null);

        this._errors.push(`Bad token: ${ch}`);
        return new SyntaxToken(ch, TokenKind.BadToken, null);
    }

    lexerMethod(): void {
        while (this.position < this.expression.length) {
            const token: SyntaxToken = this.nextToken();
            console.log(`${token.token}: ${TokenKind[token.kind]} ${token.value}`);
        }
        this.initializePos();
    }
}
