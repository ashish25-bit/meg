import { Parser } from './CodeAnalysis/Syntax/Parser';
import { ExpressionSyntax } from './CodeAnalysis/Syntax/ExpressionSyntax';
import { Binder } from './CodeAnalysis/AST/AbstractSyntaxtree';
import { Evaluate } from './CodeAnalysis/Evaluate';
import { ReturnData } from '../utils/ReturnData';
import { ErrorObj } from './CodeAnalysis/ErrorHandling'
import { Unit } from './CodeAnalysis/AST/Unit';

function getReturnData(error: boolean, data: any, lineNumber: number = -1): ReturnData {
  const log: ReturnData = {
    error,
    data,
    lineNumber
  }
  return log;
}

export const expressionAnalyzer = (expression: string,  variables: Map<string, number>, lineNumber: number = 0): ReturnData => {
	
  try {
    ErrorObj.initialize();

    const parser = new Parser(expression);
    const statements:Array<ExpressionSyntax> = parser.parser();

    if (ErrorObj.errors.length) 
      return getReturnData(true, ErrorObj.errors, lineNumber);

    const AST = new Binder();
    let results:Array<ReturnData> = [];
    
    for (const exp of statements) {
      const unit: Unit = AST.bind(exp);
      
      if (ErrorObj.errors.length)
        return getReturnData(true, ErrorObj.errors, lineNumber);
  
      const evaluate = new Evaluate(unit);
      evaluate.evaluate(unit);
  
      if (ErrorObj.errors.length)
        return getReturnData(true, ErrorObj.errors, lineNumber);
      
      console.log(unit);

      const res = getReturnData(false, evaluate.result);
      results.push(res);
    }
    console.log(results)
    return results[results.length - 1];
  }
  catch (err) {
    return getReturnData(true, [err.message], lineNumber);
  }  
}
