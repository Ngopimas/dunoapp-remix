import type { LinksFunction, MetaFunction } from "remix";
import { Link } from "remix";

import stylesUrl from "~/styles/index.css";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: stylesUrl,
    },
  ];
};

export const meta: MetaFunction = () => ({
  title: "DUNOapp",
  description: "Let's find where to eat.",
});

export default function Index() {
  return (
    <div className="container">
      <div className="content">
        <h1>
          DUNO <span>where to eat?</span>
        </h1>
        <nav>
          <ul>
            <li>
              <Link prefetch="intent" to="places">
                Find your food
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
