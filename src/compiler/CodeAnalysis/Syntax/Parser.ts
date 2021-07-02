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
import { VariableDeclarationSyntax } from './VariableDeclarationSyntax';

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

    while (this.position < this.tokens.length && this.getCurrent().kind !== TokenKind.EndOfFileToken) {
      const expression = this.parseExpression();
      statements.push(expression)
    }

    this.matchKind(TokenKind.EndOfFileToken);
    return statements;
  }

  private parseExpression(paranthesized: boolean = false): ExpressionSyntax {
    const kind = this.getCurrent().kind;

    if (paranthesized) {
      return this.parseAssignmentExpression(paranthesized);
  }

    // checking for opening curly brace
    if (kind === TokenKind.OpenCurlyBraceToken) {
      let openBrace = this.nextToken();
      let statements: Array<ExpressionSyntax> = this.parseStatments();
      if (this.matchKind(TokenKind.CloseCurlyBraceToken))
        return new BlockExpressionSyntax(openBrace, statements, this.nextToken());
    }

    else if (
      kind === TokenKind.StringToken ||
      kind === TokenKind.IntegerToken ||
      kind === TokenKind.RealToken ||
      kind === TokenKind.BooleanToken
    )
      return this.parseDeclarationStatement();

    return this.parseAssignmentExpression();
  }

  private parseDeclarationStatement(): ExpressionSyntax {
    const keyword: SyntaxToken = this.nextToken();

    let identifier: SyntaxToken = new SyntaxToken('', TokenKind.BadToken, null);
    if (this.matchKind(TokenKind.IdentifierToken)) {
        identifier = this.nextToken();
    }

    if (this.matchKind(TokenKind.AssignmentOperatorToken))
        this.nextToken();

    let initializingValue: ExpressionSyntax = this.parseAssignmentExpression();
    return new VariableDeclarationSyntax(keyword, identifier ,initializingValue);
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

  private parseAssignmentExpression(paranthesized: boolean = false): ExpressionSyntax {
    let pos1 = this.lookAhead(0);
    let pos2 = this.lookAhead(1);

    if (pos1 && pos1.kind === TokenKind.AssignmentOperatorToken) {
      throw new Error(ErrorObj.ReportIllegalLeftHandAssignment());
    }

    if (
      pos1 && pos2 &&
      pos1.kind === TokenKind.NumberToken &&
      pos2.kind === TokenKind.AssignmentOperatorToken
    ) {
        throw new Error(ErrorObj.ReportIllegalLeftHandAssignment(pos1.token));
    }

    while (
      pos1 !== null && pos2 !== null && 
      pos1.kind === TokenKind.IdentifierToken && 
      pos2.kind === TokenKind.AssignmentOperatorToken
    ) {
      let left = this.parsePrimaryExpression();
      let operator = this.nextToken();
      let right = this.parseAssignmentExpression(paranthesized);

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
    if (this.position >= this.tokens.length) {
      throw new Error(ErrorObj.BehavoiurNotDefinedYet());
    }

    if (this.getCurrent().kind === kind)
      return true;
    
    // report error
    throw new Error(ErrorObj.ReportWorngTokenKind(this.getCurrent().kind, kind));
  }

  private parsePrimaryExpression(): ExpressionSyntax {

    switch (this.getCurrent().kind) {
      case TokenKind.OpenBracketToken: {
        let left = this.nextToken();
        let expression = this.parseExpression(true);
        if (this.matchKind(TokenKind.CloseBracketToken))
          return new ParenthesizeExpressionSyntax(left, expression, this.nextToken());
        break;
      }
      case TokenKind.BooleanFalseToken:
      case TokenKind.BooleanTrueToken: {
        const kind = this.getCurrent().value === true ? TokenKind.BooleanTrueToken : TokenKind.BooleanFalseToken;
        return new LiteralExpressionSyntax(this.nextToken().value, kind);
      }

      case TokenKind.IdentifierToken: {
        return new VariableExpressionSyntax(this.nextToken().token);
      }

      default: {
        if (this.matchKind(TokenKind.NumberToken))
          return new LiteralExpressionSyntax(this.nextToken().value, TokenKind.NumberToken);
        break;
      }
    }

    return new SyntaxToken(this.getCurrent().token, TokenKind.BadToken, null);
  }
}
