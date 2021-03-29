import { TokenKind } from "./TokenKind";

const MAX = 8;

export function unaryOperatorPrecedence(kind: TokenKind):number {
    switch(kind) {
        case TokenKind.MinusToken:
        case TokenKind.PlusToken:
        case TokenKind.UnaryNotOperator:
            return MAX;
        
        default:
            return 0;
    }
}

export function binaryOperatorPrecedence(kind: TokenKind): number {
    switch(kind) {

        case TokenKind.ModulusToken:
            return MAX - 1;

        case TokenKind.MultiplyToken:
        case TokenKind.DivideToken:
            return MAX - 2;
        
        case TokenKind.PlusToken:
        case TokenKind.MinusToken:
            return MAX - 3;
        
        case TokenKind.EqualityOperator:
        case TokenKind.NotEqualOperator:
            return MAX - 4;

        case TokenKind.BinaryAndOperator:
            return MAX - 5;

        case TokenKind.BinaryOrOperator:
            return MAX - 6;

        case TokenKind.AssignmentOperatorToken:
            return MAX - 7;

        default:
            return 0;
    }
}