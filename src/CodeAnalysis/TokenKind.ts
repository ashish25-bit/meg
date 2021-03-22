export enum TokenKind {
    BadToken,
    WhiteSpaceToken,
    EndOfFileToken,
    WrongToken,

    NumberToken,
    PlusToken,
    MinusToken,
    MultiplyToken,
    DivideToken,

    OpenBracketToken,
    CloseBracketToken,

    UnaryExpressionSToken,
    BinaryExpressionToken,
    ParenthesizedExpression
};
