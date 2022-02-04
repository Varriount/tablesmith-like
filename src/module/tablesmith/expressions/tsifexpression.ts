import BooleanComparison from './booleancomparison';
import { BaseTSExpression } from './tsexpression';
import TSExpressionResult from './tsexpressionresult';
import TSExpressions from './tsexpressions';

/**
 * Ternary if expression for TS-Function IIf ":" or If "/".
 */
export default class TSIfExpression extends BaseTSExpression {
  functionName: string;
  booleanComparision: BooleanComparison;
  trueVal: TSExpressions;
  falseVal: TSExpressions;
  constructor(
    functionName: string,
    booleanComparision: BooleanComparison,
    trueVal: TSExpressions,
    falseVal: TSExpressions,
  ) {
    super();
    this.functionName = functionName;
    this.booleanComparision = booleanComparision;
    this.trueVal = trueVal;
    this.falseVal = falseVal;
  }
  async evaluate(): Promise<TSExpressionResult> {
    const boolResult = (await this.booleanComparision.evaluate()).asString();
    const result = await (boolResult == '1' ? this.trueVal.evaluate() : this.falseVal.evaluate());
    return new TSExpressionResult(result.asString());
  }

  getExpression(): string {
    const be = this.booleanComparision.getExpression(),
      et = this.trueVal.getExpression(),
      ef = this.falseVal.getExpression();
    return `{${this.functionName}~${be}?${et}${this.valueSeparator()}${ef}}`;
  }

  /**
   * Correct true false value separator for function name.
   */
  private valueSeparator(): string {
    return this.functionName === 'If' ? '/' : ':';
  }
}
