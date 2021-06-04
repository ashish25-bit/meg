import { ExpressionSyntax } from "../Syntax/ExpressionSyntax";
import { Expression } from "./Expression";

export class Scope {
  private _scope: number;
  private _variables = new Map<string, any>();
  Parent: Scope | null = null;

  constructor(parent: Scope | null = null, _scope: number) {
    this._scope = _scope;
    this.Parent = parent;
  }

  get scope(): number {
    return this._scope;
  }
  
  get variables(): Map<string, any> {
    return this._variables;
  }

  Declare(variable: ExpressionSyntax) {
    if (this._variables.has(variable.token))
      return false;
    
    this._variables.set(variable.token, undefined);
    return true;
  }

  getVariable(variable: ExpressionSyntax | Expression, checkForUndefined: boolean = false): any {
    if (this._variables.has(variable.token)) {
      const data: any = this._variables.get(variable.token);

      if (checkForUndefined) {
        if (data !== undefined)
          return data;
      }

      else return data;
    }

    if (!this.Parent)
      return false;

    return this.Parent.getVariable(variable, checkForUndefined);
  }

  setVariable(variable: string, data: any): boolean {
    if (this._variables.has(variable)) {
      this._variables.set(variable, data);
      return true;
    }

    if (!this.Parent) return false;

    return this.Parent.setVariable(variable, data);
  }
}