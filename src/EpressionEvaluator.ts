import { input } from './InputModule/input';
import { ExpressionSyntax } from './CodeAnalysis/ExpressionSyntax';
import { Parser } from './CodeAnalysis/Parser';
import { TokenKind } from './CodeAnalysis/TokenKind';
import { Evaluate } from './CodeAnalysis/Evaluate';

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
             expression.kind === TokenKind.DivideToken ||
             expression.kind === TokenKind.OpenBracketToken ||
             expression.kind === TokenKind.CloseBracketToken
    ) p = p + " " + expression.token;
    
    console.log(indent, p);
    indent = `${indent}    `;
    
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
        const exp:ExpressionSyntax = parser.parser();

        printTree(exp);
        console.log()
        if (parser.errors.length) for (const error of parser.errors) console.log(error);
        else {
            const evaluate = new Evaluate();
            console.log(evaluate.evaluate(exp));
        }
        console.log();
    }
    console.log(); 
}

main();