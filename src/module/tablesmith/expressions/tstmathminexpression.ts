import TSExpression, { BaseTSExpression } from './tsexpression';
import TSExpressionResult from './tsexpressionresult';

/**
 * Math min function to get smaller of the two values.
 */
export default class TSMathMinExpression extends BaseTSExpression {
  values: TSExpression[];
  constructor(values: TSExpression[]) {
    super();
    this.values = values;
  }
  async evaluate(): Promise<TSExpressionResult> {
    const nums = await Promise.all(this.values.map(async (value) => (await value.evaluate()).asNumber()));
    return new TSExpressionResult(Math.min(...nums));
  }
  getExpression(): string {
    const expressions = this.values.reduce(
      (all, cur) => (all.length > 0 ? all + ',' + cur.getExpression() : cur.getExpression()),
      '',
    );
    return `{Min~${expressions}}`;
  }
}
