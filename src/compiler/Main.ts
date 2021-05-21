import { expressionAnalyzer } from './Analyzer';
import { ReturnData } from '../utils/ReturnData';

export const mainEvaluator = (lineData: Array<string>): ReturnData => {
  const variables = new Map<string, number>();

  let result: any;
  let expression:string = "";

  for (let index = 0; index < lineData.length; index++) {
    const line = lineData[index].trim();

    if (line === '')
      continue;

    expression = expression + line + '\n';
  }
  result = expressionAnalyzer(expression, variables);
  return result;
}
