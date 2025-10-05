"use client";

import { useState } from "react";
import RegionMap from "./region-map";
import InlineReportForm from "./inline-report-form";
import type { MapView, Location } from "@/types/map";

export default function MapViewer() {
  const [view, setView] = useState<MapView>("citizen");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        <label className="text-sm font-medium text-slate-700">View:</label>
        <select
          value={view}
          onChange={(e) => setView(e.target.value as MapView)}
          className="px-3 py-2 rounded border text-slate-700"
        >
          <option value="citizen">Citizen</option>
          <option value="ems">EMS</option>
        </select>
      </div>

      <RegionMap view={view} />
      
      <InlineReportForm />
    </div>
  );
}
