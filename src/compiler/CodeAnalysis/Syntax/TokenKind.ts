export enum TokenKind {
    BadToken,
    WhiteSpaceToken,
    EndOfFileToken,

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

    UnaryExpressionToken,
    BinaryExpressionToken,
    ParenthesizedExpression,
    VariableExpression,
    InitializationExpression
};
