import { Parser } from './CodeAnalysis/Syntax/Parser';
import { ExpressionSyntax } from './CodeAnalysis/Syntax/ExpressionSyntax';
import { Binder } from './CodeAnalysis/AST/AbstractSyntaxtree';
import { Expression } from './CodeAnalysis/AST/Expression';
import { Evaluate } from './CodeAnalysis/Evaluate';
import { ReturnData } from '../utils/ReturnData';

function getReturnData(error: boolean, data: any, lineNumber: number = -1): ReturnData {
  const log: ReturnData = {
    error,
    data,
    lineNumber
  }
  return log;
}

export const expressionAnalyzer = (expression: string,  variables: Map<string, number>, lineNumber: number): ReturnData => {
	
  try {
    const parser = new Parser(expression);
    const statements:Array<ExpressionSyntax> = parser.parser();

    if (parser.errors.length) 
      return getReturnData(true, parser.errors, lineNumber);

    const AST = new Binder();
    let results:Array<ReturnData> = [];
    
    for (const exp of statements) {
      const ast: Expression = AST.bind(exp, variables);
  
      if (AST.errors.length)
        return getReturnData(true, AST.errors, lineNumber);
  
      const evaluate = new Evaluate(variables);
      evaluate.evaluate(ast);
  
      if (evaluate.errors.length)
        return getReturnData(true, evaluate.errors, lineNumber);
      
      const res = getReturnData(false, evaluate.result);
      results.push(res);
      variables = evaluate.variables;
    }
    console.log(results)
    return results[results.length - 1];
  }
  catch (err) {
    return getReturnData(true, [err.message], lineNumber);
  }  
}
