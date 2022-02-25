import { Link, useLoaderData } from "remix";
import type { LoaderFunction } from "remix";
import type { Place } from "@prisma/client";

import { db } from "~/utils/db.server";

type LoaderData = { place: Place };

export const loader: LoaderFunction = async ({ params }) => {
  const place = await db.place.findUnique({
    where: { id: params.placeId },
  });
  if (!place) throw new Error("Place not found");
  const data: LoaderData = { place };
  return data;
};

export default function PlaceRoute() {
  const data = useLoaderData<LoaderData>();
  return (
    <div>
      <Link to=".">{data.place.name}</Link>
      <p>{data.place.content}</p>
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div className="error-container">{`There was an error loading this place. Sorry.`}</div>
  );
}
