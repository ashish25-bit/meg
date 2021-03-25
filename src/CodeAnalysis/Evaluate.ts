import { BinaryOperatorKind } from "./AST/BinaryOperatorKind";
import { Expression } from "./AST/Expression";
import { NodeKind } from "./AST/NodeKind";
import { UnaryOperatorKind } from "./AST/UnaryOperatorKind";

export class Evaluate {

    evaluate(exp: Expression): number {
        // numbers and boolean
        if (exp.kind === NodeKind.LiteralExpression) 
            return this.getLiteralValue(exp);

        // binary expression
        if (exp.kind === NodeKind.BinaryExpression) {
            let left: number = this.evaluate(exp.left);
            let right: number = this.evaluate(exp.right);
            
            return this.resultant(left, exp.operator.kind, right);
        }

        // unary expression
        if (exp.kind === NodeKind.UnaryExpression) {
            if (exp.operand.kind === NodeKind.LiteralExpression)
                return this.changeOperation(
                    this.getLiteralValue(exp.operand),
                    exp.operator.kind
                );

            // for expression: --1, -+-1, etc.
            if (exp.operand.kind === NodeKind.UnaryExpression)
                return this.changeOperation(
                    this.evaluate(exp.operand),
                    exp.operator.kind
                );

            if (exp.operand.kind === NodeKind.BinaryExpression)
                return this.changeOperation(this.evaluate(exp.operand), exp.operator.kind)
        }

        throw new Error(`Unexpected node of '${NodeKind[exp.kind]}' kind`);
        
    }

    resultant(left: number, operator: BinaryOperatorKind, right: number): number {
        if (
            operator === BinaryOperatorKind.Addition || 
            operator === BinaryOperatorKind.OrOperator
        ) return left + right;

        if (operator === BinaryOperatorKind.Subtraction)
            return left - right;
        
        if (
            operator === BinaryOperatorKind.Multiplication || 
            operator === BinaryOperatorKind.AndOperator
        ) return left * right;
        
        if (operator === BinaryOperatorKind.Division)
            return left / right;

        throw new Error(`Unexpected operator '${operator}'`);
    }

    changeOperation(number: number, kind: UnaryOperatorKind): number {
        if (kind === UnaryOperatorKind.Negation)
            return -number;
        return number;
    }

    getLiteralValue(exp: Expression): number {
        if (exp.type === "number") return exp.value;

        if (exp.value === true) return 1;
        return 0;
    }
}