import { BinaryOperatorKind } from "./AST/BinaryOperatorKind";
import { Expression } from "./AST/Expression";
import { NodeKind } from "./AST/NodeKind";
import { UnaryOperatorKind } from "./AST/UnaryOperatorKind";

export class Evaluate {
    private _variables;
    private _result: number | boolean | null | undefined;
    private _errors: Array<string>;

    constructor() {
        this._variables = new Map<string, number>();
        this._errors = [];
        this._result = undefined;
    }

    get errors() {
        return this._errors;
    }

    get result() {
        return this._result;
    }

    get variables() {
        return this._variables;
    }

    evaluate(exp: Expression, map: Map<string, number>): void {
        this._variables = map;
        this._result = this.evaluateExpression(exp);
        if (this.errors.length)
            this._result = undefined;
    }

    evaluateExpression(exp: Expression): number {

        if (exp.kind === NodeKind.VariableExpression) {
            let data: number | undefined = this._variables.get(exp.value);
            if (data === undefined) {
                this._errors.push(`Variable '${exp.value}' is used before initialization. Result Undefined.`);
                return -1;
            }
            return data;
        }

        // initialization expression
        if (exp.kind === NodeKind.InitializationExpression) {
            // this._variables.set(exp.left.value, daa);
            let data: number = this.evaluateExpression(exp.right);
            this._variables.set(exp.left.value, data);
            return data;
        }

        // numbers and boolean
        if (exp.kind === NodeKind.LiteralExpression) 
            return this.getLiteralValue(exp);

        // binary expression
        if (exp.kind === NodeKind.BinaryExpression) {
            let left: number = this.evaluateExpression(exp.left);
            let right: number = this.evaluateExpression(exp.right);
            
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
            // for expression: a = -b, etc.
            if (
                exp.operand.kind === NodeKind.UnaryExpression ||
                exp.operand.kind === NodeKind.VariableExpression
            )
                return this.changeOperation(
                    this.evaluateExpression(exp.operand),
                    exp.operator.kind
                );

            if (exp.operand.kind === NodeKind.BinaryExpression)
                return this.changeOperation(this.evaluateExpression(exp.operand), exp.operator.kind)
        }

        this._errors.push(`Unexpected node of '${NodeKind[exp.kind]}' kind`);
        return -1;        
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

        if (operator === BinaryOperatorKind.EqualsOperator) {
            if (left === right) return 1;
            return 0;
        }

        if (operator === BinaryOperatorKind.NotEquals) {
            if (left !== right) return 1;
            return 0;
        }

        if (operator === BinaryOperatorKind.Modulus)
            return left % right;

        this._errors.push(`Unexpected operator '${operator}'`);
        return -1;
    }

    changeOperation(number: number, kind: UnaryOperatorKind): number {
        if (kind === UnaryOperatorKind.Negation)
            return -number;

        if (kind === UnaryOperatorKind.Not) {
            if (number === 0) return 1;
            return 0;
        }
        return number;
    }

    getLiteralValue(exp: Expression): number {
        if (exp.type === "number") return exp.value;

        if (exp.value === true) return 1;
        return 0;
    }
}