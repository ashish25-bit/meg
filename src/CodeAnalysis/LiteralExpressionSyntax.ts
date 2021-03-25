import { TokenKind } from './TokenKind';
import { ExpressionSyntax } from './ExpressionSyntax';


export class LiteralExpressionSyntax extends ExpressionSyntax {
    kind: TokenKind;
    value: number | null | boolean;
    constructor(value: number | null | boolean, kind: TokenKind) {
        super();
        this.kind = kind;
        this.value = value;
    }
}
