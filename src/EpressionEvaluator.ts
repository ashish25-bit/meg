import { input } from './InputModule/input';
import { ExpressionSyntax } from './CodeAnalysis/ExpressionSyntax';
import { Parser } from './CodeAnalysis/Parser';
import { TokenKind } from './CodeAnalysis/TokenKind';
import { Evaluate } from './CodeAnalysis/Evaluate';
import { Binder } from './CodeAnalysis/AST/AbstractSyntaxtree';
import { Expression } from './CodeAnalysis/AST/Expression';

function printTree(expression: ExpressionSyntax, indent=""):void {
    if (!expression) return;
    if (expression.kind === TokenKind.BadToken) return ;

    let p:string = expression.constructor.name;

    if (p === "SyntaxToken") p = TokenKind[expression.kind];
    

    // operator token
    if (expression.kind === TokenKind.MinusToken ||
             expression.kind === TokenKind.PlusToken  ||
             expression.kind === TokenKind.MultiplyToken  ||
             expression.kind === TokenKind.DivideToken ||
             expression.kind === TokenKind.OpenBracketToken ||
             expression.kind === TokenKind.CloseBracketToken ||
             expression.kind === TokenKind.BinaryAndOperator ||
             expression.kind === TokenKind.BinaryOrOperator
    ) p = p + " " + expression.token;
    
    console.log(indent, p);
    indent = `${indent}    `;

    if (expression.kind === TokenKind.NumberToken)
        console.log(indent, TokenKind[TokenKind.NumberToken], expression.value);

    if (expression.kind === TokenKind.BooleanTrueToken)
        console.log(indent, TokenKind[TokenKind.BooleanTrueToken], expression.value);
    
    if (expression.kind === TokenKind.BooleanFalseToken)
        console.log(indent, TokenKind[TokenKind.BooleanFalseToken], expression.value);

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

        if (parser.errors.length)
            for (const error of parser.errors) console.log(error);
        
        else {
            const AST = new Binder();
            const ast: Expression = AST.bind(exp);
            
            if (AST.errors.length)
            for (const error of parser.errors) console.log(error);
            
            else {
                const evaluate = new Evaluate();
                console.log(evaluate.evaluate(ast));
            }
        }
        console.log(); 
    }
    console.log(); 
}

main();