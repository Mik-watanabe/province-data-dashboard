import * as fs from 'node:fs';
import * as path from 'node:path';
import { ProvincePopulation, ProvincePopulationData } from './types';

const ROOT_DIR = path.resolve(__dirname, '..'); // points to app/
const RAW_CSV_PATH = path.join(
  ROOT_DIR,
  'data',
  'raw',
  'canada_province_population.csv',
);
const OUTPUT_DIR = path.join(ROOT_DIR, 'data', 'processed');
const OUTPUT_PATH = path.join(OUTPUT_DIR, 'province_population.json');

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

function buildProvincePopulationQ4Internal(): ProvincePopulationData {
  const csvText = fs.readFileSync(RAW_CSV_PATH, 'utf8');
  const lines = csvText.split(/\r?\n/);

  const headerIndex = lines.findIndex((line) =>
    line.startsWith('"Geography"'),
  );

  if (headerIndex === -1) {
    throw new Error('Could not find header row starting with "Geography".');
  }

  const headerCells = parseCsvLine(lines[headerIndex]);

  const q4Columns: { index: number; year: number }[] = [];

  for (let i = 1; i < headerCells.length; i++) {
    const cell = headerCells[i].replace(/^"|"$/g, '');
    const match = cell.match(/^Q4 (\d{4})$/);

    if (match) {
      q4Columns.push({ index: i, year: Number(match[1]) });
    }
  }

  if (q4Columns.length === 0) {
    throw new Error('No Q4 columns found in CSV header.');
  }


  const data: ProvincePopulationData = [];

  for (let rowIndex = headerIndex + 2; rowIndex < lines.length; rowIndex++) {
    const line = lines[rowIndex];
    if (!line || line.startsWith('Footnotes:')) {
      break;
    }

    if (!line.includes(',')) {
      continue;
    }

    const cells = parseCsvLine(line);
    const geographyRaw = cells[0]?.replace(/^"|"$/g, '').trim();

    if (!geographyRaw) {
      continue;
    }

    const provinceName = geographyRaw.replace(/\s+\d+$/, '');

    q4Columns.forEach(({ index, year }) => {
      const valueRaw = cells[index] ?? '';
      const cleaned = valueRaw.replace(/"/g, '').replace(/,/g, '').trim();

      if (!cleaned) {
        return;
      }

      const population = Number(cleaned);

      if (Number.isNaN(population)) {
        return;
      }

      const record: ProvincePopulation = {
        province: provinceName,
        population,
        year,
      };

      data.push(record);
    });
  }

  return data;
}

export function buildProvincePopulationQ4(): ProvincePopulationData {
  return buildProvincePopulationQ4Internal();
}

if (require.main === module) {
  const records = buildProvincePopulationQ4();

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(records, null, 2), 'utf8');

  console.log(
    `Wrote ${records.length} Q4 population records to ${OUTPUT_PATH}`,
  );
}