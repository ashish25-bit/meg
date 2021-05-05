export enum TokenKind {
    BadToken,
    WhiteSpaceToken,
    EndOfFileToken,

    OpenCurlyBraceToken,
    CloseCurlyBraceToken,
    OpenBracketToken,
    CloseBracketToken,
    UnaryNotOperator,
    ModulusToken,
    MultiplyToken,
    DivideToken,
    PlusToken,
    MinusToken,
    BinaryAndOperator,
    BinaryOrOperator,
    EqualityOperator,
    NotEqualOperator,
    AssignmentOperatorToken,

    NumberToken,
    BooleanTrueToken,
    BooleanFalseToken,
    IdentifierToken,

    BlockExpression,
    UnaryExpressionToken,
    BinaryExpressionToken,
    ParenthesizedExpression,
    VariableExpression,
    InitializationExpression
};
