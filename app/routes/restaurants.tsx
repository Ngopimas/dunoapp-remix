import { Outlet } from "remix";

export default function RestaurantsRoute() {
  return (
    <div>
      <h1>Restaurants</h1>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
