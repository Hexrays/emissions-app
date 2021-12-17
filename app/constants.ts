import type { HeaderMap, Months } from './types';
export const LBS_CO2_PER_KWH = 0.9;
export const DOLLARS_PER_KWH = 0.14;

export const LBS_CO2_PER_GAL_GAS = 19.59;
export const DOLLARS_PER_GAL_GAS = 3.6;

export const HEADER_MAP: HeaderMap = {
  capacity: 'Capacity (kWh)',
  classification: 'Classification',
  covered: 'Covered?',
  fuelType: 'Fuel Type',
  mpge: 'MPGe (Note that this is electric mpge for PHEVs)',
  make: 'Make',
  mpg: 'Miles per gallon',
  mpk: 'Miles per kWh',
  model: 'Model',
  series: 'Series',
  style: 'Style',
  totalRange: 'Total Range',
  year: 'Year',
};

export const MONTHS: (keyof Months)[] = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
