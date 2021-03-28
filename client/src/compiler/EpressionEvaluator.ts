import { Parser } from './CodeAnalysis/Syntax/Parser';
import { ExpressionSyntax } from './CodeAnalysis/Syntax/ExpressionSyntax';
import { Binder } from './CodeAnalysis/AST/AbstractSyntaxtree';
import { Expression } from './CodeAnalysis/AST/Expression';
import { Evaluate } from './CodeAnalysis/Evaluate';
import { ReturnData } from '../utils/ReturnData';

export const expressionEvaluator = (expression: string): any => {
	
	const parser = new Parser(expression);
	const exp:ExpressionSyntax = parser.parser();

	if (parser.errors.length) {
		const data:ReturnData = { 
      error: true,
      data: parser.errors
    };
		
    return data;
	}

	const AST = new Binder();
	const ast: Expression = AST.bind(exp);

	if (AST.errors.length) {
		const data:ReturnData = { 
      error: true,
      data: parser.errors
    };
		
    return data;
	}

	const evaluate = new Evaluate();
  const data:ReturnData = { 
    error: false,
    data: evaluate.evaluate(ast)
  };
  
  return data;
}
