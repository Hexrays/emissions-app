import type {
  MetaFunction,
  LoaderFunction,
  ActionFunction,
  LinksFunction,
} from 'remix';
import { useLoaderData, json, Outlet, Form, redirect, useSubmit } from 'remix';
import TripSelect from '~/components/trip-select';
import type { Trip } from '~/types';
import { getTrips } from '~/utils/csv.server';
import tripsStylesUrl from '~/styles/trips.css';

export let meta: MetaFunction = () => {
  return {
    title: '⚡',
    description: 'Compare Your EV to a Gas Guzzler.',
  };
};

// https://remix.run/api/app#links
export let links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: tripsStylesUrl }];
};

export let loader: LoaderFunction = async ({ params }) => {
  const trips = await getTrips();

  return json({ trips, slug: params.slug });
};

export let action: ActionFunction = async ({ request }) => {
  let formData = await request.formData();
  let trip = formData.get('trip');

  return redirect(`/trips/${trip}`);
};

interface LoaderData {
  trips: Trip[];
  slug?: string;
}

export default function Trips() {
  let { trips, slug } = useLoaderData<LoaderData>();
  const submit = useSubmit();

  function handleChange(event: React.FormEvent<HTMLFormElement>) {
    submit(event.currentTarget, { replace: true });
  }

  return (
    <div className="trip_container">
      <main>
        <Form method="post" onChange={handleChange}>
          <TripSelect options={trips} defaultValue={slug} />
        </Form>
      </main>
      <Outlet />
    </div>
  );
}
