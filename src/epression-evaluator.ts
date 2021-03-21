import { input } from './input';
import { TokenKind } from './TokenKind';

abstract class ExpressionSyntax {
    [x: string]: any;
    abstract kind:TokenKind;
}

class WorngTokenExpression extends ExpressionSyntax {
    kind: TokenKind;
    constructor() {
        super();
        this.kind = TokenKind.WrongToken;
    }
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
    private _errors: Array<string>;

    constructor(expression: string) {
        this.expression = expression;
        this.position = -1;
        this._errors = [];
    }

    private next = ():void => { this.position++ }
    private initializePos = ():void => { this.position = -1 }

    get errors():Array<string> {
        return this._errors;
    }

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

        this._errors.push(`Bad token: ${ch}`);
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
    private _errors: Array<string>;

    constructor(exp: string) {
        this.expression = exp;
        this.tokens = [];
        this.position = 0;
        this._errors = [];
    }

    get errors():Array<string> {
        return this._errors;
    }

    setTokens():void {
        const lexer = new Lexer(this.expression);
        
        let token:SyntaxToken = lexer.nextToken();
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

    parseTerm():ExpressionSyntax {
        this.setTokens();
        let left: ExpressionSyntax = this.parseFactor();
        
        while (
            this.position < this.tokens.length &&
            (this.getCurrent().kind === TokenKind.PlusToken ||
            this.getCurrent().kind === TokenKind.MinusToken)
        ) {
            let operatorToken: SyntaxToken = this.nextToken();
            let right: ExpressionSyntax = this.parseFactor();
            left = new BinaryExpressSyntax(left, operatorToken, right);
        }
        
        const _ = this.matchKind(TokenKind.EndOfFileToken);

        return left;
    }

    parseFactor():ExpressionSyntax {
        let left:ExpressionSyntax = this.parsePrimaryExpression();

        while (
            this.position < this.tokens.length &&
            (this.getCurrent().kind === TokenKind.MultiplyToken ||
             this.getCurrent().kind === TokenKind.DivideToken)
        ) {
            let operatorToken: SyntaxToken = this.nextToken();
            let right: ExpressionSyntax = this.parsePrimaryExpression();
            left = new BinaryExpressSyntax(left, operatorToken, right);
        }

        return left;
    }

    matchKind(kind: TokenKind):boolean {
        if (this.getCurrent().kind === kind)
            return true;
        // report error
        this._errors.push(`ERROR: Unexpected token ${TokenKind[this.getCurrent().kind]}, expected ${TokenKind[kind]}`);
        return false;
    }

    parsePrimaryExpression(): ExpressionSyntax {
        if (this.matchKind(TokenKind.NumberToken))
            return new NumberExpressSyntax(this.nextToken().value);
        return new WorngTokenExpression();
    }

    resultant(left: number , operator: SyntaxToken , right: number): number {
        if (operator.kind === TokenKind.PlusToken)
            return left + right;
        if (operator.kind === TokenKind.MinusToken)
            return left - right;
        if (operator.kind === TokenKind.MultiplyToken)
            return left * right;
        if (operator.kind === TokenKind.DivideToken)
            return left / right;
        
        throw new Error(`Unexpected operator '${operator.token}'`);
    }

    evaluate(exp: ExpressionSyntax): number {
        if (exp.kind === TokenKind.NumberToken) return exp.value;

        if (exp.kind === TokenKind.BinaryExpressionToken) {
            let left = this.evaluate(exp.left);
            let right = this.evaluate(exp.right);
            return this.resultant(left, exp.operator, right);
        }

        throw new Error(`Unexpected node of '${exp.kind}' kind`);
    }
}

function printTree(expression: ExpressionSyntax, indent=""):void {
    if (!expression) return;
    if (expression.kind === TokenKind.WrongToken) return ;

    let p:string = TokenKind[expression.kind];
    
    // number token
    if (expression.kind === TokenKind.NumberToken)
        p = p + " " + expression.value;

    // operator token
    else if (expression.kind === TokenKind.MinusToken ||
             expression.kind === TokenKind.PlusToken  ||
             expression.kind === TokenKind.MultiplyToken  ||
             expression.kind === TokenKind.DivideToken )
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
        const exp:ExpressionSyntax = parser.parseTerm();

        printTree(exp);
        console.log()
        if (parser.errors.length) for (const error of parser.errors) console.log(error);
        else console.log(parser.evaluate(exp));
        console.log();
    }
    console.log(); 
}

main();