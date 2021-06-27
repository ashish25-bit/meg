import { BinaryOperatorKind } from "./AST/BinaryOperatorKind";
import { Expression } from "./AST/Expression";
import { NodeKind } from "./AST/NodeKind";
import { UnaryOperatorKind } from "./AST/UnaryOperatorKind";
import { Unit } from "./AST/Unit";
import { ErrorObj } from "./ErrorHandling";

export class Evaluate {
  private _result: any;
  private error_status: boolean;
  private currUnit: Unit;


  constructor(unit: Unit) {
    this.currUnit = unit;
    this._result = undefined;
    this.error_status = false;
  }

  get result() {
    return this._result;
  }

  evaluate(unit: Unit): void {
    this._result = this.evaluateExpression(unit);
    if (this.error_status) this._result = undefined;
  }

  private evaluateExpression(unit: Unit | Expression): any {
    const exp: Expression = unit.expression !== undefined ? unit.expression : unit;

    switch (exp.kind) {

      case NodeKind.VariableDeclarationExpression: 
        let declartion_data = this.evaluateExpression(exp.initializer);
        this.currUnit.scope.setVariable(exp.variable.token, declartion_data);
        return declartion_data;

      case NodeKind.BlockExpression:
        let b_data: Array<number> = [];
        const parent: Unit = this.currUnit;

        for (const statement of exp.statements) {
          if (statement.expression !== undefined)
            this.currUnit = statement;
          b_data.push(this.evaluateExpression(statement));
        }

        this.currUnit = parent;
        return b_data[b_data.length - 1];

      case NodeKind.VariableExpression:
        let data: number | boolean = this.currUnit.scope.getVariable(exp, true);
        if (data === undefined || data === false) {
            throw new Error(ErrorObj.ReportUndefinedVariable(exp.token));
        }
        return data;

      case NodeKind.InitializationExpression:
        let initial_data: number = this.evaluateExpression(exp.right);
        const res = this.currUnit.scope.setVariable(exp.left.token, initial_data);
        if (!res) {
            throw new Error(ErrorObj.ReportUndefinedVariable(exp.token));
        }
        return initial_data;

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

  private resultant(left: number, operator: BinaryOperatorKind, right: number): number {
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

  private changeOperation(number: number, kind: UnaryOperatorKind): number {

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

  private getLiteralValue(exp: Expression): number {
    if (exp.type === "number") return exp.value;

    if (exp.value === true) return 1;
    return 0;
  }
}