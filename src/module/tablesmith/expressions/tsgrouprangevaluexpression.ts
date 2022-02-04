import { tstables } from '../tstables';
import TSExpression, { BaseTSExpression } from './tsexpression';
import TSExpressionResult from './tsexpressionresult';

/**
 * Expression to give back range value from group.
 */
export default class TSGroupRangeValueExpression extends BaseTSExpression {
  functionname: string;
  tablename: string;
  groupExpression: TSExpression;
  rangeExpression: TSExpression;
  constructor(functionname: string, tablename: string, groupExpression: TSExpression, rangeExpression: TSExpression) {
    super();
    this.functionname = functionname;
    this.tablename = tablename;
    this.groupExpression = groupExpression;
    this.rangeExpression = rangeExpression;
  }
  async evaluate(): Promise<TSExpressionResult> {
    const groupname = (await this.groupExpression.evaluate()).trim();
    const group = tstables.tableForName(this.tablename)?.groupForName(groupname);
    if (!group) throw Error(`Cannot Count group '${groupname}' in table '${groupname}', not defined!`);
    const rangeIndex = (await this.rangeExpression.evaluate()).asInt();
    if (rangeIndex <= 0 || group.getRanges().length < rangeIndex)
      throw Error(`Index for '${this.functionname}' out of bounds='${rangeIndex}'`);
    let result;
    switch (this.functionname) {
      case 'MinVal':
        result = group.getRanges()[rangeIndex - 1].getLower();
        break;
      case 'MaxVal':
        result = group.getRanges()[rangeIndex - 1].getUpper();
        break;
      default:
        throw Error(`Functionname='${this.functionname}' is unknown for Min/MaxVal`);
    }
    return new TSExpressionResult(result);
  }

  getExpression(): string {
    return `{${this.functionname}~${this.groupExpression.getExpression()},${this.rangeExpression.getExpression()}}`;
  }
}
