import { getKeywordKind } from './Keyword';
import { SyntaxToken } from './SyntaxToken';
import { TokenKind } from './TokenKind';
import { ErrorObj } from '../ErrorHandling';
import { KeywordData } from '../../utils/KeywordData';

export class Lexer {
  private expression: string;
  private position: number;

  constructor(expression: string) {
    this.expression = expression;
    this.position = -1;
  }

  private next = (): void => { this.position++; };

  private getChar(): string {
    if (this.position === this.expression.length)
      return '\0';
    return this.expression[this.position];
  }

  // checks whether the char is a digit or not
  private isDigit(): boolean {
    const char: string = this.getChar();
    return !isNaN(parseFloat(char)) || char === '.';
  }

  private isAlpha(): boolean {
    const char: string = this.getChar();
    return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z');
  }

  nextToken(): SyntaxToken {
    this.next();
    let ch: string = this.getChar();

    switch (ch) {
      // end of file or end of line token
      case '\0':
        return new SyntaxToken('EOF', TokenKind.EndOfFileToken, null);

      // whitespace
      case ' ':
      case '\t':
      case '\n':
        let whiteSpaceStr = "";
        while (this.getChar() === ' ' || this.getChar() === '\t' || this.getChar() === '\n') {
          whiteSpaceStr = whiteSpaceStr + ' ';
          this.next();
        }
        this.position--;
        return new SyntaxToken(whiteSpaceStr, TokenKind.WhiteSpaceToken, null);

      // number
      case '1': case '2': case '3': case '4': case '5':
      case '6': case '7': case '8': case '9': case '0':
        let num: string = "";
        while (this.isDigit()) {
          num += this.getChar();
          this.next();
        }

        const isNumber: boolean = !isNaN(parseFloat(num));

        this.position--;

        return new SyntaxToken(
          num,
          isNumber ? TokenKind.NumberToken : TokenKind.BadToken,
          isNumber ? parseFloat(num) : null
        );

      // AND operator
      case '&':
        this.next();
        if (this.getChar() === '&')
          return new SyntaxToken('&&', TokenKind.BinaryAndOperator, null);
        // // can add the bitwise &
        // else 
        //     return new SyntaxToken('&', TokenKind.BitwiseAndOperator, null);
        break;

      // OR operator
      case '|':
        this.next();
        if (this.getChar() === '|')
          return new SyntaxToken('||', TokenKind.BinaryOrOperator, null);
        // // can add the bitwise |
        // else 
        //     return new SyntaxToken('&&', TokenKind.BitwiseOrOperator, null);
        break;

      // assignment or equality operator
      case '=':
        this.next();
        if (this.getChar() === '=')
          return new SyntaxToken('==', TokenKind.EqualityOperator, null)

        this.position--;
        return new SyntaxToken('=', TokenKind.AssignmentOperatorToken, null);

      // NOT operator or Not equal operator
      case '!':
        this.next();
        if (this.getChar() === '=')
          return new SyntaxToken('!=', TokenKind.NotEqualOperator, null);

        this.position--;
        return new SyntaxToken('!', TokenKind.UnaryNotOperator, null);

      // less than and less than or equals to
      case '<':
        this.next();
        if (this.getChar() === '=')
          return new SyntaxToken('<=', TokenKind.LessThanOrEqualOperator, null);

        this.position--;
        return new SyntaxToken('<', TokenKind.LessThanOperator, null);

      // less than and less than or equals to
      case '>':
        this.next();
        if (this.getChar() === '=')
          return new SyntaxToken('>=', TokenKind.GreaterThanOrEqualOperator, null);

        this.position--;
        return new SyntaxToken('>', TokenKind.GreaterThanOperator, null);

      case '%':
        return new SyntaxToken('%', TokenKind.ModulusToken, null);

      case '+':
        return new SyntaxToken('+', TokenKind.PlusToken, null);

      case '-':
        return new SyntaxToken('-', TokenKind.MinusToken, null);

      case '*':
        return new SyntaxToken('*', TokenKind.MultiplyToken, null);

      case '/':
        return new SyntaxToken('/', TokenKind.DivideToken, null);

      case '(':
        return new SyntaxToken('(', TokenKind.OpenBracketToken, null);

      case ')':
        return new SyntaxToken(')', TokenKind.CloseBracketToken, null);
      
      case '{':
        return new SyntaxToken('{', TokenKind.OpenCurlyBraceToken, null);

      case '}':
        return new SyntaxToken('}', TokenKind.CloseCurlyBraceToken, null);

      default:

        if (!this.isAlpha())
          break;

        let str: string = "";
        while (this.isAlpha()) {
          str += this.getChar();
          this.next();
        }

        if (this.getChar() !== '\0' && this.getChar() !== ' ' && this.getChar() !== '\t')
          this.position--;

        const {kind, value}: KeywordData = getKeywordKind(str);
        
        // if (kind === TokenKind.BooleanTrueToken)
        //   return new SyntaxToken(str, kind, true);

        // if (kind === TokenKind.BooleanFalseToken)
        //   return new SyntaxToken(str, kind, false);

        // if (kind === TokenKind.StringToken)
        //   return new SyntaxToken(str, kind, null);
          
        // if (kind === TokenKind.IntegerToken)
        //   return new SyntaxToken(str, kind, null);
          
        // if (kind === TokenKind.BooleanToken)
        //   return new SyntaxToken(str, kind, null);

        // if (kind === TokenKind.RealToken)
        //   return new SyntaxToken(str, kind, null);

        // return new SyntaxToken(str, kind, null);
        return new SyntaxToken(str, kind, value);

    }

    throw new Error(ErrorObj.ReportBadCharacter(ch));
    // return new SyntaxToken(ch, TokenKind.BadToken, null);
  }
}
