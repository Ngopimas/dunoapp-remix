import { ActionFunction, LinksFunction, LoaderFunction, redirect } from "remix";
import { useCatch, Link, json } from "remix";
import { Suspense, lazy, useEffect, useState } from "react";
import type { ReactNode } from "react";

import { db } from "~/utils/db.server";
import { requireUserId, getUserId } from "~/utils/session.server";
import globalStylesUrl from "~/styles/map.css";
// @ts-expect-error: Let's ignore this ts(1323) error about dynamic import support
const Map = lazy(() => import("~/components/Map")); // compiles

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: "https://unpkg.com/leaflet@latest/dist/leaflet.css",
    },
    {
      rel: "stylesheet",
      href: "https://www.unpkg.com/leaflet-control-geocoder@2.2.0/dist/Control.Geocoder.css",
    },
    {
      rel: "stylesheet",
      href: globalStylesUrl,
    },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (!userId) {
    throw new Response("Unauthorized", { status: 401 });
  }
  return {};
};

export function ClientOnly({ children }: { children: ReactNode }) {
  let [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted ? <>{children}</> : null;
}

function validatePlaceContent(content: string) {
  if (content.length < 5) {
    return `That description is too short`;
  }
}

function validatePlaceName(name: string) {
  if (name.length < 1) {
    return `That place's name is too short`;
  }
}

export type ActionData = {
  formError?: string;
  fieldErrors?: {
    name: string | undefined;
    content: string | undefined;
  };
  fields?: {
    name: string;
    content: string;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const form = await request.formData();
  const name = form.get("name");
  const content = form.get("content");
  const lat = form.get("_lat");
  const lng = form.get("_lng");
  const address = form.get("_address");
  if (
    typeof name !== "string" ||
    typeof content !== "string" ||
    typeof lat !== "string" ||
    typeof lng !== "string" ||
    typeof address !== "string"
  ) {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }

  const fieldErrors = {
    name: validatePlaceName(name),
    content: validatePlaceContent(content),
  };

  const fields = { name, content, lat, lng, address };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  const place = await db.place.create({ data: { ...fields, userId } });
  return redirect(`/places/${place.id}`);
};

export default function MapRoute() {
  return (
    <ClientOnly>
      <p>
        Search your hidden gem with its address and share it with the community.
      </p>
      <Suspense fallback={<p>You should see a map... soon?</p>}>
        <Map />
      </Suspense>
    </ClientOnly>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 401) {
    return (
      <div className="error-container">
        <p>You must be logged in to add a place.</p>
        <Link to="/login">Login</Link>
      </div>
    );
  }
}

export function ErrorBoundary() {
  return (
    <div className="error-container">
      Something unexpected went wrong. Sorry about that.
    </div>
  );
}
