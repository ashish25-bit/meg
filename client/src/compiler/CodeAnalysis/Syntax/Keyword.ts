import { TokenKind } from "./TokenKind";

export function getKeywordKind(text: string): TokenKind {
    switch(text) {
        case "true":
            return TokenKind.BooleanTrueToken;
        case "false":
            return TokenKind.BooleanFalseToken;
        default:
            return TokenKind.IdentifierToken;
    }
}