import { TokenKind } from "./TokenKind";

export function getKeywordKind(text: string): TokenKind {
    switch(text) {
        case "true":
            return TokenKind.BooleanTrueToken;
        case "false":
            return TokenKind.BooleanFalseToken;
        case "string":
            return TokenKind.StringToken;
        case "int":
            return TokenKind.IntegerToken;
        case "real":
            return TokenKind.RealToken;
        case "bool":
            return TokenKind.BooleanToken;
        default:
            return TokenKind.IdentifierToken;
    }
}