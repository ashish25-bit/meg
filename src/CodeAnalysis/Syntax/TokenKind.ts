export enum TokenKind {
    BadToken,
    WhiteSpaceToken,
    EndOfFileToken,

    PlusToken,
    MinusToken,
    MultiplyToken,
    DivideToken,
    OpenBracketToken,
    CloseBracketToken,
    BinaryAndOperator,
    BinaryOrOperator,
    EqualityOperator,
    UnaryNotOperator,

    NumberToken,
    BooleanTrueToken,
    BooleanFalseToken,
    IdentifierToken,

    UnaryExpressionToken,
    BinaryExpressionToken,
    ParenthesizedExpression,
};
