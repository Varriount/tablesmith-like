/**
 * Managed object of this form with all data.
 */
const enum MODFIERS {
  '+',
  '-',
  '=',
  'none',
}
export default class TableCallValues {
  tablename: string;
  groupname: string;
  modifier: MODFIERS;
  modifierValue: number;
  parameters: string[];
  constructor() {
    this.tablename = '';
    this.groupname = 'Start';
    this.modifier = MODFIERS.none;
    this.modifierValue = 0;
    this.parameters = [];
  }

  /**
   * Creates a Tablesmith call expression in format: '['[tablename].[groupname]([modifier][modifiervalue])?(param1,..,param-n)?']'
   * @returns Expression for Tablesmith evaluate.
   */
  createExpression(): string {
    let mod = '';
    let params = '';
    if (this.modifier != MODFIERS.none) mod = `${this.modifier}${this.modifierValue}`;
    if (this.parameters.length > 0) params = `(${this.parameters.join(',')})`;
    return `[${this.tablename}.${this.groupname}${mod}${params}]`;
  }
}
