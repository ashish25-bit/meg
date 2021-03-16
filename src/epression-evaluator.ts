import { input } from './input';

// enum for binary operands
enum BinaryOperator {
    '+' = 'PlusToken',
    '-' = 'MinusToken',
    '*' = 'MultiplyToken',
    '/' = 'DivideToken',
    '(' = 'OpenBracketToken',
    ')' = 'ClosingBracketToken'
};

interface lexerObject {
    token: string | number,
    tokenKind: string
};

class Lexer {
    private expression: string;
    private position: number;
    private lexer: Array<object>;

    constructor(expression: string) {
        this.expression = expression;
        this.position = -1;
        this.lexer = [];
    }

    private next = ():void => { this.position++ }
    private initializePos = ():void => { this.position = -1 }

    getChar():string {
        return this.expression[this.position]
    }

    // checks whether the char is a digit or not
    isDigit():boolean {
        const char:string = this.getChar();
        return !isNaN(parseFloat(char)) || char === '.';
    } 

    lexerMethod():void {
        while (this.position < this.expression.length - 1) {
            this.next();
            let ch:string = this.getChar();
            
            // whitespace
            if (ch === ' ') continue;

            const obj: lexerObject = {
                token: '',
                tokenKind: ''
            }; 

            // ch is a operator
            if (BinaryOperator[ch] !== undefined) {
                obj.token = ch; 
                obj.tokenKind = BinaryOperator[ch]; 
            }

            // is a digit
            else if (this.isDigit()) {
                let num:string = "";
                while (this.isDigit()) {
                    num += this.getChar();
                    this.next();
                }

                const isNumber:boolean = !isNaN(parseFloat(num));
                obj.token = isNumber ? parseFloat(num) : num; 
                obj.tokenKind = isNumber ?'NumberToken' : 'BadToken';

                this.position--;
            }

            else {
                obj.token = ch; 
                obj.tokenKind = 'BadToken';
            }
            this.lexer.push(obj);
        }
        this.initializePos();
        console.log(this.lexer)
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