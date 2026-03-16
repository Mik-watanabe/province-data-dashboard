export const PROVINCE_MAP: Record<string, string> = {
    BC: 'British Columbia',
    AB: 'Alberta',
    SK: 'Saskatchewan',
    MB: 'Manitoba',
    ON: 'Ontario',
    QC: 'Quebec',
    NB: 'New Brunswick',
    NS: 'Nova Scotia',
    PE: 'Prince Edward Island',
    NL: 'Newfoundland and Labrador',
    YT: 'Yukon',
    NT: 'Northwest Territories',
    NU: 'Nunavut',
  };
  
  export type ProvinceCode = keyof typeof PROVINCE_MAP;
  
  export const PROVINCE_CODES = Object.keys(PROVINCE_MAP) as ProvinceCode[];
  