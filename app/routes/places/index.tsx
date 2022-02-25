import { useLoaderData, Link, useCatch } from "remix";
import type { LoaderFunction, MetaFunction } from "remix";
import type { Place } from "@prisma/client";

import { db } from "~/utils/db.server";

type LoaderData = { randomPlace: Place };

export const meta: MetaFunction = () => ({
  title: "DUNOapp - Random",
  description: "Let's find where to eat.",
});

export const loader: LoaderFunction = async () => {
  const count = await db.place.count();
  const randomRowNumber = Math.floor(Math.random() * count);
  const [randomPlace] = await db.place.findMany({
    take: 1,
    skip: randomRowNumber,
  });

  if (!randomPlace) {
    throw new Response("No place found", {
      status: 404,
    });
  }
  const data: LoaderData = { randomPlace };
  return data;
};

export default function PlacesIndexRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <div>
      <p>Here's a random place to eat:</p>
      <Link to={data.randomPlace.id}>{data.randomPlace.name}</Link>
      <p>{data.randomPlace.content}</p>
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return (
      <div className="error-container">There are no places to display.</div>
    );
  }
  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}

export function ErrorBoundary() {
  return <div className="error-container">Oopsy...</div>;
}
