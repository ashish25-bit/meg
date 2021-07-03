import { KeywordData } from "../../utils/KeywordData";
import { TokenKind } from "./TokenKind";

function getData(kind: TokenKind, value: any): KeywordData {
    const data: KeywordData = {kind, value}
    return data;
}

export function getKeywordKind(text: string): KeywordData {
    switch(text) {
        case "true":
            return getData(TokenKind.BooleanTrueToken, true);
        case "false":
            return getData(TokenKind.BooleanFalseToken, false);
        case "string":
            return getData(TokenKind.StringToken, null);
        case "int":
            return getData(TokenKind.IntegerToken, null);
        case "real":
            return getData(TokenKind.RealToken, null);
        case "bool":
            return getData(TokenKind.BooleanToken, null);
        case "print":
            return getData(TokenKind.PrintKeyword, null);
        default:
            return getData(TokenKind.IdentifierToken, null);
    }
}