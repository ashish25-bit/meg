import { TokenKind } from './TokenKind';


export class SyntaxToken {
    public token: string;
    public kind: TokenKind;
    public value: number | null | boolean;

    constructor(token: string, tokenKind: TokenKind, value: number | null | boolean) {
        this.token = token;
        this.kind = tokenKind;
        this.value = value;
    }
}
