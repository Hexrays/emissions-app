import type { Trip } from '~/types';

interface TripSelectProps {
  options: Trip[];
  defaultValue?: string;
}

export default function TripSelect({ options, defaultValue }: TripSelectProps) {
  return (
    <p>
      Select a trip:{' '}
      <select name="slug" id="trips" defaultValue={defaultValue}>
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
