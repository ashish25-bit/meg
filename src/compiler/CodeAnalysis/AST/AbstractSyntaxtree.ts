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
import { ErrorObj } from '../ErrorHandling';
import { Stack } from '../../utils/Stack';
import { Scope } from './Scope';
import { Unit } from './Unit';
import { VariableDeclarationExpression } from './VariableDeclarationExpression';

export class Binder {
    private scopeNum: number;
    private scopeStack: Stack<Scope>;
    private currScope: Scope;

    constructor() {
        this.scopeNum = 0;
        this.scopeStack = new Stack<Scope>();
        this.currScope = new Scope(null, 0);
        this.scopeStack.push(this.currScope);
    }

    bind(syntax: ExpressionSyntax): Unit {

        switch(syntax.kind) {
            case TokenKind.ParenthesizedExpression:
                return this.bind(syntax.expression)

            case TokenKind.BlockExpression:
                this.addNewScope();
                const blockExp: Expression = this.bindBlockExpression(syntax);

                const unit: Unit = this.getUnit(blockExp);

                this.scopeNum--;
                this.scopeStack.pop();
                this.currScope = this.scopeStack.top();
                return unit;

            case TokenKind.VariableDeclaration:
            const declarationExp = this.bindVariableDeclaration(syntax);
            return this.getUnit(declarationExp);

            case TokenKind.NumberToken:
            case TokenKind.BooleanFalseToken:
            case TokenKind.BooleanTrueToken:
                const literalExp: Expression = this.bindLiteralExpression(syntax);
                return this.getUnit(literalExp);

            case TokenKind.UnaryExpressionToken:
                const unaryExp = this.bindUnaryExpression(syntax);
                return this.getUnit(unaryExp);
                
            case TokenKind.BinaryExpressionToken:
                const binaryExp = this.bindBinaryExpression(syntax);
                return this.getUnit(binaryExp);

            case TokenKind.VariableExpression:
                const varExp = this.bindVariableExpression(syntax);
                return this.getUnit(varExp);

            case TokenKind.InitializationExpression:
                const initialExp = this.bindInitializationExpression(syntax);
                return this.getUnit(initialExp);

            default:
                throw new Error(ErrorObj.ReportUnknownKind(syntax.kind));
        }
    }

    bindVariableExpression(syntax: ExpressionSyntax): Expression {

        // check whether the variable is present in the current scope or in the parent scope
        // value can be undefined also
        if (this.currScope.getVariable(syntax) === false) {
            throw new Error(ErrorObj.ReportUndefinedVariable(syntax.token));
        }
        return new VariableExpression(syntax.token);
    }

    bindLiteralExpression(syntax: ExpressionSyntax): Expression {
        let value = syntax.value ? syntax.value : 0;
        return new LiteralExpression(value);
    }

    bindUnaryExpression(syntax: ExpressionSyntax): Expression {
        let operand: Expression = this.bind(syntax.operand).expression;
        let operator: UnaryOperatorKind | null = this.bindUnaryOperatorKind(syntax.operator.kind, operand);

        return new UnaryExpression(operand, {kind: operator, value: syntax.operator.token});
    }

    bindBinaryExpression(syntax: ExpressionSyntax): Expression {
        let left: Expression = this.bind(syntax.left).expression;
        let right: Expression = this.bind(syntax.right).expression;
        let operator: BinaryOperatorKind | null = this.bindBinaryOperatorKind(syntax.operator.kind);

        return new BinaryExpression(left, {kind: operator, value: syntax.operator.token}, right);
    }

    private bindVariableDeclaration(syntax: ExpressionSyntax): Expression {
        const name = syntax.identifier.token;
        const variable = new VariableExpression(name);

        if (!this.currScope.Declare(syntax.identifier)) {
            throw new Error(ErrorObj.ReportVariableAlreadyDeclared(name));
        }
        
        const initializingValue: Expression = this.bind(syntax.initializingValue).expression;
        return new VariableDeclarationExpression(variable, initializingValue);
    }
    
    bindInitializationExpression(syntax: ExpressionSyntax): Expression {
        // this.currScope.Declare(syntax.left);
        const left: Expression = new VariableExpression(syntax.left.token);
        
        if (this.currScope.getVariable(syntax.left) === false) {
            throw new Error(ErrorObj.ReportUndefinedVariable(syntax.left.token));
        }

        const right: Expression = this.bind(syntax.right).expression;

        return new InitializationExpression(left, right);
    }

    private bindBlockExpression(syntax: ExpressionSyntax): Expression {
        const openBrace: SyntaxToken = syntax.openBrace;
        const closeBrace: SyntaxToken = syntax.closeBrace;
        let statements: Array<Unit | Expression> = [];
        for (const statement of syntax.statements) {
            const res = this.bind(statement);
            if (statement.kind === TokenKind.BlockExpression) {
                statements.push(res);
            }
            else {
                statements.push(res.expression);
            }
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
                throw new Error(ErrorObj.ReportUnknownUnaryOperator(kind));
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
                
                throw new Error(ErrorObj.ReportUnkownBinaryOperator(kind));
        }
    }

    private getUnit(exp: Expression): Unit {
        const top: Scope = this.scopeStack.top();
        const unit = new Unit(exp, top);
        return unit;
    }

    private addNewScope(): void {
        this.scopeNum++;
        const parent: Scope = this.scopeStack.top();
        let newScope: Scope = new Scope(parent, this.scopeNum);
        this.scopeStack.push(newScope);
        this.currScope = newScope;
    }
}