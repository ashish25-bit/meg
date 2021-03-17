import { input } from './input';

enum TokenKind {
    NumberToken,
    BadToken,
    PlusToken,
    MinusToken,
    MultiplyToken,
    DivideToken,
    OpenBracketToken,
    CloseBracketToken,
    EndOfFile
};

class SyntaxToken {
    public token:string;
    public kind:TokenKind;
    public value:number|null;

    constructor(token:string, tokenKind:TokenKind, value:number|null) {
        this.token = token;
        this.kind = tokenKind;
        this.value = value;
    }
}

class Lexer {
    private expression: string;
    private position: number;

    constructor(expression: string) {
        this.expression = expression;
        this.position = -1;
    }

    private next = ():void => { this.position++ }
    private initializePos = ():void => { this.position = -1 }

    getChar():string {
        if (this.position === this.expression.length)
            return '\0';
        return this.expression[this.position]
    }

    // checks whether the char is a digit or not
    isDigit():boolean {
        const char:string = this.getChar();
        return !isNaN(parseFloat(char)) || char === '.';
    } 

    nextToken(): SyntaxToken {
        let ch:string = this.getChar();

        // end of file
        if (ch === '\0')
            return new SyntaxToken('EOF', TokenKind.EndOfFile, null);

        // ch is a digit
        if (this.isDigit()) {
            let num:string = "";
            while (this.isDigit()) {
                num += this.getChar();
                this.next();
            }

            const isNumber:boolean = !isNaN(parseFloat(num));

            this.position--;

            return new SyntaxToken(
                num,
                isNumber ? TokenKind.NumberToken : TokenKind.BadToken,
                isNumber ? parseFloat(num) : null
            );
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
            return new SyntaxToken('+', TokenKind.OpenBracketToken, null);

        if (ch === ')') 
            return new SyntaxToken('+', TokenKind.CloseBracketToken, null);

        return new SyntaxToken(ch, TokenKind.BadToken, null);
    }

    lexerMethod():void {
        while (this.position < this.expression.length) {
            this.next();
            let ch:string = this.getChar();
            
            // whitespace
            if (ch === ' ') continue;

            const token:SyntaxToken = this.nextToken();
            console.log(`${token.token}: ${TokenKind[token.kind]} ${token.value}`);
        }
        this.initializePos();
    }
}

async function main():Promise<void> {
    while (true) {
        const expression: string = await input("> Enter the algebraic expression: ");
        if (expression === 'q') break;

        const lexer = new Lexer(expression);
        lexer.lexerMethod();
    }
}

main();