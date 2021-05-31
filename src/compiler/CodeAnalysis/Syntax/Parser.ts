import { ExpressionSyntax } from './ExpressionSyntax';
import { ParenthesizeExpressionSyntax } from "./ParenthesizeExpressionSyntax";
import { UnaryExpressionSyntax } from "./UnaryExpressionSyntax";
import { BinaryExpressionSyntax } from "./BinaryExpressionSyntax";
import { LiteralExpressionSyntax } from "./LiteralExpressionSyntax";
import { Lexer } from './Lexer';
import { SyntaxToken } from './SyntaxToken';
import { TokenKind } from './TokenKind';
import {
  binaryOperatorPrecedence,
  unaryOperatorPrecedence
} from './OperatorPrecedence';
import { InitializationExpressionSyntax } from './InitializationExpressionSyntax';
import { VariableExpressionSyntax } from './VariableExpressionSyntax';
import { BlockExpressionSyntax } from './BlockExpressionSyntax';
import { ErrorObj } from '../ErrorHandling';

export class Parser {
  private expression: string;
  private tokens: Array<SyntaxToken>;
  private position: number;

  constructor(exp: string) {
    this.expression = exp;
    this.tokens = [];
    this.position = 0;
  }

  private setTokens(): void {
    this.expression += '\0';
    const lexer = new Lexer(this.expression);

    let token: SyntaxToken = lexer.nextToken();
    while (token.kind !== TokenKind.EndOfFileToken) {
      if (token.kind !== TokenKind.BadToken && token.kind !== TokenKind.WhiteSpaceToken)
        this.tokens.push(token);
      token = lexer.nextToken();
    }
    this.tokens.push(token);
  }

  private nextToken(): SyntaxToken {
    const current = this.getCurrent();
    this.position++;
    return current;
  }

  private getCurrent(): SyntaxToken {
    return this.tokens[this.position];
  }

  private lookAhead(pos: number): SyntaxToken | null {
    if (this.position + pos <= this.tokens.length) {
      return this.tokens[this.position + pos];
    }
    return null;
  }

  parser(): Array<ExpressionSyntax> {
    this.setTokens();
    let statements:Array<ExpressionSyntax> = [];

    if (ErrorObj.errors.length !== 0)
      return statements;

    while (this.position < this.tokens.length && this.getCurrent().kind !== TokenKind.EndOfFileToken) {
      const expression = this.parseExpression();
      if (ErrorObj.errors.length)
        return statements;
      statements.push(expression)
    }

    this.matchKind(TokenKind.EndOfFileToken);
    return statements;
  }

  private parseExpression(): ExpressionSyntax {
    // checking for opening curly brace
    if (this.getCurrent().kind === TokenKind.OpenCurlyBraceToken) {
      let openBrace = this.nextToken();
      let statements: Array<ExpressionSyntax> = this.parseStatments();
      if (this.matchKind(TokenKind.CloseCurlyBraceToken))
        return new BlockExpressionSyntax(openBrace, statements, this.nextToken());
    }

    return this.parseAssignmentExpression();
  }

  private parseStatments(): Array<ExpressionSyntax> {
    let statements: Array<ExpressionSyntax> = [];

    while (
      this.getCurrent().kind !== TokenKind.EndOfFileToken &&
      this.getCurrent().kind !== TokenKind.CloseCurlyBraceToken
    ) {
      let statement: ExpressionSyntax = this.parseExpression();
      statements.push(statement);
    }
    return statements;
}

  private parseAssignmentExpression(): ExpressionSyntax {
    let pos1 = this.lookAhead(0);
    let pos2 = this.lookAhead(1);

    if (pos1 && pos1.kind === TokenKind.AssignmentOperatorToken) {
      ErrorObj.ReportIllegalLeftHandAssignment();
      return new SyntaxToken(this.nextToken().token, TokenKind.BadToken, null);
    }

    if (
      pos1 && pos2 &&
      pos1.kind === TokenKind.NumberToken &&
      pos2.kind === TokenKind.AssignmentOperatorToken
    ) {
        ErrorObj.ReportIllegalLeftHandAssignment(pos1.token);
        return new SyntaxToken(this.nextToken().token, TokenKind.BadToken, null);
    }

    while (
      pos1 !== null && pos2 !== null && 
      pos1.kind === TokenKind.IdentifierToken && 
      pos2.kind === TokenKind.AssignmentOperatorToken
    ) {
      let left = this.parsePrimaryExpression();
      let operator = this.nextToken();
      let right = this.parseAssignmentExpression();

      return new InitializationExpressionSyntax(left, operator, right);
    }

    return this.parseBinaryExpression();
  }

  private parseBinaryExpression(precedence: number = 0): ExpressionSyntax {
    let left: ExpressionSyntax;

    let unaryPrecedence = unaryOperatorPrecedence(this.getCurrent().kind);

    if (unaryPrecedence !== 0 && unaryPrecedence >= precedence) {
      let operator: SyntaxToken = this.nextToken();

      // if the expression is -1*2+3
      if (this.getCurrent().kind === TokenKind.NumberToken)
        left = new UnaryExpressionSyntax(operator, this.parsePrimaryExpression());

      else {
        let operand: ExpressionSyntax = this.parseBinaryExpression();
        left = new UnaryExpressionSyntax(operator, operand)
      }
    }
    else
      left = this.parsePrimaryExpression();

    while (this.getCurrent().kind !== TokenKind.EndOfFileToken) {
      let nextPrecendence: number = binaryOperatorPrecedence(this.getCurrent().kind);
      if (nextPrecendence === 1 || nextPrecendence === 0 || nextPrecendence <= precedence)
        break;

      let operatorToken = this.nextToken();
      let right = this.parseBinaryExpression(nextPrecendence);
      left = new BinaryExpressionSyntax(left, operatorToken, right);
    }
    return left;
  }

  private matchKind(kind: TokenKind): boolean {
    if (this.getCurrent().kind === kind)
      return true;
    
    // report error
    ErrorObj.ReportWorngTokenKind(this.getCurrent().kind, kind);
    return false;
  }

  private parsePrimaryExpression(): ExpressionSyntax {

    switch (this.getCurrent().kind) {
      case TokenKind.OpenBracketToken:
        let left = this.nextToken();
        let expression = this.parseExpression();
        if (this.matchKind(TokenKind.CloseBracketToken))
          return new ParenthesizeExpressionSyntax(left, expression, this.nextToken());
        break;

      case TokenKind.BooleanFalseToken:
      case TokenKind.BooleanTrueToken:
        const kind = this.getCurrent().value === true ? TokenKind.BooleanTrueToken : TokenKind.BooleanFalseToken;
        return new LiteralExpressionSyntax(this.nextToken().value, kind);

      case TokenKind.IdentifierToken:
        return new VariableExpressionSyntax(this.nextToken().token);

      default:
        if (this.matchKind(TokenKind.NumberToken))
          return new LiteralExpressionSyntax(this.nextToken().value, TokenKind.NumberToken);
        break;
    }

    return new SyntaxToken(this.getCurrent().token, TokenKind.BadToken, null);
  }
}
