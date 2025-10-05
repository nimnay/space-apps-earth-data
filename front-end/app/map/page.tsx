"use client";

import MapViewer from "@/components/map-viewer";
import { useState } from "react";

export default function Page() {
  const [showAqi, setShowAqi] = useState(false);

  return (
    <main className="relative w-full h-screen">
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setShowAqi((v) => !v)}
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition shadow"
          aria-pressed={showAqi}
        >
          {showAqi ? "Show Wildfire Map" : "Show AQI Map"}
        </button>
      </div>

      {showAqi ? (
        <div className="mx-auto max-w-7xl px-6 py-6 h-full overflow-auto">
          <div className="flex items-center justify-between mb-6 pr-32">
            <h1 className="text-2xl font-bold">AQI Map</h1>
          </div>
          <iframe
            title="AQI Map"
            src="/message.html"
            className="w-full h-full border-0"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="mx-auto max-w-7xl px-6 py-6 h-full overflow-auto">
          <div className="flex items-center justify-between mb-6 pr-32">
            <h1 className="text-2xl font-bold">Regional Map</h1>
          </div>
          <p className="mb-6 text-muted-foreground">
            Showing Georgia, North Carolina, South Carolina, and Tennessee.
          </p>
          <MapViewer />
        </div>
      )}
    </main>
  );
}
