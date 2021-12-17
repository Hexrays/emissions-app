import type { Trip } from '~/types';
import { Form } from 'remix';

interface TripSelectProps {
  options: Trip[];
  defaultValue?: string;
}

export default function TripSelect({ options, defaultValue }: TripSelectProps) {
  return (
    <p>
      Select a trip:{' '}
      <select name="trip" id="trips" defaultValue={defaultValue}>
        <option value="">Select a trip</option>
        {options.map(trip => (
          <option value={trip.slug} key={trip.slug}>
            {trip.Year} {trip.Make} {trip.Model}
          </option>
        ))}
      </select>
    </p>
  );
}
