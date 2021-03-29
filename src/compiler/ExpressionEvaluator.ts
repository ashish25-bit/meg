import { Parser } from './CodeAnalysis/Syntax/Parser';
import { ExpressionSyntax } from './CodeAnalysis/Syntax/ExpressionSyntax';
import { Binder } from './CodeAnalysis/AST/AbstractSyntaxtree';
import { Expression } from './CodeAnalysis/AST/Expression';
import { Evaluate } from './CodeAnalysis/Evaluate';
import { ReturnData } from '../utils/ReturnData';

function getReturnData(error: boolean, data: any): ReturnData {
  const log: ReturnData = {
    error,
    data
  }
  return log;
}

export const expressionEvaluator = (expression: string): any => {
	
	const parser = new Parser(expression);
	const exp:ExpressionSyntax = parser.parser();

	if (parser.errors.length) 
    return getReturnData(true, parser.errors);
		

	const AST = new Binder();
	const ast: Expression = AST.bind(exp);

	if (AST.errors.length)
    return getReturnData(true, AST.errors);

	const evaluate = new Evaluate();
  let variables = new Map<string, number>();
  evaluate.evaluate(ast, variables);

  if (evaluate.errors.length)
    return getReturnData(true, evaluate.errors);
  
  return getReturnData(false, evaluate.result);  
}
