"use client";

import { useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import L from "leaflet";
import type { Club } from "@/lib/api";

type Court = { slug: string; name: string; image?: string };

type Props = {
  clubs: (Club & { courts?: Court[] })[];
  userLocation: { lat: number; lon: number } | null;
};

function MapAutoCenter({ center }: { center: LatLngExpression }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

export default function ClubsMap({ clubs, userLocation }: Props) {
  const clubsWithCoords = useMemo(
    () =>
      clubs.filter(
        (c) => typeof c.lat === "number" && typeof c.lon === "number",
      ),
    [clubs],
  );

  const center: LatLngExpression =
    userLocation &&
    Number.isFinite(userLocation.lat) &&
    Number.isFinite(userLocation.lon)
      ? [userLocation.lat, userLocation.lon]
      : clubsWithCoords.length > 0
      ? [clubsWithCoords[0].lat as number, clubsWithCoords[0].lon as number]
      : [23.6345, -102.5528]; // centro MX

  return (
    <div className="w-full h-[480px] rounded-xl overflow-hidden border bg-muted/40">
      <MapContainer
        center={center}
        zoom={5}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapAutoCenter center={center} />

        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lon]}>
            <Popup>Tu ubicación aproximada</Popup>
          </Marker>
        )}

        {clubsWithCoords.map((club) => {
          const imgPathBase =
            (club.image_url ?? club.image) || "images/clubs/default.jpg";
          const imgPath = `/${String(imgPathBase).replace(/^\/?/, "")}`;

          const icon = L.divIcon({
            className: "",
            html: `
              <div style="
                width: 44px;
                height: 44px;
                border-radius: 9999px;
                overflow: hidden;
                box-shadow: 0 0 0 2px #ffffff;
                background-size: cover;
                background-position: center;
                background-color: #111827;
                background-image: url('${imgPath}');
              "></div>
            `,
            iconSize: [44, 44],
            iconAnchor: [22, 22],
          });

          const position: LatLngExpression = [
            club.lat as number,
            club.lon as number,
          ];

          const subtitleParts = [club.city, club.state, club.country]
            .filter(Boolean)
            .join(", ");

          return (
            <Marker key={club.slug} position={position} icon={icon}>
              <Popup>
                <div className="space-y-2">
                  <div>
                    <div className="font-semibold text-sm">{club.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {subtitleParts}
                    </div>
                  </div>
                  <a
                    href={`/recordings/${club.slug}`}
                    className="inline-flex px-2.5 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:opacity-90"
                  >
                    Ver grabaciones
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}