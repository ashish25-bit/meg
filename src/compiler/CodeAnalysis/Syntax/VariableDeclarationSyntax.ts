import { TokenKind } from './TokenKind';
import { ExpressionSyntax } from './ExpressionSyntax';
import { SyntaxToken } from './SyntaxToken';

export class VariableDeclarationSyntax extends ExpressionSyntax {
  kind: TokenKind;
  keyword: SyntaxToken;
  identifier: SyntaxToken;
  initializingValue: ExpressionSyntax;

  constructor(keyword: SyntaxToken, identifier: SyntaxToken, initializingValue: ExpressionSyntax) {
    super();
    this.kind = TokenKind.VariableDeclaration;
    this.keyword = keyword;
    this.identifier = identifier;
    this.initializingValue = initializingValue;
  }
}