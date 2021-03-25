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
    
    NumberToken,
    BooleanTrueToken,
    BooleanFalseToken,
    IdentifierToken,

    UnaryExpressionToken,
    BinaryExpressionToken,
    ParenthesizedExpression,
};
