import { BinaryOperatorKind } from "./AST/BinaryOperatorKind";
import { Expression } from "./AST/Expression";
import { NodeKind } from "./AST/NodeKind";
import { UnaryOperatorKind } from "./AST/UnaryOperatorKind";

export class Evaluate {
  private _variables: Map<string, number | undefined>;
  private _result: number | boolean | null | undefined;
  private _errors: Array<string>;

  constructor(map: Map<string, number>) {
    this._variables = map;
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

  evaluate(exp: Expression): void {
    this._result = this.evaluateExpression(exp);
  }

  evaluateExpression(exp: Expression): number {

    switch (exp.kind) {

      case NodeKind.VariableExpression:
        let data: number | undefined = this._variables.get(exp.value);
        if (data === undefined) {
          this._result = undefined;
          throw new Error(`Variable '${exp.value}' is used before initialization. Result Undefined.`)
        }
        return data;

      case NodeKind.InitializationExpression:
        if (this._variables.get(exp.left.value) === undefined)
          this._variables.set(exp.left.value, undefined);
        let res = this.evaluateExpression(exp.right);
        this._variables.set(exp.left.value, res);
        return res;

      // numbers and boolean
      case NodeKind.LiteralExpression:
        return this.getLiteralValue(exp);

      case NodeKind.UnaryExpression:
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

        throw new Error(`Unexpected error`);

      case NodeKind.BinaryExpression:
        let left: number = this.evaluateExpression(exp.left);
        let right: number = this.evaluateExpression(exp.right);

        return this.resultant(left, exp.operator.kind, right);

      default:
        throw new Error(`Unexpected node of '${NodeKind[exp.kind]}' kind`);
    }
  }

  resultant(left: number, operator: BinaryOperatorKind, right: number): number {
    switch (operator) {
      
      case BinaryOperatorKind.Addition:
      case BinaryOperatorKind.OrOperator:
        return left + right;

      case BinaryOperatorKind.Subtraction:
        return left - right;

      case BinaryOperatorKind.Multiplication:
      case BinaryOperatorKind.AndOperator:
        return left * right;

      case BinaryOperatorKind.Division:
        return left / right;

      case BinaryOperatorKind.Modulus:
        return left % right;

      case BinaryOperatorKind.EqualsOperator:
        if (left === right) return 1;
        return 0;
      
      case BinaryOperatorKind.NotEquals:
        if (left !== right) return 1;
        return 0;

      default:
        throw new Error(`Unexpected operator '${BinaryOperatorKind[operator]}'`);
    }
  }

  changeOperation(number: number, kind: UnaryOperatorKind): number {

    switch (kind) {
      case UnaryOperatorKind.Negation:
        return -number;

      case UnaryOperatorKind.Not:
        if (number === 0) return 1;
        return 0;

      default:
        return number;
    }
  }

  getLiteralValue(exp: Expression): number {
    if (exp.type === "number") return exp.value;

    if (exp.value === true) return 1;
    return 0;
  }
}