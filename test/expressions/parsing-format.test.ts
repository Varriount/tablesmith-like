import { tablesmith } from '../../src/module/tablesmith/tablesmithinstance';

import { tstables } from '../../src/module/tablesmith/tstables';

let filename: string;
let simpleTable: string;

describe('Special chars escaping', () => {
  beforeEach(() => {
    tablesmith.reset();
    filename = 'simpletable';
  });

  it('escaped chars result in correct expression', () => {
    simpleTable = ':Start\n1,/%/[/]/\n';
    tablesmith.addTable('folder', filename, simpleTable);
    expect(tstables.getLastTSTable()?.groupForName('Start')?.lastRange()?.getExpression()).toBe('/%/[/]/');
  });

  it('/% results in %', async () => {
    simpleTable = ':Start\n1,/%/%\n';
    tablesmith.addTable('folder', filename, simpleTable);
    expect(await tablesmith.evaluate(`[${filename}]`)).toBe('%%');
  });

  it('/[ results in [', async () => {
    simpleTable = ':Start\n1,/[/[\n';
    tablesmith.addTable('folder', filename, simpleTable);
    expect(await tablesmith.evaluate(`[${filename}]`)).toBe('[[');
  });

  it('/] results in ]', async () => {
    simpleTable = ':Start\n1,/]/]\n';
    tablesmith.addTable('folder', filename, simpleTable);
    expect(await tablesmith.evaluate(`[${filename}]`)).toBe(']]');
  });
  it('/ without char to escape results in /', async () => {
    simpleTable = ':Start\n1,/%/\n';
    tablesmith.addTable('folder', filename, simpleTable);
    expect(await tablesmith.evaluate(`[${filename}]`)).toBe('%/');
  });

  it('/ without char can be chained', async () => {
    simpleTable = ':Start\n1,/%/// other\n';
    tablesmith.addTable('folder', filename, simpleTable);
    expect(await tablesmith.evaluate(`[${filename}]`)).toBe('%/// other');
  });
});

describe('Parsing {Bold~', () => {
  beforeEach(() => {
    tablesmith.reset();
    filename = 'simpletable';
  });

  it('bold expression correct simple text', async () => {
    simpleTable = ':Start\n1,{Bold~One}\n';
    tablesmith.addTable('folder', filename, simpleTable);
    expect(tstables.getLastTSTable()?.groupForName('Start')?.lastRange()?.getExpression()).toBe('{Bold~One}');
  });

  it('bold expressions correct with single %var%', async () => {
    simpleTable = '%var%,1\n:Start\n1,{Bold~One=%var%}\n';
    tablesmith.addTable('folder', filename, simpleTable);
    expect(tstables.getLastTSTable()?.groupForName('Start')?.lastRange()?.getExpression()).toBe('{Bold~One=%var%}');
  });
  it('text with b tags', async () => {
    simpleTable = ':Start\n1,{Bold~One}\n';
    tablesmith.addTable('folder', filename, simpleTable);
    expect(await tablesmith.evaluate(`[${filename}]`)).toBe('<b>One</b>');
  });

  it('nested expression with b tags', async () => {
    simpleTable = ':Start\n1,{Bold~{Calc~4}[other]}\n:other\n1,value\n';
    tablesmith.addTable('folder', filename, simpleTable);
    expect(await tablesmith.evaluate(`[${filename}]`)).toBe('<b>4value</b>');
  });
});

describe('Parsing {Line~', () => {
  beforeEach(() => {
    tablesmith.reset();
    filename = 'simpletable';
  });

  it('can be split over many lines', async () => {
    simpleTable = ':Start\n1,One{ \n_ Line~ \n_ center \n_ , \n_ 100 \n_ } \n_ Two\n';
    tablesmith.addTable('folder', filename, simpleTable);
    expect(await tablesmith.evaluate(`[${filename}]`)).toBe('One<br/> Two');
  });

  it('Line expression format correct', async () => {
    simpleTable = ':Start\n1,One{Line~center,100}Two\n';
    tablesmith.addTable('folder', filename, simpleTable);
    expect(tstables.getLastTSTable()?.groupForName('Start')?.lastRange()?.getExpression()).toBe(
      'One{Line~center,100%}Two',
    );
  });
  it('for Group with Line formats html', async () => {
    simpleTable = ':Start\n1,One{Line~center,100}Two\n';
    tablesmith.addTable('folder', filename, simpleTable);
    expect(await tablesmith.evaluate(`[${filename}]`)).toBe('One<br/>Two');
  });
});
