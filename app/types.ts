export interface Months {
  Jan: string;
  Feb: string;
  Mar: string;
  Apr: string;
  May: string;
  Jun: string;
  Jul: string;
  Aug: string;
  Sep: string;
  Oct: string;
  Nov: string;
  Dec: string;
}

export interface Trip extends Months {
  slug: string;
  Make: string;
  Model: string;
  Series: string;
  Style: string;
  Year: string;
}

export interface Vehicle {
  slug: string;
  'Capacity (kWh)': string;
  Classification: string;
  'Covered?': string;
  'Fuel Type': string;
  'MPGe (Note that this is electric mpge for PHEVs)': string;
  Make: string;
  'Miles per gallon': string;
  'Miles per kWh': string;
  Model: string;
  Series: string;
  Style: string;
  'Total Range': string;
  Year: string;
}

export type HeaderMap = {
  [key: string]: keyof Vehicle;
};

export type InputRes = {
  [id: string]: Vehicle;
};
