import { ExpressionSyntax } from "./ExpressionSyntax";
import { SyntaxToken } from "./SyntaxToken";
import { TokenKind } from "./TokenKind";

export class Evaluate {
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

        if (exp.kind === TokenKind.ParenthesizedExpression)
            return this.evaluate(exp.expression);

        if (exp.kind === TokenKind.BinaryExpressionToken) {
            let left = this.evaluate(exp.left);
            let right = this.evaluate(exp.right);
            return this.resultant(left, exp.operator, right);
        }

        throw new Error(`Unexpected node of '${exp.kind}' kind`);
    }
}