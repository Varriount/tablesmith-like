import { tstables } from '../tstables';
import TSExpression, { BaseTSExpression } from './tsexpression';
import TSExpressionResult from './tsexpressionresult';

/**
 * Expression to give Count in a group.
 */
export default class TSGroupCountExpression extends BaseTSExpression {
  tablename: string;
  groupExpression: TSExpression;
  constructor(tablename: string, groupExpression: TSExpression) {
    super();
    this.tablename = tablename;
    this.groupExpression = groupExpression;
  }
  async evaluate(): Promise<TSExpressionResult> {
    const groupname = (await this.groupExpression.evaluate()).trim();
    const group = tstables.tableForName(this.tablename)?.groupForName(groupname);
    if (!group) throw Error(`Cannot Count group '${groupname}' in table '${groupname}', not defined!`);
    return new TSExpressionResult(group.count());
  }

  getExpression(): string {
    return `{Count~${this.groupExpression.getExpression()}}`;
  }
}
