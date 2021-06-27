import { TokenKind } from "./Syntax/TokenKind";

class Errors {
  ReportBadCharacter(character: string): string {
    const msg = `Bad character input '${character}'`;
    return msg;
  }

  ReportWorngTokenKind(actual: TokenKind, expected: TokenKind): string {
    const msg = `Unexpected token ${TokenKind[actual]}, expected ${TokenKind[expected]}`;
    return msg;
  }

  ReportUnknownKind(kind: TokenKind): string {
    const msg = `Unexpected syntax kind: '${TokenKind[kind]}'`;
    return msg;
  }

  ReportUnknownUnaryOperator(kind: TokenKind): string {
    const msg = `Unknown unary token kind '${kind}'`;
    return msg;
  }

  ReportUnkownBinaryOperator(kind: TokenKind): string {
    const msg = `Unknown unary token kind '${kind}'`;
    return msg;
  }

  ReportUndefinedVariable(value: string): string {
    const msg = `Variable '${value}' is not present in the scope.`;
    return msg;
  }

  ReportIllegalLeftHandAssignment(value: string | null = null): string {
    let msg: string;
    if (value)
      msg = `Cannot Assign to a constant ${value}`;
    else 
      msg = `Cannot Assign to a constant an expression`;
    return msg;
  }

  ReportVariableAlreadyDeclared(name: any): string {
    const msg = `Variable ${name} already declared in the scope.`;
    return msg;
  }

  BehavoiurNotDefinedYet(): string {
    const msg = `Error not defined yet.`;
    return msg;
  }
}

export const ErrorObj = new Errors();