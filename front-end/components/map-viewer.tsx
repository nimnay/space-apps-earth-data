"use client";

import { useState } from "react";
import RegionMap from "./region-map";

export default function MapViewer() {
  const [view, setView] = useState<'citizen'|'ems'>('citizen');

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        <label className="text-sm font-medium">View:</label>
        <select value={view} onChange={(e) => setView(e.target.value as 'citizen'|'ems')}
          className="px-3 py-2 rounded border">
          <option value="citizen">Citizen</option>
          <option value="ems">EMS</option>
        </select>
      </div>

      <RegionMap view={view} />
    </div>
  );
}
