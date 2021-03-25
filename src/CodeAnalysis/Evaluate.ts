import { ExpressionSyntax } from "./ExpressionSyntax";
import { SyntaxToken } from "./SyntaxToken";
import { TokenKind } from "./TokenKind";

export class Evaluate {

    changeOperation(number: number, kind: TokenKind): number {
        if (kind === TokenKind.MinusToken)
            return -number;
        return number;
    }

    resultant(left: number, operator: SyntaxToken, right: number): number {
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
        if (exp.kind === TokenKind.NumberToken)
            return exp.value;

        if (exp.kind === TokenKind.BooleanTrueToken)
            return 1;
        
        if (exp.kind === TokenKind.BooleanFalseToken)
            return 0;

        if (exp.kind === TokenKind.UnaryExpressionToken) {
            
            if (exp.operand.kind === TokenKind.NumberToken) 
                return this.changeOperation(exp.operand.value, exp.operator.kind);
            
            // for expression: --1, -+-1
            if (exp.operand.kind === TokenKind.UnaryExpressionToken)
                return this.changeOperation(this.evaluate(exp.operand), exp.operator.kind);

            if (
                exp.operand.kind === TokenKind.BinaryExpressionToken ||
                exp.operand.kind === TokenKind.ParenthesizedExpression
            ) {
                let res:number = this.evaluate(exp.operand);
                // if (exp.operator.kind === TokenKind.MinusToken)
                //     return -res;
                return this.changeOperation(res, exp.operator.kind)
            }

            if (exp.operator.kind === TokenKind.MinusToken)
                return -exp.operand.value;
            
            throw new Error(`Unexpected unary operator '${exp.operator.token}'`);
        }
        
        if (exp.kind === TokenKind.ParenthesizedExpression)
            return this.evaluate(exp.expression);

        if (exp.kind === TokenKind.BinaryExpressionToken) {
            let left = this.evaluate(exp.left);
            let right = this.evaluate(exp.right);

            if (exp.operator.kind === TokenKind.BinaryAndOperator)
                return this.resultant(left, new SyntaxToken('*', TokenKind.MultiplyToken, null), right);
            
            if (exp.operator.kind === TokenKind.BinaryOrOperator)
                return this.resultant(left, new SyntaxToken('+', TokenKind.PlusToken, null), right); 
            
            return this.resultant(left, exp.operator, right);
        }

        throw new Error(`Unexpected node of '${TokenKind[exp.kind]}' kind`);
    }
}