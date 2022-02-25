import type { LoaderFunction } from "remix";
import { useLoaderData, Link } from "remix";
import type { Place } from "@prisma/client";

import { db } from "~/utils/db.server";

type LoaderData = { randomPlace: Place };

export const loader: LoaderFunction = async () => {
  const count = await db.place.count();
  const randomRowNumber = Math.floor(Math.random() * count);
  const [randomPlace] = await db.place.findMany({
    take: 1,
    skip: randomRowNumber,
  });
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
