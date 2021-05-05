import { TokenKind } from './TokenKind';
import { SyntaxToken } from "./SyntaxToken";
import { ExpressionSyntax } from './ExpressionSyntax';

export class BlockExpressionSyntax extends ExpressionSyntax {
  kind: TokenKind;
  openBrace: SyntaxToken;
  statements: Array<ExpressionSyntax>;
  closeBrace: SyntaxToken;

  constructor(openBrace: SyntaxToken, statments: Array<ExpressionSyntax>, closeBrace: SyntaxToken) {
    super();
    this.kind = TokenKind.BlockExpression;
    this.openBrace = openBrace;
    this.statements = statments;
    this.closeBrace = closeBrace;
  }
}
