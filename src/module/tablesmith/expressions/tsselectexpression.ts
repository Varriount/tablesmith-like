import SelectTuple from './selecttuple';
import TSExpression, { BaseTSExpression } from './tsexpression';
import TSExpressionResult from './tsexpressionresult';
import TSExpressions from './tsexpressions';

/**
 * Select expression for selecting value from given tuples or return a default value.
 */
export default class TSSelectExpression extends BaseTSExpression {
  selector: TSExpression;
  selectTuples: SelectTuple[];
  defaultValue: TSExpressions;
  constructor(selector: TSExpression, selectTuples: SelectTuple[], defaultValue: TSExpressions) {
    super();
    this.selector = selector;
    this.defaultValue = defaultValue;
    this.selectTuples = selectTuples;
  }
  async evaluate(): Promise<TSExpressionResult> {
    const selectorValue = (await this.selector.evaluate()).asString().trim();
    let result;
    for (const tuple of this.selectTuples) {
      if ((await tuple.key.evaluate()).asString().trim() == selectorValue)
        result = (await tuple.value.evaluate()).asString();
    }
    return new TSExpressionResult(result ? result : (await this.defaultValue.evaluate()).asString());
  }

  getExpression(): string {
    let expression = `{Select~${this.selector.getExpression()}`;
    for (const tuple of this.selectTuples) {
      expression += `,${tuple.key.getExpression()},${tuple.value.getExpression()}`;
    }
    const defaultExpression = this.defaultValue.getExpression();
    if (defaultExpression.length > 0) expression += `,${defaultExpression}`;
    return expression + '}';
  }
}
