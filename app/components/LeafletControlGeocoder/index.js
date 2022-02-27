import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L, { Control } from "leaflet";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";

export default function LeafletControlGeocoder({ setGeoCode }) {
  const map = useMap();

  useEffect(() => {
    let geocoder = Control.Geocoder.nominatim();
    if (typeof URLSearchParams !== "undefined" && location.search) {
      // parse /?geocoder=nominatim from URL
      const params = new URLSearchParams(location.search);
      const geocoderString = params.get("geocoder");
      if (geocoderString && Control.Geocoder[geocoderString]) {
        geocoder = Control.Geocoder[geocoderString]();
      } else if (geocoderString) {
        console.warn("Unsupported geocoder", geocoderString);
      }
    }

    Control.geocoder({
      query: "",
      placeholder: "Search here...",
      defaultMarkGeocode: false,
      geocoder,
      collapsed: false,
    })
      .on("markgeocode", function (e) {
        setGeoCode(e.geocode);
      })
      .addTo(map);
  }, []);

  return null;
}
