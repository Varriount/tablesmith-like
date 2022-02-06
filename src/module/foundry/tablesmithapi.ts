import JournalTables from './journaltables';
import { tablesmith } from '../tablesmith/tablesmithinstance';
import { Logger } from './logger';
import { TableCallValues } from './tablecallvalues';
import TableSelectionForm from './forms/tableselectionform';
import ChatResults from './chatresults';
import { displayTableParseErrors } from './forms/displayparseerrors';
import ParamInputForm from './forms/paraminputform';
export default class TablesmithApi {
  constructor() {
    JournalTables.loadTablesFromJournal();
  }

  /**
   * Reloads all tables and deletes table that has been removed, if errors are encountered and options
   * set the Errors are displayed in a Dialog for inspection.
   * @param options for reloading tables.
   * @param options.showErrors boolean indicating of errors on reload should be displayed va dialog, defaults
   * to true.
   */
  reloadTables(options: { showErrors: boolean } = { showErrors: true }): void {
    const errors = JournalTables.reloadTablesFromJournal();
    if (options.showErrors && errors.length > 0) this.displayTableParseErrors();
  }

  /**
   * Shows a Dialog with all encountered Table parse errors.
   */
  displayTableParseErrors(): void {
    displayTableParseErrors();
  }

  /**
   * Shows the selector form to select and execute Tables.
   * @param callValues to prefill for with or undefined to start with emtpy form.
   * @returns TableSelectionForm that has already been rendered.
   */
  showForm(callValues: TableCallValues = new TableCallValues()): TableSelectionForm {
    const form = new TableSelectionForm(callValues);
    form.render(true);
    return form;
  }

  /**
   * Parses Table call values from string and returns parse object.
   * @param expression to parse.
   * @returns TableCallValues for expression.
   */
  parseEvaluateCall(call: TableCallValues | string): TableCallValues | undefined {
    let result = undefined;
    try {
      result = tablesmith.parseEvaluateCall(call);
    } catch (error) {
      Logger.info(false, `Could not parse Expression '${call}'`);
    }
    return result;
  }

  /**
   * Evaluates / rolls on given Tablesmith Table and posts result to chat.
   * @param call of table to evaluate, may be a call expression or a already parsed
   * TableCallValues object.
   * @param options Options object for evaluation.
   * @param options.chatResults defaults to true, boolean value if results should be added to chat.
   * @param options.lenient defaults to false, should the evaluation try to create a valid expression
   * by fixing standard errors?.
   */
  async evaluateTable(
    call: TableCallValues | string,
    options: { chatResults?: boolean; lenient?: boolean } = { chatResults: true, lenient: false },
  ): Promise<string | string[]> {
    if (options.lenient && typeof call === 'string') call = this.enhanceCall(call);
    let result: string | string[] = '';
    const callValues = this.parseEvaluateCall(call);
    if (callValues) {
      const submitted = await ParamInputForm.gather(callValues);
      if (!submitted)
        Logger.warn(false, 'Gathering Parameters Form for Table closed, using default parameters!', callValues);
      result = await tablesmith.evaluate(callValues);
      Logger.debug(false, 'Result for', callValues, result);
      if (options.chatResults) {
        new ChatResults().chatResults(callValues, result);
      }
    }
    return result;
  }

  /**
   * Fixes common call syntax errors to potentially fix an invalid call.
   * @param call to enhance to valid syntax.
   * @returns Enhanced call object.
   */
  private enhanceCall(call: string): string {
    call = call.trim();
    if (call[0] != '[') call = `[${call}]`; // wrap in Tablesmith call brackets if needed
    return call;
  }
}
