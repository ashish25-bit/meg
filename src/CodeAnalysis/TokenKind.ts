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
    BinaryAndOperator,
    BinaryOrOperator,

    BooleanTrueToken,
    BooleanFalseToken,
    IdentifierToken,

    UnaryExpressionSToken,
    BinaryExpressionToken,
    ParenthesizedExpression,
};
