import { TokenKind } from "./TokenKind";

export function unaryOperatorPrecedence(kind: TokenKind):number {
    switch(kind) {
        case TokenKind.MinusToken:
        case TokenKind.PlusToken:
        case TokenKind.UnaryNotOperator:
            return 6;
        
        default:
            return 0;
    }
}

export function binaryOperatorPrecedence(kind: TokenKind): number {
    switch(kind) {
        case TokenKind.MultiplyToken:
        case TokenKind.DivideToken:
            return 5;
        
        case TokenKind.PlusToken:
        case TokenKind.MinusToken:
            return 4;
        
        case TokenKind.BinaryAndOperator:
            return 3;

        case TokenKind.BinaryOrOperator:
            return 2;

        case TokenKind.EqualityOperator:
            return 1;
        
        default:
            return 0;
    }
}