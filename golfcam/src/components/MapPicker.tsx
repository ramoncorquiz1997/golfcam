"use client";

import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";

type MapPickerProps = {
  initialLat?: number | null;
  initialLon?: number | null;
  onCancel: () => void;
  onSelect: (lat: number, lon: number) => void;
};

type ClickMarkerProps = {
  position: LatLngExpression;
  setPosition: (lat: number, lon: number) => void;
};

function ClickMarker({ position, setPosition }: ClickMarkerProps) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng.lat, e.latlng.lng);
    },
  });

  return <Marker position={position} />;
}

export default function MapPicker({
  initialLat,
  initialLon,
  onCancel,
  onSelect,
}: MapPickerProps) {
  const defaultCenter: LatLngExpression = [
    initialLat ?? 23.6345, // centro de MX aprox
    initialLon ?? -102.5528,
  ];

  const [currentLat, setCurrentLat] = useState<number>(
    initialLat ?? 31.86017,
  );
  const [currentLon, setCurrentLon] = useState<number>(
    initialLon ?? -116.60657,
  );

  const handleSetPosition = (lat: number, lon: number) => {
    setCurrentLat(lat);
    setCurrentLon(lon);
  };

  const handleUseLocation = () => {
    onSelect(currentLat, currentLon);
  };

  const markerPosition: LatLngExpression = [currentLat, currentLon];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background text-foreground rounded-xl shadow-xl w-[95vw] max-w-3xl max-h-[90vh] flex flex-col">
        <header className="px-4 py-3 border-b flex items-center justify-between">
          <h2 className="text-sm md:text-base font-semibold">
            Seleccionar ubicación en mapa
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-xs md:text-sm text-muted-foreground hover:text-foreground"
          >
            Cerrar
          </button>
        </header>

        <div className="p-3 flex-1 flex flex-col gap-3">
          <p className="text-xs text-muted-foreground">
            Haz click en el mapa para mover el pin. Luego confirma.
          </p>

            <div className="rounded-lg overflow-hidden border h-[360px] md:h-[420px]">
            {/* Mapa */}
            <MapContainer
                center={defaultCenter}
                zoom={10}
                className="w-full h-full"
                zoomControl={true}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <ClickMarker
                position={markerPosition}
                setPosition={handleSetPosition}
              />
            </MapContainer>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-xs">
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 rounded bg-muted">
                Lat: {currentLat.toFixed(5)}
              </span>
              <span className="px-2 py-1 rounded bg-muted">
                Lon: {currentLon.toFixed(5)}
              </span>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={onCancel}
                className="px-3 py-1 rounded border text-xs md:text-sm"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleUseLocation}
                className="px-3 py-1 rounded bg-primary text-primary-foreground text-xs md:text-sm"
              >
                Usar esta ubicación
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}