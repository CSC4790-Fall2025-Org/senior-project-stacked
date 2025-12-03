// src/components/ParkingMap.jsx
import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import ors from "openrouteservice-js";

export default function ParkingMap({ lots, selectedLot, progress = 0 }) {
  const mapDivRef = useRef(null);
  const mapRef = useRef(null);
  const carRef = useRef(null);

  const [routeCoords, setRouteCoords] = useState([]);
  const [mapReady, setMapReady] = useState(false);

  // 🔑 keys (you can move to env later if you want)
  const MAPTILER_KEY = "znCx0MM46uIwMWhozVp3"; // your MapTiler key
  const ORS_KEY =
    "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImY3Y2ZlMDMyMTg1NDRkMzM5NTA2MjA4OGY1NzE4ZjY5IiwiaCI6Im11cm11cjY0In0="; // ORS key

  // ORS client
  const directions = new ors.Directions({ api_key: ORS_KEY });

  // ----------------- init map -----------------
  useEffect(() => {
    if (mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapDivRef.current,
      style: `https://api.maptiler.com/maps/streets/style.json?key=${MAPTILER_KEY}`,
      center: [-75.339, 40.037], // Villanova-ish
      zoom: 15,
    });

    map.addControl(new maplibregl.NavigationControl());
    map.on("load", () => setMapReady(true));

    mapRef.current = map;
  }, []);

  // ----------------- lot markers -----------------
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;

    const map = mapRef.current;

    // remove old markers if we stored them
    lots.forEach((lot) => {
      if (lot._marker) lot._marker.remove();

      lot._marker = new maplibregl.Marker()
        .setLngLat([lot.coords[1], lot.coords[0]])
        .addTo(map);
    });
  }, [lots, mapReady]);

  // helper: get user location with fallback
  function getUserLocation(cb) {
    if (!navigator.geolocation) {
      cb([-75.339, 40.037]); // fallback
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => cb([pos.coords.longitude, pos.coords.latitude]),
      () => cb([-75.339, 40.037])
    );
  }

  // ----------------- fetch & draw route when lot changes -----------------
  useEffect(() => {
    if (!selectedLot || !mapRef.current || !mapReady) return;

    const map = mapRef.current;

    getUserLocation(async (userLL) => {
      const lotLL = [selectedLot.coords[1], selectedLot.coords[0]];

      try {
        const geojson = await directions.calculate({
          coordinates: [userLL, lotLL],
          profile: "driving-car",
          format: "geojson",
        });

        const coords = geojson.features[0].geometry.coordinates;
        setRouteCoords(coords);

        // add / update route line
        if (!map.getSource("route")) {
          map.addSource("route", {
            type: "geojson",
            data: {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: coords,
              },
            },
          });

          map.addLayer({
            id: "route-line",
            type: "line",
            source: "route",
            layout: {
              "line-cap": "round",
              "line-join": "round",
            },
            paint: {
              "line-color": "#1D4ED8", // blue
              "line-width": 5,
            },
          });
        } else {
          map.getSource("route").setData({
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: coords,
            },
          });
        }

        // center on the start of the route
        if (coords.length > 0) {
          map.flyTo({
            center: coords[0],
            zoom: 16,
            duration: 1500,
          });
        }

        // create car marker at start if it doesn't exist
        if (!carRef.current && coords.length > 0) {
          const el = document.createElement("div");
          el.style.fontSize = "30px";
          el.innerHTML = "🚗";

          carRef.current = new maplibregl.Marker({
            element: el,
            anchor: "center",
          })
            .setLngLat(coords[0])
            .addTo(map);
        } else if (carRef.current && coords.length > 0) {
          carRef.current.setLngLat(coords[0]);
        }
      } catch (err) {
        console.error("ORS routing error:", err);
      }
    });
  }, [selectedLot, mapReady]);

  // ----------------- move car when progress changes -----------------
  useEffect(() => {
    if (!routeCoords.length || !carRef.current) return;

    // progress 0–100 → index in routeCoords
    const idx = Math.min(
      routeCoords.length - 1,
      Math.floor((progress / 100) * (routeCoords.length - 1))
    );
    const point = routeCoords[idx];
    carRef.current.setLngLat(point);
  }, [progress, routeCoords]);

  return (
    <div className="h-[500px] mt-6 rounded-lg overflow-hidden shadow-lg relative">
      <div ref={mapDivRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
