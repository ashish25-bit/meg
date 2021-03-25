import { ExpressionSyntax } from '../Syntax/ExpressionSyntax';
import { TokenKind } from '../Syntax/TokenKind';
import { BinaryExpression } from './BinaryExpression';
import { BinaryOperatorKind } from './BinaryOperatorKind';
import { Expression } from './Expression';
import { LiteralExpression } from './LiteralExpression';
import { UnaryExpression } from './UnaryExpression';
import { UnaryOperatorKind } from './UnaryOperatorKind';

export class Binder {

    private _errors: Array<string>;

    constructor() {
        this._errors = [];
    }
    
    get errors() {
        return this._errors;
    }

    bind(syntax: ExpressionSyntax): Expression {

        switch(syntax.kind) {
            case TokenKind.ParenthesizedExpression:
                return this.bind(syntax.expression)

            case TokenKind.NumberToken:
            case TokenKind.BooleanFalseToken:
            case TokenKind.BooleanTrueToken:
                return this.bindLiteralExpression(syntax);

            case TokenKind.UnaryExpressionToken:
                return this.bindUnaryExpression(syntax);
                
            case TokenKind.BinaryExpressionToken:
                return this.bindBinaryExpression(syntax);

            default:
                throw new Error(`Unexpected syntax kind: '${TokenKind[syntax.kind]}'`);
        }
    }

    bindLiteralExpression(syntax: ExpressionSyntax): Expression {
        let value = syntax.value ? syntax.value : 0;
        return new LiteralExpression(value);
    }

    bindUnaryExpression(syntax: ExpressionSyntax): Expression {
        let operand: Expression = this.bind(syntax.operand);
        let operator: UnaryOperatorKind | null = this.bindUnaryOperatorKind(syntax.operator.kind, operand);

        if (operator == null) {
            this._errors.push(`Unary operator '${syntax.operator.token}' is not defined for ${operand.type}`)
            return operand;
        }

        return new UnaryExpression(operand, {kind: operator, value: syntax.operator.token});
    }

    bindBinaryExpression(syntax: ExpressionSyntax): Expression {
        let left: Expression = this.bind(syntax.left);
        let right: Expression = this.bind(syntax.right);
        let operator: BinaryOperatorKind | null = this.bindBinaryOperatorKind(syntax.operator.kind, left, right);

        if (operator === null) {
            this._errors.push(`Binary operator '${syntax.operator.token}' is not defined for ${left.type} && ${right.type} `)
            return left;
        }

        return new BinaryExpression(left, {kind: operator, value: syntax.operator.token}, right);
    }

    bindUnaryOperatorKind(kind: TokenKind, operand: Expression): UnaryOperatorKind | null {

        // console.log(operand.type);
        switch(kind) {
            case TokenKind.PlusToken:
                return UnaryOperatorKind.Identity;
            
            case TokenKind.MinusToken:
                return UnaryOperatorKind.Negation;

            default:
                throw new Error(`Unexpected unary token kind '${kind}'`);
        }
    } 

    bindBinaryOperatorKind(kind: TokenKind, lType: Expression, rType: Expression): BinaryOperatorKind | null {

        // console.log(lType.type, rType.type);
        switch(kind) {
            case TokenKind.PlusToken:
                return BinaryOperatorKind.Addition;
            
            case TokenKind.MinusToken:
                return BinaryOperatorKind.Subtraction;

            case TokenKind.MultiplyToken:
                return BinaryOperatorKind.Multiplication;
            
            case TokenKind.DivideToken:
                return BinaryOperatorKind.Division;

            case TokenKind.BinaryOrOperator:
                return BinaryOperatorKind.OrOperator;

            case TokenKind.BinaryAndOperator:
                return BinaryOperatorKind.AndOperator;

            default:
                throw new Error(`Unexpected binary token kind '${kind}'`);
        }
    }
}