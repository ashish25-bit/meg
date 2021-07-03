import { TokenKind } from './TokenKind';
import { ExpressionSyntax } from './ExpressionSyntax';
import { SyntaxToken } from './SyntaxToken';

export class PrintStatement extends ExpressionSyntax {
  kind: TokenKind;
  variable: ExpressionSyntax;
  printToken: SyntaxToken;

  constructor(printToken: SyntaxToken, variable: ExpressionSyntax) {
    super();
    this.kind = TokenKind.PrintStatement;
    this.variable = variable;
    this.printToken = printToken;
  }
}
