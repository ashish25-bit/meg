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
    EndOfFileToken,
    WhiteSpaceToken,
    BinaryExpressionToken
};

abstract class ExpressionSyntax {
    [x: string]: any;
    abstract kind:TokenKind;
}

class NumberExpressSyntax extends ExpressionSyntax {
    kind: TokenKind;
    value: number | null;
    constructor(value: number | null) {
        super();
        this.kind = TokenKind.NumberToken;
        this.value = value;
    }
}

class BinaryExpressSyntax extends ExpressionSyntax {
    kind: TokenKind;
    left: ExpressionSyntax;
    operator: SyntaxToken;
    right: ExpressionSyntax;

    constructor(left: ExpressionSyntax, operator: SyntaxToken, right: ExpressionSyntax) {
        super();
        this.left = left;
        this.operator = operator;
        this.right = right;
        this.kind = TokenKind.BinaryExpressionToken
    }
}

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
        this.next();
        let ch:string = this.getChar();

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
            const token:SyntaxToken = this.nextToken();
            console.log(`${token.token}: ${TokenKind[token.kind]} ${token.value}`);
        }
        this.initializePos();
    }
}

class Parser {
    private expression:string;
    private tokens: Array<SyntaxToken>;
    private position: number;

    constructor(exp: string) {
        this.expression = exp;
        this.tokens = [];
        this.position = 0;
    }

    setTokens():void {
        const lexer = new Lexer(this.expression);

        let token:SyntaxToken = lexer.nextToken();
        while (token.kind !== TokenKind.EndOfFileToken) {
            if (token.kind !== TokenKind.BadToken && token.kind !== TokenKind.WhiteSpaceToken)
                this.tokens.push(token);
            token = lexer.nextToken();
        }
    }

    nextToken(): SyntaxToken {
        const current = this.getCurrent();
        this.position++;
        return current;
    }

    getCurrent(): SyntaxToken {
        return this.tokens[this.position];
    }

    parse():ExpressionSyntax {
        this.setTokens();
        let left:ExpressionSyntax = this.parsePrimaryExpression()

        while (
            this.position < this.tokens.length &&
            (this.getCurrent().kind === TokenKind.PlusToken ||
            this.getCurrent().kind === TokenKind.MinusToken)
        ) {
            let operatorToken:SyntaxToken = this.nextToken();
            let right:ExpressionSyntax = this.parsePrimaryExpression();
            left = new BinaryExpressSyntax(left, operatorToken, right)
        }

        return left;
    }

    parsePrimaryExpression(): ExpressionSyntax {
        return new NumberExpressSyntax(this.nextToken().value);
    }
}

function printTree(expression: ExpressionSyntax, indent=""):void {
    if (!expression) return;

    let p:string = TokenKind[expression.kind];
    
    // number token
    if (expression.kind === TokenKind.NumberToken)
        p = p + " " + expression.value;

    // operator token
    else if (expression.kind === TokenKind.MinusToken ||
             expression.kind === TokenKind.PlusToken)
        p = p + " " + expression.token;
    
    console.log(indent, p);
    indent = indent + "    ";

    for (const prop in expression) {
        if (typeof(expression[prop]) === "object")
            printTree(expression[prop], indent);
    }
}

async function main():Promise<void> {
    while (true) {
        const expression: string = await input("> Enter the algebraic expression: ");
        if (expression === 'q') break;

        const parser = new Parser(expression);
        const exp:ExpressionSyntax = parser.parse();

        printTree(exp);
        console.log()
    }
    console.log(); 
}

main();