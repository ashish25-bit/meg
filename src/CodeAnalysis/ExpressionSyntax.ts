import { TokenKind } from './TokenKind';

export abstract class ExpressionSyntax {
    [x: string]: any;
    abstract kind: TokenKind;
}
