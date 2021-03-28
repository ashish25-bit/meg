import { ExpressionSyntax } from './ExpressionSyntax';
import { TokenKind } from './TokenKind';

export class SyntaxToken extends ExpressionSyntax{
    public token: string;
    public kind: TokenKind;
    public value: number | null | boolean;

    constructor(token: string, tokenKind: TokenKind, value: number | null | boolean) {
        super();
        this.token = token;
        this.kind = tokenKind;
        this.value = value;
    }
}
