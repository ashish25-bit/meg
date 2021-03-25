import { TokenKind } from './TokenKind';
import { ExpressionSyntax } from './ExpressionSyntax';


export class WorngTokenExpression extends ExpressionSyntax {
    kind: TokenKind;
    constructor() {
        super();
        this.kind = TokenKind.WrongToken;
    }
}
