import { expressionEvaluator } from './ExpressionEvaluator';
import { ReturnData } from '../utils/ReturnData';

export const mainEvaluator = (lineData: Array<string>): ReturnData => {
  const variables = new Map<string, number>();

  let result: any;
  for (let index = 0; index < lineData.length; index++) {
    const line = lineData[index].trim();

    if (line === '')
      continue;
    
    const data: any = expressionEvaluator(line, variables, index);
    result = data;
  }
  return result;
}
