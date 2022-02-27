import {
  Link,
  useLoaderData,
  useCatch,
  useParams,
  redirect,
  LinksFunction,
  Form,
} from "remix";
import type { ActionFunction, LoaderFunction, MetaFunction } from "remix";
import type { Place } from "@prisma/client";

import { db } from "~/utils/db.server";
import { getUserId, requireUserId } from "~/utils/session.server";

import stylesUrl from "~/styles/restaurant.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export const meta: MetaFunction = ({
  data,
}: {
  data: LoaderData | undefined;
}) => {
  if (!data) {
    return {
      title: "No place",
      description: "No place found",
    };
  }
  return {
    title: `"${data.place.name}" is on DUNOapp`,
    description: `We love "${data.place.name}" and hope you do too.`,
  };
};

type LoaderData = { place: Place; isOwner: boolean };

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await getUserId(request);
  const place = await db.place.findUnique({
    where: { id: params.placeId },
  });

  if (!place) {
    throw new Response("Place not found.", {
      status: 404,
    });
  }
  return { place, isOwner: userId === place.userId } as LoaderData;
};

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();
  if (form.get("_method") !== "delete") {
    throw new Response(`The _method ${form.get("_method")} is not supported`, {
      status: 400,
    });
  }
  const userId = await requireUserId(request);
  const place = await db.place.findUnique({
    where: { id: params.placeId },
  });
  if (!place) {
    throw new Response("Can't delete what does not exist", {
      status: 404,
    });
  }
  if (place.userId !== userId) {
    throw new Response("Pssh, nice try. Let's say, that's not from you 🤫", {
      status: 401,
    });
  }
  await db.place.delete({ where: { id: params.placeId } });
  return redirect("/places");
};

export default function PlaceRoute() {
  const data = useLoaderData<LoaderData>();
  return (
    <div>
      <span className="title">
        <Link to=".">{data.place.name}</Link>
        {data.isOwner && (
          <Form method="post" style={{ width: "fit-content" }}>
            <input type="hidden" name="_method" value="delete" />
            <button
              type="submit"
              className="button logout"
              title="Are you sure to delete this place?"
            >
              🗑️
            </button>
          </Form>
        )}
      </span>
      <p>{data.place.address}</p>
      <p>{data.place.content}</p>
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  const params = useParams();
  switch (caught.status) {
    case 400: {
      return (
        <div className="error-container">
          What you're trying to do is not allowed.
        </div>
      );
    }
    case 404: {
      return (
        <div className="error-container">
          Huh? What the heck is {params.placeId}?
        </div>
      );
    }
    case 401: {
      return (
        <div className="error-container">
          Sorry, but {params.placeId} is not from you.
        </div>
      );
    }
    default: {
      throw new Error(`Unhandled error: ${caught.status}`);
    }
  }
}

export function ErrorBoundary() {
  return (
    <div className="error-container">{`There was an error loading this place. Sorry.`}</div>
  );
}
