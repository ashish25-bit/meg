import { ExpressionSyntax } from '../Syntax/ExpressionSyntax';
import { TokenKind } from '../Syntax/TokenKind';
import { BinaryExpression } from './BinaryExpression';
import { BinaryOperatorKind } from './BinaryOperatorKind';
import { Expression } from './Expression';
import { LiteralExpression } from './LiteralExpression';
import { UnaryExpression } from './UnaryExpression';
import { UnaryOperatorKind } from './UnaryOperatorKind';
import { VariableExpression } from './VariableExpression';
import { InitializationExpression } from './InitializationExpression';
import { BlockExpression } from './BlockExpression';
import { SyntaxToken } from '../Syntax/SyntaxToken';

export class Binder {

    private _errors: Array<string>;

    constructor() {
        this._errors = [];
    }
    
    get errors() {
        return this._errors;
    }

    bind(syntax: ExpressionSyntax, variables: Map<string, any>): Expression {

        switch(syntax.kind) {
            case TokenKind.ParenthesizedExpression:
                return this.bind(syntax.expression, variables)

            case TokenKind.BlockExpression:
                return this.bindBlockExpression(syntax, variables);

            case TokenKind.NumberToken:
            case TokenKind.BooleanFalseToken:
            case TokenKind.BooleanTrueToken:
                return this.bindLiteralExpression(syntax);

            case TokenKind.UnaryExpressionToken:
                return this.bindUnaryExpression(syntax, variables);
                
            case TokenKind.BinaryExpressionToken:
                return this.bindBinaryExpression(syntax, variables);

            case TokenKind.VariableExpression:
                return this.bindVariableExpression(syntax, variables);

            case TokenKind.InitializationExpression:
                return this.bindInitializationExpression(syntax, variables);

            default:
                throw new Error(`Unexpected syntax kind: '${TokenKind[syntax.kind]}'`);
        }
    }

    bindVariableExpression(syntax: ExpressionSyntax, variables: Map<string, any>): Expression {
        if (!variables.has(syntax.token))
            variables.set(syntax.token, undefined);
        return new VariableExpression(syntax.token);
    }

    bindLiteralExpression(syntax: ExpressionSyntax): Expression {
        let value = syntax.value ? syntax.value : 0;
        return new LiteralExpression(value);
    }

    bindUnaryExpression(syntax: ExpressionSyntax, variables: Map<string, any>): Expression {
        let operand: Expression = this.bind(syntax.operand, variables);
        let operator: UnaryOperatorKind | null = this.bindUnaryOperatorKind(syntax.operator.kind, operand);

        return new UnaryExpression(operand, {kind: operator, value: syntax.operator.token});
    }

    bindBinaryExpression(syntax: ExpressionSyntax, variables: Map<string, any>): Expression {
        let left: Expression = this.bind(syntax.left, variables);
        let right: Expression = this.bind(syntax.right, variables);
        let operator: BinaryOperatorKind | null = this.bindBinaryOperatorKind(syntax.operator.kind);

        return new BinaryExpression(left, {kind: operator, value: syntax.operator.token}, right);
    }

    bindInitializationExpression(syntax: ExpressionSyntax, variables: Map<string, any>): Expression {
        let left: Expression = this.bind(syntax.left, variables);
        let right: Expression = this.bind(syntax.right, variables);
        let operator: BinaryOperatorKind | null = this.bindBinaryOperatorKind(syntax.operator.kind);

        return new InitializationExpression(left, { kind: operator, value: '=' }, right); 
    }

    private bindBlockExpression(syntax: ExpressionSyntax, variables: Map<string, any>): Expression {
        const openBrace: SyntaxToken = syntax.openBrace;
        const closeBrace: SyntaxToken = syntax.closeBrace;
        let statements: Array<Expression> = [];
        for (const statement of syntax.statements) {
            const res = this.bind(statement, variables);
            statements.push(res);
        }

        return new BlockExpression(openBrace, statements, closeBrace);
    }

    bindUnaryOperatorKind(kind: TokenKind, operand: Expression): UnaryOperatorKind | null {

        // console.log(operand.type);
        switch(kind) {
            case TokenKind.PlusToken:
                return UnaryOperatorKind.Identity;
            
            case TokenKind.MinusToken:
                return UnaryOperatorKind.Negation;

            case TokenKind.UnaryNotOperator:
                return UnaryOperatorKind.Not;

            default:
                throw new Error(`Unexpected unary token kind '${TokenKind[kind]}'`);
        }
    } 

    bindBinaryOperatorKind(kind: TokenKind): BinaryOperatorKind | null {

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

            case TokenKind.EqualityOperator:
                return BinaryOperatorKind.EqualsOperator;
            
            case TokenKind.NotEqualOperator:
                return BinaryOperatorKind.NotEquals;

            case TokenKind.ModulusToken:
                return BinaryOperatorKind.Modulus;

            case TokenKind.AssignmentOperatorToken:
                return BinaryOperatorKind.Assignment;

            default:
                throw new Error(`Unexpected binary token kind '${TokenKind[kind]}'`);
        }
    }
}