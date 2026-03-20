import * as fs from 'node:fs';
import * as path from 'node:path';
import { HousingPriceIndex, HousingPriceIndexData } from './types';

const ROOT_DIR = path.resolve(__dirname, '..');
const RAW_CSV_PATH = path.join(
  ROOT_DIR,
  'data',
  'raw',
  'housing_price_index.csv',
);
const OUTPUT_DIR = path.join(ROOT_DIR, 'data', 'processed');
const OUTPUT_PATH = path.join(OUTPUT_DIR, 'housing_price_index.json');

const PROVINCE_NAMES = new Set([
  'Canada',
  'Newfoundland and Labrador',
  'Prince Edward Island',
  'Nova Scotia',
  'New Brunswick',
  'Quebec',
  'Ontario',
  'Manitoba',
  'Saskatchewan',
  'Alberta',
  'British Columbia',
]);

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result.map((v) => v.trim());
}

function buildHousingPriceIndexInternal(): HousingPriceIndexData {
  const csvText = fs.readFileSync(RAW_CSV_PATH, 'utf8');
  const lines = csvText.split(/\r?\n/);

  const headerLine = lines[0];
  if (!headerLine) {
    throw new Error('CSV file is empty.');
  }

  const headers = parseCsvLine(headerLine);
  const colRef = headers.indexOf('REF_DATE');
  const colGeo = headers.indexOf('GEO');
  const colType = headers.indexOf('New housing price indexes');
  const colValue = headers.indexOf('VALUE');

  if (colRef === -1 || colGeo === -1 || colType === -1 || colValue === -1) {
    throw new Error(
      `Missing required columns. Found: ${headers.join(', ')}`,
    );
  }

  const data: HousingPriceIndexData = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;

    const cells = parseCsvLine(line);

    const refDate = cells[colRef];
    if (!refDate.endsWith('-12')) continue;

    const indexType = cells[colType];
    if (indexType !== 'Total (house and land)') continue;

    const geo = cells[colGeo];
    if (!PROVINCE_NAMES.has(geo)) continue;

    const valueRaw = cells[colValue];
    if (!valueRaw || valueRaw === '..' || valueRaw === 'x') continue;

    const indexValue = Number(valueRaw);
    if (Number.isNaN(indexValue)) continue;

    const year = Number(refDate.slice(0, 4));

    const record: HousingPriceIndex = {
      province: geo,
      year,
      index: indexValue,
    };

    data.push(record);
  }

  return data;
}

export function buildHousingPriceIndex(): HousingPriceIndexData {
  return buildHousingPriceIndexInternal();
}

if (require.main === module) {
  const records = buildHousingPriceIndex();

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(records, null, 2), 'utf8');

  const provinces = new Set(records.map((r) => r.province));
  const years = [...new Set(records.map((r) => r.year))].sort();

  console.log(
    `Wrote ${records.length} housing price index records to ${OUTPUT_PATH}`,
  );
  console.log(`Provinces: ${[...provinces].join(', ')}`);
  console.log(`Years: ${years[0]}–${years[years.length - 1]}`);
}
