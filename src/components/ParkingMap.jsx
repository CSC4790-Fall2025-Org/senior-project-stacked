// src/components/ParkingMap.jsx
<<<<<<< HEAD
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import { useEffect, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-routing-machine";                      // routing
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import carImg from "../assets/car.png";

// Car icon
const carIcon = new L.Icon({
  iconUrl: carImg,
  iconSize: [50, 25],    
  iconAnchor: [25, 12],  
});

// helper to compute distance in miles (Haversine)
function haversineMiles([lat1, lon1], [lat2, lon2]) {
  const R = 3958.8 // miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))
}

function Routing({ start, end, setRouteCoords }) {
  const map = useMap();

  useEffect(() => {
    if (!start || !end) return;

    const control = L.Routing.control({
      waypoints: [
        L.latLng(start[0], start[1]),
        L.latLng(end[0], end[1]),
      ],
      router: L.Routing.osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",  // ⭐ no API key needed
      }),
      lineOptions: {
        styles: [{ color: "blue", weight: 5 }],
      },
      show: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      createMarker: () => null, // Hide default A/B markers
    })
      .on("routesfound", (e) => {
        const coords = e.routes[0].coordinates;
        setRouteCoords(coords);
      })
      .addTo(map);

    return () => {
      map.removeControl(control);
    };
  }, [start, end, map, setRouteCoords]);

  return null;
}

// CAR FOLLOWS ACTUAL ROUTE
function MovingCar({ routeCoords, progress }) {
  if (!routeCoords || routeCoords.length === 0) return null;

  const index = Math.floor((progress / 100) * (routeCoords.length - 1));
  const pos = routeCoords[index];

  return (
    <Marker
      position={[pos.lat, pos.lng]}
      icon={carIcon}
    />
  );
}
// check here
// helper component to fly to a selected lot
function FlyToLot({ lot }) {
  const map = useMap()
  useEffect(() => {
    if (lot) {map.flyTo(lot.coords, 18, { duration: 1.5 })
    }
  }, [lot, map])
  return null
}

// New component to animate a moving car marker
/*function MovingCar({ start, end, progress }) {
  const [position, setPosition] = useState(start)

  useEffect(() => {
    if (!start || !end) return
    // Linear interpolation between start & end based on progress %
    const lat = start[0] + (end[0] - start[0]) * (progress / 100)
    const lon = start[1] + (end[1] - start[1]) * (progress / 100)
    setPosition([lat, lon])
  }, [progress, start, end])

  return <Marker position={position} icon={carIcon}></Marker>
}*/

export default function ParkingMap({ lots, selectedLot, progress = 0 }) {
  const [userLocation, setUserLocation] = useState(null) // default Villanova center
  const [locationReady, setLocationReady] = useState(false)

  const [routeCoords, setRouteCoords] = useState([]);

   // Load GPS
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude])
        setLocationReady(true)
      },
      () => {
        // fallback if denied
        setUserLocation([40.037, -75.339]) //nova coordinates
        setLocationReady(true)
      }
    )
  }, [])
=======
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
  const ORS_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImY3Y2ZlMDMyMTg1NDRkMzM5NTA2MjA4OGY1NzE4ZjY5IiwiaCI6Im11cm11cjY0In0="; // ORS key

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
              geometry: { type: "LineString", coordinates: coords },
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
            geometry: { type: "LineString", coordinates: coords },
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
>>>>>>> e45583b (Fix simulated driving and changed Leaflet for smoother map experience using MapTiler routing API calls)

  // Wait until GPS is loaded
  if (!locationReady) {
    return (
      <div className="p-4 text-gray-600">
        Loading map…
      </div>
    )
  }
 // useEffect(() => {
  //  if (navigator.geolocation) {
  //    navigator.geolocation.getCurrentPosition(
  //      (pos) => {
  //        setUserLocation([pos.coords.latitude, pos.coords.longitude])
  //      },
  //      () => console.log("Geolocation blocked, using default Villanova coords")
  //    )
  //  }
  //}, [])

  return (
    <div className="h-[500px] mt-6 rounded-lg overflow-hidden shadow-lg relative">
<<<<<<< HEAD
      <MapContainer
        center={userLocation}
        zoom={15}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", zIndex: 0 }} // ensures overlays appear above map
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User marker */}
        <Marker position={userLocation}>
          <Popup>You are here</Popup>
        </Marker>

        {/* Parking lot markers */}
        {lots.map((lot, idx) => {
          const distance = haversineMiles(userLocation, lot.coords).toFixed(2)
          const eta = ((distance / 3) * 60).toFixed(0) // walking ~3 mph

          return (
            <div key={idx}>
              <Marker position={lot.coords}>
                <Popup>
                  <b>{lot.name}</b> <br />
                  Distance: {distance} miles <br />
                  ETA: {eta} mins
                </Popup>
              </Marker>

            </div>
          )
        })}

        {/* When a card is clicked, fly to that lot */}
        <FlyToLot lot={selectedLot} />

        {/*selectedLot && (
        <Routing start={userLocation} end={selectedLot.coords} />
      )*/}
        {selectedLot && (
        <Routing start={userLocation} end={selectedLot.coords} setRouteCoords={setRouteCoords}/>
        )}


        {/* Moving car simulation */}
        {selectedLot && (
        <MovingCar routeCoords={routeCoords} progress={progress} />
        )}

      </MapContainer>
=======
      <div ref={mapDivRef} style={{ width: "100%", height: "100%" }} />
>>>>>>> e45583b (Fix simulated driving and changed Leaflet for smoother map experience using MapTiler routing API calls)
    </div>
  );
}
