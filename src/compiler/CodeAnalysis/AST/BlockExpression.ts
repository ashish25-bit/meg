import { SyntaxToken } from "../Syntax/SyntaxToken";
import { Expression } from "./Expression";
import { NodeKind } from "./NodeKind";
import { Types } from "./Types";

export class BlockExpression extends Expression {
  type: string;
  kind: NodeKind;
  openBrace: SyntaxToken;
  statements: Array<Expression>;
  closeBrace: SyntaxToken;

  constructor(openBrace: SyntaxToken, statements: Array<Expression>, closeBrace: SyntaxToken) {
    super();
    this.type = Types.BlockExpression;
    this.kind = NodeKind.BlockExpression;
    this.openBrace = openBrace;
    this.statements = statements;
    this.closeBrace = closeBrace;
  }
}