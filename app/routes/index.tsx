import type { MetaFunction, LoaderFunction } from 'remix';
import { useLoaderData, json, Form, useSubmit } from 'remix';
import type { Trip } from '~/types';
import TripForm from '~/components/trip-select';
import { getTrips } from '~/utils/csv.server';

export let meta: MetaFunction = () => {
  return {
    title: '⚡ Emissions App',
    description: 'Electric > Gas',
  };
};

export let loader: LoaderFunction = async ({ params }) => {
  const trips = await getTrips();
  return json({ trips });
};

interface LoaderData {
  trips: Trip[];
}

export default function Index() {
  let { trips } = useLoaderData<LoaderData>();
  const submit = useSubmit();

  function handleChange(event: React.FormEvent<HTMLFormElement>) {
    submit(event.currentTarget, { replace: true });
  }

  return (
    <div className="app">
      <main>
        <Form method="post" action="/trips" onChange={handleChange}>
          <TripForm options={trips} />
        </Form>
      </main>
    </div>
  );
}
