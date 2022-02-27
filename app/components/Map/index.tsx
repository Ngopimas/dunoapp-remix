import { useActionData, Form } from "remix";
import { useState } from "react";
import { ActionData } from "~/routes/places/new";
import type { LatLng, LatLngExpression } from "leaflet";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
} from "react-leaflet";
import { getUserId } from "~/utils/session.server";
// @ts-expect-error: import js file : () => null
import LeafletControlGeocoder from "~/components/LeafletControlGeocoder";

interface NominatimRes {
  center?: LatLng;
  html?: string;
  icon?: string;
  name?: string;
  properties?: {
    address: string;
    city: string;
    city_block: string;
    city_district: string;
    country: string;
    country_code: string;
    county: string;
    house_number: string;
    postcode: string;
    region: string;
    road: string;
    state: string;
    suburb: string;
  };
}

const icon = L.icon({
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
  iconUrl: "https://leafletjs.com/examples/custom-icons/leaf-green.png",
  shadowUrl: "https://leafletjs.com/examples/custom-icons/leaf-shadow.png",
});

function MapPlaceholder() {
  return (
    <p>
      Map of Paris.{" "}
      <noscript>You need to enable JavaScript to see this map.</noscript>
    </p>
  );
}

function MarkerItem({ item }: { item: NominatimRes }) {
  const actionData = useActionData<ActionData>();

  if (item?.center)
    return (
      <>
        <Popup position={[item.center.lat + 0.0002, item.center.lng]}>
          <p>{item.name}</p>
          <Form method="post" className="new-restaurant">
            <input type="hidden" name="_lat" value={item.center.lat} />
            <input type="hidden" name="_lng" value={item.center.lng} />
            <input type="hidden" name="_address" value={item.name} />
            <div>
              <label>
                Place name:{" "}
                <input
                  type="text"
                  defaultValue={actionData?.fields?.name}
                  name="name"
                  aria-invalid={
                    Boolean(actionData?.fieldErrors?.name) || undefined
                  }
                  aria-errormessage={
                    actionData?.fieldErrors?.name ? "name-error" : undefined
                  }
                />
                {actionData?.fieldErrors?.name ? (
                  <p
                    className="form-validation-error"
                    role="alert"
                    id="name-error"
                  >
                    {actionData.fieldErrors.name}
                  </p>
                ) : null}
              </label>
            </div>
            <div>
              <label>
                Description:{" "}
                <textarea
                  defaultValue={actionData?.fields?.content}
                  name="content"
                  aria-invalid={
                    Boolean(actionData?.fieldErrors?.content) || undefined
                  }
                  aria-errormessage={
                    actionData?.fieldErrors?.content
                      ? "content-error"
                      : undefined
                  }
                />
              </label>
              {actionData?.fieldErrors?.content ? (
                <p
                  className="form-validation-error"
                  role="alert"
                  id="content-error"
                >
                  {actionData.fieldErrors.content}
                </p>
              ) : null}
            </div>
            <div>
              <button type="submit" className="button large">
                Add this place
              </button>
            </div>
          </Form>
        </Popup>

        <Marker position={[item.center.lat, item.center.lng]}>
          <Popup>
            <p>{item.name}</p>
            <Form method="post" className="new-restaurant">
              <input type="hidden" name="_lat" value={item.center.lat} />
              <input type="hidden" name="_lng" value={item.center.lng} />
              <input type="hidden" name="_address" value={item.name} />
              <div>
                <label>
                  Place name:{" "}
                  <input
                    type="text"
                    defaultValue={actionData?.fields?.name}
                    name="name"
                    aria-invalid={
                      Boolean(actionData?.fieldErrors?.name) || undefined
                    }
                    aria-errormessage={
                      actionData?.fieldErrors?.name ? "name-error" : undefined
                    }
                  />
                  {actionData?.fieldErrors?.name ? (
                    <p
                      className="form-validation-error"
                      role="alert"
                      id="name-error"
                    >
                      {actionData.fieldErrors.name}
                    </p>
                  ) : null}
                </label>
              </div>
              <div>
                <label>
                  Description:{" "}
                  <textarea
                    defaultValue={actionData?.fields?.content}
                    name="content"
                    aria-invalid={
                      Boolean(actionData?.fieldErrors?.content) || undefined
                    }
                    aria-errormessage={
                      actionData?.fieldErrors?.content
                        ? "content-error"
                        : undefined
                    }
                  />
                </label>
                {actionData?.fieldErrors?.content ? (
                  <p
                    className="form-validation-error"
                    role="alert"
                    id="content-error"
                  >
                    {actionData.fieldErrors.content}
                  </p>
                ) : null}
              </div>
              <div>
                <button type="submit" className="button large">
                  Add this place
                </button>
              </div>
            </Form>
          </Popup>
        </Marker>
      </>
    );
  return null;
}

function Map() {
  const [geoCode, setGeoCode] = useState<NominatimRes>({});
  const position = [48.858331, 2.3726604] as LatLngExpression;
  const greenspacePosition = [48.8583, 2.3726] as LatLngExpression;

  return (
    <MapContainer
      position={position}
      center={position}
      zoom={17}
      placeholder={<MapPlaceholder />}
      style={{ height: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <CircleMarker
        center={greenspacePosition}
        pathOptions={{ color: "green" }}
        radius={15}
      >
        <Popup>
          <p>Greenspace Paris</p>
          <p>28 Rue du Chemin Vert, 75011 Paris</p>
          <a href="https://greenspace-paris.com/">
            https://greenspace-paris.com
          </a>
        </Popup>
      </CircleMarker>
      {geoCode.center ? <MarkerItem item={geoCode} /> : null}
      <LeafletControlGeocoder setGeoCode={setGeoCode} />
    </MapContainer>
  );
}

export default Map;
