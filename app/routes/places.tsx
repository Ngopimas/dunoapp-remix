import type { LinksFunction } from "remix";
import { Outlet, Link } from "remix";

import stylesUrl from "~/styles/restaurants.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export default function placesRoute() {
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
        </div>
      </header>
      <main className="restaurants-main">
        <div className="container">
          <div className="restaurants-list">
            <Link to="." className="button">
              🎲 Random
            </Link>
            <p>Here are a few more places to check out:</p>
            <ul>
              <li>
                <Link to="some-restaurant-id">Hippo</Link>
              </li>
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
