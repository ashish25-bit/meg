import { TokenKind } from "./TokenKind";

export function unaryOperatorPrecedence(kind: TokenKind):number {
    switch(kind) {
        case TokenKind.MinusToken:
        case TokenKind.PlusToken:
            return 5;
        
        default:
            return 0;
    }
}

export function binaryOperatorPrecedence(kind: TokenKind): number {
    switch(kind) {
        case TokenKind.MultiplyToken:
        case TokenKind.DivideToken:
            return 4;
        
        case TokenKind.PlusToken:
        case TokenKind.MinusToken:
            return 3;
        
        case TokenKind.BinaryAndOperator:
            return 2;

        case TokenKind.BinaryOrOperator:
            return 1;
        
        default:
            return 0;
    }
}