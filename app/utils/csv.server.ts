import csvToJson from 'csvtojson/v2';
import path from 'path';
import { InputRes } from '~/types';

const csvPath = path.join(__dirname, '..', 'csv');

export async function getGasGuzzler() {
  const inputsJSON = await csvToJson().fromFile(`${csvPath}/inputs.csv`);
  return inputsJSON[0];
}

export async function getInputs() {
  const inputsJSON = await csvToJson().fromFile(`${csvPath}/inputs.csv`);
  const inputs = inputsJSON
    .map(input => {
      input.slug = `${input.Year}-${input.Make}-${input.Model}-${input.Series}`
        .toLowerCase()
        .replace(/\s/g, '-');
      return input;
    })
    .reduce((acc, curr) => {
      acc[curr.slug] = curr;
      return acc;
    }, {} as InputRes);

  return inputs;
}

export async function getTrips() {
  const trips = await (
    await csvToJson().fromFile(`${csvPath}/trips.csv`)
  ).map(trip => {
    trip.slug = `${trip.Year}-${trip.Make}-${trip.Model}-${trip.Series}`
      .toLowerCase()
      .replace(/\s/g, '-');
    return trip;
  });
  return trips;
}

export async function getTrip(slug: string) {
  const trips = await getTrips();
  return trips.find(trip => trip.slug === slug);
}
