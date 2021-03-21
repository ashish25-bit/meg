import { TokenKind } from './TokenKind';


export class SyntaxToken {
    public token: string;
    public kind: TokenKind;
    public value: number | null;

    constructor(token: string, tokenKind: TokenKind, value: number | null) {
        this.token = token;
        this.kind = tokenKind;
        this.value = value;
    }
}
