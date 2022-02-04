import TSExpression, { BaseTSExpression } from './tsexpression';
import TSExpressionResult from './tsexpressionresult';
import TSExpressions from './tsexpressions';

/**
 * While expression to loop while a condition is true or a value is not "0".
 */
export default class TSWhileExpression extends BaseTSExpression {
  checkExpression: TSExpression;
  block: TSExpressions;
  constructor(checkExpression: TSExpression, block: TSExpressions) {
    super();
    this.checkExpression = checkExpression;
    this.block = block;
  }
  async evaluate(): Promise<TSExpressionResult> {
    let result = '';
    let checkResult = await this.checkExpression.evaluate();
    let counter = 0;
    while (checkResult.asString() != '0') {
      result += (await this.block.evaluate()).asString();
      checkResult = await this.checkExpression.evaluate();
      counter += 1;
      if (counter > 1000)
        throw Error(`TSWhileExpression.evaluate() looped 1000 times, aborting: ${this.getExpression()}`);
    }
    return new TSExpressionResult(result);
  }

  getExpression(): string {
    const be = this.checkExpression.getExpression(),
      block = this.block.getExpression();
    return `{While~${be},${block}}`;
  }
}
