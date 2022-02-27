import type { LinksFunction, LoaderFunction } from "remix";
import { Link, Outlet, useLoaderData, Form } from "remix";

import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";

import stylesUrl from "~/styles/restaurants.css";
import { Place } from "@prisma/client";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

type LoaderData = {
  // placeListItems: Array<{ id: string; name: string }>;
  placeListItems: Array<Pick<Place, "id" | "name">>;
  user: Awaited<ReturnType<typeof getUser>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const randomPick = (values: string[]) => {
    const index = Math.floor(Math.random() * values.length);
    return values[index];
  };
  const itemCount = await db.place.count();
  const randomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  const orderDir = randomPick([`asc`, `desc`]);
  const orderBy = randomPick([
    "createdAt",
    "updatedAt",
    "name",
    `content`,
    `id`,
  ]);
  const placeListItems = await db.place.findMany({
    take: 3,
    select: { id: true, name: true },
    orderBy: { [orderBy]: orderDir },
    skip: randomNumber(0, itemCount - 1),
  });
  const user = await getUser(request);

  return {
    placeListItems,
    user,
  } as LoaderData;
};

export default function placesRoute() {
  const data = useLoaderData<LoaderData>();
  return (
    <div className="restaurants-layout">
      <header className="restaurants-header">
        <div className="container">
          <h1 className="home-link">
            <Link to="/" title="DUNOapp" aria-label="DUNOapp">
              <span className="logo">DUN🍔</span>
              <span className="logo-medium">DUN🍔app</span>
            </Link>
          </h1>
          {data.user ? (
            <div className="user-info">
              <span>{`Hi ${data.user.username}`}</span>
              <Form action="/logout" method="post">
                <button type="submit" className="button logout" title="Logout">
                  🚪🚶
                </button>
              </Form>
            </div>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </header>
      <main className="restaurants-main">
        <div className="container">
          <div className="restaurants-list">
            <Link to="." className="button" title="Get a random place">
              🎲 Random
            </Link>
            <p>Here are a few more places to check out:</p>
            <ul>
              {data.placeListItems.map((place) => (
                <li key={place.id}>
                  <Link prefetch="intent" to={place.id}>
                    {place.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link to="new">Or add a new place</Link>
          </div>
          <div className="restaurants-outlet">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
