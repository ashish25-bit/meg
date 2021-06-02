import { TokenKind } from "./Syntax/TokenKind";

class Errors {
  private static _errors: Array<string>;

  constructor() {
      Errors._errors = [];
  }

  public initialize(): void {
    Errors._errors = [];
  }
  
  get errors() {
    return Errors._errors;
  }

  ReportBadCharacter(character: string) {
    const msg = `Bad character input '${character}'`;
    Errors._errors.push(msg);
  }

  ReportWorngTokenKind(actual: TokenKind, expected: TokenKind) {
    const msg = `Unexpected token ${TokenKind[actual]}, expected ${TokenKind[expected]}`;
    Errors._errors.push(msg);
  }

  ReportUnknownKind(kind: TokenKind) {
    const msg = `Unexpected syntax kind: '${TokenKind[kind]}'`;
    Errors._errors.push(msg);
  }

  ReportUnknownUnaryOperator(kind: TokenKind) {
    const msg = `Unknown unary token kind '${kind}'`;
    Errors._errors.push(msg);
  }

  ReportUnkownBinaryOperator(kind: TokenKind) {
    const msg = `Unknown unary token kind '${kind}'`;
    Errors._errors.push(msg);
  }

  ReportUndefinedVariable(value: string) {
    const msg = `Variable '${value}' is not present in the scope. Result undefined`;
    Errors._errors.push(msg);
  }

  ReportIllegalLeftHandAssignment(value: string | null = null) {
    let msg: string;
    if (value)
      msg = `Cannot Assign to a constant ${value}`;
    else 
      msg = `Cannot Assign to a constant an expression`;
    Errors._errors.push(msg);
  }
}

export const ErrorObj = new Errors();